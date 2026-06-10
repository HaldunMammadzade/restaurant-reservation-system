import { 
  TABLE_STATUS, 
  RESERVATION_STATUS, 
  TABLE_SHAPES 
} from './constants';

const today = new Date();
const tomorrow = new Date(Date.now() + 86400000);
const dayAfter = new Date(Date.now() + 172800000);

export const mockTables = [
  { id: 'table_1', number: '1', capacity: 2, shape: TABLE_SHAPES.ROUND, status: TABLE_STATUS.AVAILABLE, x: 80, y: 80, rotation: 0, zone: 'Pəncərə' },
  { id: 'table_2', number: '2', capacity: 4, shape: TABLE_SHAPES.SQUARE, status: TABLE_STATUS.OCCUPIED, x: 240, y: 80, rotation: 0, zone: 'Pəncərə' },
  { id: 'table_3', number: '3', capacity: 6, shape: TABLE_SHAPES.RECTANGLE, status: TABLE_STATUS.RESERVED, x: 420, y: 80, rotation: 0, zone: 'Əsas Salon' },
  { id: 'table_4', number: '4', capacity: 4, shape: TABLE_SHAPES.ROUND, status: TABLE_STATUS.AVAILABLE, x: 80, y: 260, rotation: 0, zone: 'Əsas Salon' },
  { id: 'table_5', number: '5', capacity: 8, shape: TABLE_SHAPES.RECTANGLE, status: TABLE_STATUS.OCCUPIED, x: 240, y: 260, rotation: 0, zone: 'VIP' },
  { id: 'table_6', number: '6', capacity: 2, shape: TABLE_SHAPES.ROUND, status: TABLE_STATUS.AVAILABLE, x: 420, y: 260, rotation: 0, zone: 'Terras' },
  { id: 'table_7', number: '7', capacity: 4, shape: TABLE_SHAPES.SQUARE, status: TABLE_STATUS.RESERVED, x: 80, y: 440, rotation: 0, zone: 'Terras' },
  { id: 'table_8', number: '8', capacity: 6, shape: TABLE_SHAPES.RECTANGLE, status: TABLE_STATUS.CLEANING, x: 240, y: 440, rotation: 0, zone: 'VIP' },
  { id: 'table_9', number: '9', capacity: 4, shape: TABLE_SHAPES.ROUND, status: TABLE_STATUS.AVAILABLE, x: 420, y: 440, rotation: 0, zone: 'Bar' },
  { id: 'table_10', number: '10', capacity: 2, shape: TABLE_SHAPES.SQUARE, status: TABLE_STATUS.OCCUPIED, x: 580, y: 160, rotation: 0, zone: 'Bar' },
];

export const mockReservations = [
  {
    id: 'RES00001',
    customerName: 'Aysel Məmmədova',
    customerPhone: '+994501234567',
    customerEmail: 'aysel@example.com',
    date: today.toISOString(),
    time: '19:00',
    partySize: 4,
    tableId: 'table_2',
    tableNumber: '2',
    status: RESERVATION_STATUS.CONFIRMED,
    notes: 'Pəncərə yaxını xahiş edirik',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    vip: true,
  },
  {
    id: 'RES00002',
    customerName: 'Elvin Həsənov',
    customerPhone: '+994557654321',
    customerEmail: 'elvin@example.com',
    date: today.toISOString(),
    time: '20:00',
    partySize: 2,
    tableId: 'table_1',
    tableNumber: '1',
    status: RESERVATION_STATUS.PENDING,
    notes: '',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    vip: false,
  },
  {
    id: 'RES00003',
    customerName: 'Leyla Əliyeva',
    customerPhone: '+994701112233',
    customerEmail: 'leyla@example.com',
    date: tomorrow.toISOString(),
    time: '18:30',
    partySize: 6,
    tableId: 'table_3',
    tableNumber: '3',
    status: RESERVATION_STATUS.CONFIRMED,
    notes: 'Ad günü tədbiri',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    vip: true,
  },
  {
    id: 'RES00004',
    customerName: 'Rəşad Quliyev',
    customerPhone: '+994551998877',
    customerEmail: 'rashad@example.com',
    date: today.toISOString(),
    time: '13:00',
    partySize: 3,
    tableId: 'table_4',
    tableNumber: '4',
    status: RESERVATION_STATUS.CHECKED_IN,
    notes: 'Vegetarian menyu',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    vip: false,
  },
  {
    id: 'RES00005',
    customerName: 'Nərgiz Səfərova',
    customerPhone: '+994503334455',
    customerEmail: 'nargiz@example.com',
    date: today.toISOString(),
    time: '21:30',
    partySize: 8,
    tableId: 'table_5',
    tableNumber: '5',
    status: RESERVATION_STATUS.CONFIRMED,
    notes: 'Korporativ şam yeməyi',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    vip: true,
  },
  {
    id: 'RES00006',
    customerName: 'Kamran Əhmədov',
    customerPhone: '+994507776655',
    customerEmail: 'kamran@example.com',
    date: dayAfter.toISOString(),
    time: '19:30',
    partySize: 4,
    tableId: 'table_7',
    tableNumber: '7',
    status: RESERVATION_STATUS.CONFIRMED,
    notes: '',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    vip: false,
  },
];

