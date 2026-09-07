/** Report lifecycle — mirrors backend reports/serializers ALLOWED_STATUS_TRANSITIONS. */
export const STATUS_ORDER = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export const STATUS_LABEL = {
  SUBMITTED: 'ثبت شده',
  UNDER_REVIEW: 'در حال بررسی',
  ASSIGNED: 'ارجاع داده‌شده',
  IN_PROGRESS: 'در حال اقدام',
  RESOLVED: 'حل‌شده',
  CLOSED: 'مختومه',
};

// Muted, still mutually distinct. All six pass AA on a white canvas.
export const STATUS_COLOR = {
  SUBMITTED: '#6b7280', // neutral grey
  UNDER_REVIEW: '#5b7a9d', // muted blue
  ASSIGNED: '#8a6d3b', // muted ochre
  IN_PROGRESS: '#c07d1a', // muted amber (distinct from the #f2a20d accent)
  RESOLVED: '#3f7d5b', // muted green
  CLOSED: '#9b9b9b', // faint grey
};

export const statusIndex = (s) => Math.max(0, STATUS_ORDER.indexOf(s));
