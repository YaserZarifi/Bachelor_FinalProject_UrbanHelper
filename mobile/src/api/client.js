import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * Backend base URL.
 * - In Expo Go on a physical device, `localhost` points at the phone, not your
 *   PC. Set EXPO_PUBLIC_API_BASE to your machine's LAN IP, e.g.
 *   EXPO_PUBLIC_API_BASE=http://192.168.1.20:8080
 */
export const API_BASE = (
  process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8080'
).replace(/\/$/, '');

export const API_ROOT = `${API_BASE}/api`;

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// ── Token storage (SecureStore) ──────────────────────────────────────────────
export async function getAccessToken() {
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
}
export async function getRefreshToken() {
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}
export async function setTokens(access, refresh) {
  if (access) await SecureStore.setItemAsync(ACCESS_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}
export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY).catch(() => {});
  await SecureStore.deleteItemAsync(REFRESH_KEY).catch(() => {});
}

// ── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({ baseURL: API_ROOT, timeout: 30000 });

// Called when a stored session turns out to be dead (refresh rejected). Lets
// AuthContext drop the ghost user so the UI falls back to guest mode.
let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh the access token once on 401, then replay the request. If the refresh
// itself fails, the credentials are dead — clear them so every subsequent
// request (guest report create/view included) goes out anonymously instead of
// looping on 401s forever.
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && original && !original._retried) {
      original._retried = true;
      const hadToken = !!(await getAccessToken());
      let newAccess = null;
      try {
        if (!refreshing) refreshing = doRefresh();
        newAccess = await refreshing;
      } catch {
        newAccess = null;
      } finally {
        refreshing = null;
      }
      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
      if (hadToken) {
        await clearTokens();
        onUnauthorized?.();
      }
    }
    return Promise.reject(error);
  }
);

async function doRefresh() {
  const refresh = await getRefreshToken();
  if (!refresh) return null;
  const res = await axios.post(`${API_ROOT}/auth/token/refresh/`, { refresh });
  const access = res.data?.access;
  if (access) await SecureStore.setItemAsync(ACCESS_KEY, access);
  return access;
}

/**
 * True server-reachability probe. Hits the unauthenticated /api/health/ endpoint
 * with a short timeout, using a bare axios (no auth interceptor / refresh loop),
 * so callers can distinguish "connected to the API server" from mere internet
 * connectivity. Returns true only on a 2xx response.
 */
export async function pingServer(timeoutMs = 4000) {
  try {
    const res = await axios.get(`${API_ROOT}/health/`, { timeout: timeoutMs });
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}

// ── GeoJSON helpers (mirror frontend-citizen api/client.js) ──────────────────
export function flattenFeatures(payload) {
  if (!payload) return [];
  if (payload.type === 'FeatureCollection' && Array.isArray(payload.features)) {
    return payload.features.map(flattenFeature);
  }
  if (payload.type === 'Feature') return [flattenFeature(payload)];
  if (Array.isArray(payload)) return payload;
  return [];
}

const WKT_POINT = /POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i;

/** `[lng, lat]` from a GeoJSON geometry object or an (E)WKT `POINT` string. */
function geometryLngLat(geometry) {
  if (!geometry) return [];
  if (Array.isArray(geometry.coordinates)) return geometry.coordinates;
  if (typeof geometry === 'string') {
    const m = geometry.match(WKT_POINT);
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return [];
}

/** Collapse a GeoJSON Feature into a flat object with lat/lng. */
export function flattenFeature(f) {
  if (!f || f.type !== 'Feature') return f;
  const [lng, lat] = geometryLngLat(f.geometry);
  return {
    ...f.properties,
    id: f.id ?? f.properties?.id,
    lng,
    lat,
    guest_access_token:
      f.properties?.guest_access_token ?? f.guest_access_token ?? null,
  };
}

export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function wsBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_WS_BASE || API_BASE.replace(/^http/, 'ws');
  return raw.replace(/\/$/, '');
}