export const mockWaitlist = [
  { id: 'WL001', customerName: 'Tural Məlikov', customerPhone: '+994501112233', partySize: 4, waitTime: 15, priority: 'high', joinedAt: new Date(Date.now() - 900000).toISOString() },
  { id: 'WL002', customerName: 'Günel Rəhimova', customerPhone: '+994552223344', partySize: 2, waitTime: 8, priority: 'normal', joinedAt: new Date(Date.now() - 480000).toISOString() },
  { id: 'WL003', customerName: 'Orxan Vəliyev', customerPhone: '+994553334455', partySize: 6, waitTime: 22, priority: 'high', joinedAt: new Date(Date.now() - 1320000).toISOString() },
];

export const mockNotifications = [
  { id: 'n1', type: 'reservation', title: 'Yeni rezervasiya', message: 'Elvin Həsənov — 20:00, 2 nəfər', time: new Date(Date.now() - 300000).toISOString(), read: false },
  { id: 'n2', type: 'waitlist', title: 'Gözləmə siyahısı', message: 'Tural Məlikov 15 dəqiqədir gözləyir', time: new Date(Date.now() - 600000).toISOString(), read: false },
  { id: 'n3', type: 'ai', title: 'AI Tövsiyəsi', message: 'Bu axşam 19:00-21:00 arası doluluq 95% olacaq', time: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: 'n4', type: 'table', title: 'Masa statusu', message: 'Masa 8 təmizlənmə tamamlandı', time: new Date(Date.now() - 3600000).toISOString(), read: true },
  { id: 'n5', type: 'revenue', title: 'Gəlir hədəfi', message: 'Bu həftə gəlir hədəfinin 87%-inə çatdınız', time: new Date(Date.now() - 7200000).toISOString(), read: true },
];

export const mockActivities = [
  { id: 'a1', type: 'checkin', message: 'Rəşad Quliyev check-in etdi — Masa 4', time: new Date(Date.now() - 120000).toISOString() },
  { id: 'a2', type: 'reservation', message: 'Yeni rezervasiya: Nərgiz Səfərova — 21:30', time: new Date(Date.now() - 300000).toISOString() },
  { id: 'a3', type: 'table', message: 'Masa 2 dolu statusuna keçdi', time: new Date(Date.now() - 480000).toISOString() },
  { id: 'a4', type: 'waitlist', message: 'Günel Rəhimova gözləmə siyahısına əlavə edildi', time: new Date(Date.now() - 600000).toISOString() },
  { id: 'a5', type: 'ai', message: 'AI: Masa 5 üçün optimal rezervasiya vaxtı 20:30', time: new Date(Date.now() - 900000).toISOString() },
  { id: 'a6', type: 'cancel', message: 'Rezervasiya ləğv edildi: #RES00099', time: new Date(Date.now() - 1200000).toISOString() },
];

