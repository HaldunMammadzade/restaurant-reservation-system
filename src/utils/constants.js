export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
};

export const TABLE_STATUS_COLORS = {
  [TABLE_STATUS.AVAILABLE]: '#10B981',
  [TABLE_STATUS.OCCUPIED]: '#EF4444',
  [TABLE_STATUS.RESERVED]: '#F59E0B',
  [TABLE_STATUS.CLEANING]: '#6B7280',
  [TABLE_STATUS.MAINTENANCE]: '#8B5CF6',
};

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const RESERVATION_STATUS_LABELS = {
  [RESERVATION_STATUS.PENDING]: 'Gözləyir',
  [RESERVATION_STATUS.CONFIRMED]: 'Təsdiqlənib',
  [RESERVATION_STATUS.CHECKED_IN]: 'Gəlib',
  [RESERVATION_STATUS.COMPLETED]: 'Tamamlanıb',
  [RESERVATION_STATUS.CANCELLED]: 'Ləğv edilib',
  [RESERVATION_STATUS.NO_SHOW]: 'Gəlməyib',
};

export const RESERVATION_STATUS_COLORS = {
  [RESERVATION_STATUS.PENDING]: 'warning',
  [RESERVATION_STATUS.CONFIRMED]: 'primary',
  [RESERVATION_STATUS.CHECKED_IN]: 'success',
  [RESERVATION_STATUS.COMPLETED]: 'success',
  [RESERVATION_STATUS.CANCELLED]: 'danger',
  [RESERVATION_STATUS.NO_SHOW]: 'danger',
};

export const TABLE_SHAPES = {
  SQUARE: 'square',
  ROUND: 'round',
  RECTANGLE: 'rectangle',
};

export const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30',
];

export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const CHART_COLORS = [
  '#4F46E5',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const NOTIFICATION_TYPES = {
  NEW_RESERVATION: 'new_reservation',
  RESERVATION_UPDATED: 'reservation_updated',
  RESERVATION_CANCELLED: 'reservation_cancelled',
  TABLE_READY: 'table_ready',
  REMINDER: 'reminder',
};
