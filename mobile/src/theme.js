/**
 * شهریاور design tokens — light, minimal, professional.
 *
 * A white "paper" canvas, near‑black text, 1px hairline borders, and a single
 * restrained amber accent (flat fills only — no gradients, no glow). Status
 * colours are muted but still distinct. RTL‑first, Vazirmatn.
 *
 * Export keys are kept stable (`brand` / `aurora` / `emerald` / `amber` / `rose`
 * / `ink` / `surface` …) so every screen keeps working; several are now
 * deprecated aliases that just point at a neutral value. `onBrand` is the
 * readable near‑black text colour to place on an amber surface.
 */

export const colors = {
  // Amber — the single interactive accent. `brand` kept for back‑compat.
  brand: {
    50: '#fff8ea',
    100: '#fdecc4',
    200: '#fbdd97',
    300: '#f9c95a',
    400: '#f9b526',
    500: '#f2a20d', // accent
    600: '#d67f04', // accent — pressed / on‑white foreground
    700: '#b15c08',
    800: '#8f480e',
    900: '#763b0f',
    950: '#451e05',
  },
  // Muted green — success / resolved / live. Deprecated ramp (retoned).
  civic: {
    300: '#9ec9b4',
    400: '#6ba888',
    500: '#3f7d5b',
    600: '#356b4d',
    700: '#2c5a41',
  },
  // Muted blue — info / in‑progress. Deprecated ramp (retoned).
  sky: {
    300: '#a9c2d6',
    400: '#7d9fbb',
    500: '#5b7a9d',
    600: '#4c6788',
  },
  // Muted red — urgent / crisis. Deprecated ramp (retoned).
  coral: {
    300: '#d8b0ac',
    400: '#c58079',
    500: '#b04a44',
    600: '#8f3d38',
  },
  // Legacy "aurora" keys remapped onto muted equivalents so old references render.
  aurora: {
    violet: '#f2a20d', // → amber
    cyan: '#5b7a9d', // → muted blue
    teal: '#3f7d5b', // → muted green
    fuchsia: '#b04a44', // → muted red
    sky: '#5b7a9d',
  },

  // Paper canvas + neutral fills
  canvas: '#ffffff',
  card: '#ffffff',
  hairline: '#ececec',
  ink: '#ffffff', // deprecated alias → canvas (was the dark canvas)
  ink2: '#f6f6f5', // deprecated alias → subtle zoned background
  surface: '#f4f4f5', // neutral fill (icon tiles, thumbnails, input bg)
  surfaceStrong: '#eaeaec', // pressed rows / stronger fill
  border: '#ececec', // hairline 1px — the workhorse separator
  borderStrong: '#dcdcdc', // input borders, card edges

  white: '#ffffff',
  onBrand: '#1a1a1a', // readable near‑black text on amber
  text: '#1a1a1a',
  textMuted: '#5f5f5f',
  textFaint: '#9b9b9b',

  // Semantic aliases
  emerald: '#3f7d5b',
  emeraldSoft: '#e9f1eb',
  amber: '#f2a20d',
  amberSoft: '#fbf1de',
  rose: '#b04a44',
  roseSoft: '#f6eae9',
  slate: '#6b7280',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  pill: 999,
};

export const spacing = (n) => n * 4;

export const fonts = {
  light: 'Vazir_300',
  regular: 'Vazir_400',
  medium: 'Vazir_500',
  semibold: 'Vazir_600',
  bold: 'Vazir_700',
  extrabold: 'Vazir_800',
  black: 'Vazir_900',
};

// One subtle neutral shadow. `glow` / `emerald` are deprecated aliases of it —
// apply only to opaque white floating surfaces (tab bar, toast, dialog).
const subtle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 2,
  elevation: 1,
};

export const shadow = {
  card: subtle,
  glow: subtle,
  emerald: subtle,
  none: {},
};

// Default RTL text style helpers
export const rtlText = { writingDirection: 'rtl', textAlign: 'right' };