const generateDailyData = (days) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const baseReservations = 15 + Math.floor(Math.random() * 20);
    data.push({
      date: date.toISOString().split('T')[0],
      reservations: baseReservations,
      revenue: baseReservations * (180 + Math.floor(Math.random() * 80)),
    });
  }
  return data;
};

export const mockAnalytics = {
  stats: {
    totalReservations: 156,
    todayReservations: 23,
    occupancyRate: 78,
    avgServiceTime: 58,
    revenue: 28450,
    noShowRate: 6,
    repeatCustomers: 64,
    avgPartySize: 3.8,
    satisfaction: 4.7,
  },
  chartData: {
    daily: generateDailyData(7),
    monthly: generateDailyData(30),
    yearly: generateDailyData(90),
  },
  topTables: [
    { tableNumber: '5', reservations: 45, revenue: 12800 },
    { tableNumber: '3', reservations: 38, revenue: 10200 },
    { tableNumber: '2', reservations: 32, revenue: 8100 },
    { tableNumber: '7', reservations: 28, revenue: 7500 },
    { tableNumber: '1', reservations: 25, revenue: 5800 },
  ],
  peakHours: [
    { hour: '12:00', count: 15 },
    { hour: '13:00', count: 22 },
    { hour: '14:00', count: 18 },
    { hour: '18:00', count: 12 },
    { hour: '19:00', count: 28 },
    { hour: '20:00', count: 35 },
    { hour: '21:00', count: 25 },
    { hour: '22:00', count: 15 },
  ],
  aiRecommendations: [
    {
      id: 'ai1',
      type: 'optimization',
      icon: '📊',
      title: 'Rezervasiya Optimallaşdırması',
      description: '19:00-21:00 arası rezervasiyalarınızı artırın. Bu saatlarda 35% boş tutumunuz var.',
      impact: 'Yüksək',
      color: 'blue',
    },
    {
      id: 'ai2',
      type: 'revenue',
      icon: '💰',
      title: 'Gəlir Artırma',
      description: 'Masa 5 və 3 ən çox gəlir gətirən masalardır. VIP zonada 2 əlavə masa tövsiyə olunur.',
      impact: 'Orta',
      color: 'green',
    },
    {
      id: 'ai3',
      type: 'service',
      icon: '⏰',
      title: 'Xidmət Sürəti',
      description: 'Orta xidmət vaxtınız 58 dəqiqədir. AI modeli 52 dəqiqəyə endirməyi təklif edir.',
      impact: 'Yüksək',
      color: 'purple',
    },
    {
      id: 'ai4',
      type: 'staff',
      icon: '👥',
      title: 'Personal Planlaması',
      description: 'Cümə axşamı axşamları 2 əlavə ofisiant lazımdır. Doluluq 92% olacaq.',
      impact: 'Orta',
      color: 'amber',
    },
  ],
};

export const mockRestaurant = {
  id: 'rest_1',
  name: 'Nizami Garden',
  address: 'Nizami küç. 123, Bakı, Azərbaycan',
  phone: '+994123456789',
  email: 'info@nizamigarden.az',
  cuisine: 'Azərbaycan & Avropa',
  rating: 4.8,
  openingHours: {
    monday: { open: '10:00', close: '23:00' },
    tuesday: { open: '10:00', close: '23:00' },
    wednesday: { open: '10:00', close: '23:00' },
    thursday: { open: '10:00', close: '23:00' },
    friday: { open: '10:00', close: '00:00' },
    saturday: { open: '10:00', close: '00:00' },
    sunday: { open: '10:00', close: '23:00' },
  },
  settings: {
    reservationDuration: 90,
    maxPartySize: 12,
    advanceBookingDays: 30,
    notificationsEnabled: true,
    autoConfirm: false,
  },
};

export const mockUser = {
  id: 'user_1',
  name: 'Haldun Məmmədov',
  email: 'demo@seatmind.az',
  role: 'admin',
  restaurantId: 'rest_1',
  avatar: null,
};

export const DEMO_CREDENTIALS = {
  email: 'demo@seatmind.az',
  password: 'demo123',
};
