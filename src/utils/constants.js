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

export const SERVICE_PHASE = {
  SEATED: 'seated',
  APPETIZER: 'appetizer',
  MAIN: 'main',
  DESSERT: 'dessert',
  BILL: 'bill',
};

export const SERVICE_PHASE_LABELS = {
  [SERVICE_PHASE.SEATED]: 'Oturub',
  [SERVICE_PHASE.APPETIZER]: 'Qəlyanaltı',
  [SERVICE_PHASE.MAIN]: 'Əsas yemək',
  [SERVICE_PHASE.DESSERT]: 'Desert',
  [SERVICE_PHASE.BILL]: 'Hesab',
};

export const SERVICE_PHASE_COLORS = {
  [SERVICE_PHASE.SEATED]: '#6366F1',
  [SERVICE_PHASE.APPETIZER]: '#06B6D4',
  [SERVICE_PHASE.MAIN]: '#F59E0B',
  [SERVICE_PHASE.DESSERT]: '#EC4899',
  [SERVICE_PHASE.BILL]: '#10B981',
};

export const MENU_CATEGORIES = {
  appetizer: 'Qəlyanaltı',
  main: 'Əsas yemək',
  dessert: 'Desert',
  drink: 'İçki',
  special: 'Xüsusi',
};

export const STAFF_STATUS = {
  active: 'Aktiv',
  off_duty: 'Növbədən kənar',
  on_break: 'Fasilədə',
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

export const OCCASION_TYPES = {
  STANDARD: 'standard',
  BIRTHDAY: 'birthday',
  ENGAGEMENT: 'engagement',
  WEDDING: 'wedding',
  ANNIVERSARY: 'anniversary',
  CORPORATE: 'corporate',
  PRIVATE_DINING: 'private_dining',
  TASTING: 'tasting',
  GRADUATION: 'graduation',
};

export const OCCASION_LABELS = {
  [OCCASION_TYPES.STANDARD]: 'Standart',
  [OCCASION_TYPES.BIRTHDAY]: 'Ad günü',
  [OCCASION_TYPES.ENGAGEMENT]: 'Nişan',
  [OCCASION_TYPES.WEDDING]: 'Toy / Toy qabağı',
  [OCCASION_TYPES.ANNIVERSARY]: 'İldönümü',
  [OCCASION_TYPES.CORPORATE]: 'Korporativ',
  [OCCASION_TYPES.PRIVATE_DINING]: 'Private Dining',
  [OCCASION_TYPES.TASTING]: 'Degustasiya',
  [OCCASION_TYPES.GRADUATION]: 'Məzuniyyət',
};

export const OCCASION_ICONS = {
  [OCCASION_TYPES.STANDARD]: '🍽️',
  [OCCASION_TYPES.BIRTHDAY]: '🎂',
  [OCCASION_TYPES.ENGAGEMENT]: '💍',
  [OCCASION_TYPES.WEDDING]: '👰',
  [OCCASION_TYPES.ANNIVERSARY]: '❤️',
  [OCCASION_TYPES.CORPORATE]: '🏢',
  [OCCASION_TYPES.PRIVATE_DINING]: '👑',
  [OCCASION_TYPES.TASTING]: '🍷',
  [OCCASION_TYPES.GRADUATION]: '🎓',
};

export const OCCASION_COLORS = {
  [OCCASION_TYPES.BIRTHDAY]: 'bg-pink-50 text-pink-700 ring-pink-200',
  [OCCASION_TYPES.ENGAGEMENT]: 'bg-violet-50 text-violet-700 ring-violet-200',
  [OCCASION_TYPES.WEDDING]: 'bg-rose-50 text-rose-700 ring-rose-200',
  [OCCASION_TYPES.CORPORATE]: 'bg-blue-50 text-blue-700 ring-blue-200',
  [OCCASION_TYPES.PRIVATE_DINING]: 'bg-amber-50 text-amber-700 ring-amber-200',
  [OCCASION_TYPES.TASTING]: 'bg-purple-50 text-purple-700 ring-purple-200',
};

export const EVENT_STATUS = {
  INQUIRY: 'inquiry',
  CONFIRMED: 'confirmed',
  DEPOSIT_PAID: 'deposit_paid',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const EVENT_STATUS_LABELS = {
  [EVENT_STATUS.INQUIRY]: 'Sorğu',
  [EVENT_STATUS.CONFIRMED]: 'Təsdiqlənib',
  [EVENT_STATUS.DEPOSIT_PAID]: 'Depozit alınıb',
  [EVENT_STATUS.IN_PROGRESS]: 'Davam edir',
  [EVENT_STATUS.COMPLETED]: 'Tamamlanıb',
  [EVENT_STATUS.CANCELLED]: 'Ləğv',
};

export const BOOKING_SOURCE = {
  PHONE: 'phone',
  QR: 'qr',
  WEBSITE: 'website',
  INSTAGRAM: 'instagram',
  WALKIN: 'walkin',
  MANAGER: 'manager',
};

export const BOOKING_SOURCE_LABELS = {
  [BOOKING_SOURCE.PHONE]: 'Telefon',
  [BOOKING_SOURCE.QR]: 'QR Kod',
  [BOOKING_SOURCE.WEBSITE]: 'Vebsayt',
  [BOOKING_SOURCE.INSTAGRAM]: 'Instagram',
  [BOOKING_SOURCE.WALKIN]: 'Walk-in',
  [BOOKING_SOURCE.MANAGER]: 'Menecer',
};

export const DIETARY_OPTIONS = {
  NONE: 'none',
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  GLUTEN_FREE: 'gluten_free',
  HALAL: 'halal',
  NUT_ALLERGY: 'nut_allergy',
  SEAFOOD_ALLERGY: 'seafood_allergy',
};

export const DIETARY_LABELS = {
  [DIETARY_OPTIONS.NONE]: 'Xüsusi yoxdur',
  [DIETARY_OPTIONS.VEGETARIAN]: 'Vegetarian',
  [DIETARY_OPTIONS.VEGAN]: 'Vegan',
  [DIETARY_OPTIONS.GLUTEN_FREE]: 'Gluten-free',
  [DIETARY_OPTIONS.HALAL]: 'Halal',
  [DIETARY_OPTIONS.NUT_ALLERGY]: 'Qoz allergiyası',
  [DIETARY_OPTIONS.SEAFOOD_ALLERGY]: 'Dəniz məhsulu allergiyası',
};

export const DEFAULT_TURN_MINUTES = 90;
