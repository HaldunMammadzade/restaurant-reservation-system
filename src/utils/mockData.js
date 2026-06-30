import {
  TABLE_STATUS, RESERVATION_STATUS, TABLE_SHAPES, SERVICE_PHASE,
  OCCASION_TYPES, EVENT_STATUS, BOOKING_SOURCE, DIETARY_OPTIONS,
} from './constants';

const today = new Date();
const tomorrow = new Date(Date.now() + 86400000);
const dayAfter = new Date(Date.now() + 172800000);

export const mockFloors = [
  { id: 'floor_g', name: 'Zemin Mərtəbə', shortName: 'Z', icon: '🏛️', color: 'from-slate-600 to-slate-800', capacity: 48, description: 'Əsas salon, bar və qəbul zonası' },
  { id: 'floor_1', name: '1-ci Mərtəbə', shortName: '1', icon: '🌃', color: 'from-indigo-600 to-violet-800', capacity: 36, description: 'Pəncərə manzarası, romantik atmosfer' },
  { id: 'floor_t', name: 'Terras', shortName: 'T', icon: '🌿', color: 'from-emerald-600 to-teal-800', capacity: 24, description: 'Açıq hava, şəhər panoraması' },
  { id: 'floor_v', name: 'VIP Salon', shortName: 'V', icon: '👑', color: 'from-amber-600 to-orange-800', capacity: 16, description: 'Private dining, korporativ tədbirlər' },
];

const t = (id, number, floorId, zone, capacity, shape, status, x, y, extra = {}) => ({
  id, number, floorId, zone, capacity, shape, status, x, y, rotation: 0, ...extra,
});

export const mockTables = [
  // Zemin — Masa 1–8
  t('t_g1', '1', 'floor_g', 'Qəbul', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 60, 80),
  t('t_g2', '2', 'floor_g', 'Pəncərə', 4, TABLE_SHAPES.SQUARE, TABLE_STATUS.OCCUPIED, 180, 60, {
    guestName: 'Aysel M.', partySize: 3, servicePhase: SERVICE_PHASE.MAIN, seatedAt: Date.now() - 2700000, serverId: 's1',
    orders: [
      { id: 'ord1', menuItemId: 'm1', name: 'Şəki Plovu', price: 28, qty: 2, status: 'ready', addedAt: new Date(Date.now() - 1800000).toISOString() },
      { id: 'ord2', menuItemId: 'm5', name: 'Ayran Ev', price: 4, qty: 3, status: 'kitchen', addedAt: new Date(Date.now() - 600000).toISOString() },
    ],
  }),
  t('t_g3', '3', 'floor_g', 'Pəncərə', 4, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 320, 60),
  t('t_g4', '4', 'floor_g', 'Əsas Salon', 6, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.AVAILABLE, 60, 200),
  t('t_g5', '5', 'floor_g', 'Əsas Salon', 4, TABLE_SHAPES.SQUARE, TABLE_STATUS.AVAILABLE, 220, 200),
  t('t_g6', '6', 'floor_g', 'Bar', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.OCCUPIED, 400, 180, { guestName: 'Elvin H.', partySize: 2, servicePhase: SERVICE_PHASE.BILL, seatedAt: Date.now() - 5400000 }),
  t('t_g7', '7', 'floor_g', 'Bar', 2, TABLE_SHAPES.SQUARE, TABLE_STATUS.CLEANING, 500, 180),
  t('t_g8', '8', 'floor_g', 'Əsas Salon', 8, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.RESERVED, 140, 340),
  // 1-ci mərtəbə — Masa 9–14
  t('t_11', '9', 'floor_1', 'Pəncərə', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.RESERVED, 80, 70),
  t('t_12', '10', 'floor_1', 'Pəncərə', 4, TABLE_SHAPES.SQUARE, TABLE_STATUS.AVAILABLE, 200, 70),
  t('t_13', '11', 'floor_1', 'Mərkəz', 4, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 340, 70),
  t('t_14', '12', 'floor_1', 'Mərkəz', 6, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.AVAILABLE, 80, 220),
  t('t_15', '13', 'floor_1', 'Künc', 4, TABLE_SHAPES.SQUARE, TABLE_STATUS.AVAILABLE, 260, 220),
  t('t_16', '14', 'floor_1', 'Künc', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 400, 220),
  // Terras — Masa 15–19
  t('t_t1', '15', 'floor_t', 'Panorama', 4, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 100, 100),
  t('t_t2', '16', 'floor_t', 'Panorama', 4, TABLE_SHAPES.SQUARE, TABLE_STATUS.AVAILABLE, 260, 100),
  t('t_t3', '17', 'floor_t', 'Bağ', 6, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.AVAILABLE, 100, 260),
  t('t_t4', '18', 'floor_t', 'Bağ', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 300, 260),
  t('t_t5', '19', 'floor_t', 'Bar Terras', 2, TABLE_SHAPES.SQUARE, TABLE_STATUS.AVAILABLE, 420, 180),
  // VIP — Masa 20–23
  t('t_v1', '20', 'floor_v', 'Private Room A', 8, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.RESERVED, 120, 120, { minimumSpend: 500 }),
  t('t_v2', '21', 'floor_v', 'Private Room A', 6, TABLE_SHAPES.RECTANGLE, TABLE_STATUS.OCCUPIED, 120, 280, { guestName: 'VIP Qonaq', partySize: 6, servicePhase: SERVICE_PHASE.MAIN, seatedAt: Date.now() - 4200000, vip: true, minimumSpend: 400 }),
  t('t_v3', '22', 'floor_v', 'Private Room B', 4, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 380, 120),
  t('t_v4', '23', 'floor_v', 'Lounge', 2, TABLE_SHAPES.ROUND, TABLE_STATUS.AVAILABLE, 380, 280),
];

export const mockReservations = [
  { id: 'RES00001', customerName: 'Aysel Məmmədova', customerPhone: '+994501234567', customerEmail: 'aysel@example.com', date: today.toISOString(), time: '19:00', partySize: 4, tableId: 't_g2', tableNumber: '2', status: RESERVATION_STATUS.CONFIRMED, notes: 'Pəncərə yaxını', createdAt: new Date(Date.now() - 3600000).toISOString(), vip: true, floorId: 'floor_g', zone: 'Pəncərə', occasionType: OCCASION_TYPES.STANDARD, deposit: 0, depositPaid: false, dietary: DIETARY_OPTIONS.NONE, source: BOOKING_SOURCE.PHONE, smsReminderSent: true },
  { id: 'RES00002', customerName: 'Elvin Həsənov', customerPhone: '+994557654321', customerEmail: 'elvin@example.com', date: today.toISOString(), time: '20:00', partySize: 2, tableId: 't_g6', tableNumber: '6', status: RESERVATION_STATUS.PENDING, notes: '', createdAt: new Date(Date.now() - 7200000).toISOString(), vip: false, floorId: 'floor_g', zone: 'Bar', occasionType: OCCASION_TYPES.STANDARD, deposit: 0, depositPaid: false, dietary: DIETARY_OPTIONS.NONE, source: BOOKING_SOURCE.INSTAGRAM },
  { id: 'RES00003', customerName: 'Leyla Əliyeva', customerPhone: '+994701112233', customerEmail: 'leyla@example.com', date: tomorrow.toISOString(), time: '18:30', partySize: 6, tableId: 't_g8', tableNumber: '8', status: RESERVATION_STATUS.CONFIRMED, notes: 'Ad günü tortu gətiriləcək', createdAt: new Date(Date.now() - 86400000).toISOString(), vip: true, floorId: 'floor_g', zone: 'Əsas Salon', occasionType: OCCASION_TYPES.BIRTHDAY, deposit: 100, depositPaid: true, dietary: DIETARY_OPTIONS.GLUTEN_FREE, source: BOOKING_SOURCE.MANAGER, eventId: 'EVT001' },
  { id: 'RES00004', customerName: 'Rəşad Quliyev', customerPhone: '+994551998877', customerEmail: 'rashad@example.com', date: today.toISOString(), time: '13:00', partySize: 3, tableId: 't_14', tableNumber: '12', status: RESERVATION_STATUS.COMPLETED, notes: 'Vegetarian menyu', createdAt: new Date(Date.now() - 10800000).toISOString(), vip: false, floorId: 'floor_1', zone: 'Mərkəz', occasionType: OCCASION_TYPES.STANDARD, deposit: 0, dietary: DIETARY_OPTIONS.VEGETARIAN, source: BOOKING_SOURCE.WALKIN },
  { id: 'RES00005', customerName: 'Nərgiz Səfərova', customerPhone: '+994503334455', customerEmail: 'nargiz@example.com', date: today.toISOString(), time: '21:30', partySize: 8, tableId: 't_v1', tableNumber: '20', status: RESERVATION_STATUS.CONFIRMED, notes: 'Korporativ şam yeməyi', createdAt: new Date(Date.now() - 172800000).toISOString(), vip: true, floorId: 'floor_v', zone: 'Private Room A', occasionType: OCCASION_TYPES.CORPORATE, deposit: 500, depositPaid: true, dietary: DIETARY_OPTIONS.NONE, source: BOOKING_SOURCE.MANAGER, eventId: 'EVT002' },
  { id: 'RES00006', customerName: 'Kamran Əhmədov', customerPhone: '+994507776655', customerEmail: 'kamran@example.com', date: dayAfter.toISOString(), time: '19:30', partySize: 4, tableId: 't_t3', tableNumber: '17', status: RESERVATION_STATUS.CONFIRMED, notes: '', createdAt: new Date(Date.now() - 43200000).toISOString(), vip: false, floorId: 'floor_t', zone: 'Bağ', occasionType: OCCASION_TYPES.ANNIVERSARY, deposit: 50, depositPaid: true, source: BOOKING_SOURCE.QR },
  { id: 'RES00007', customerName: 'Səbinə Rüstəmova', customerPhone: '+994551234999', date: today.toISOString(), time: '19:30', partySize: 2, tableId: 't_11', tableNumber: '9', status: RESERVATION_STATUS.CONFIRMED, notes: 'Xüsusi axşam — nişan', vip: true, floorId: 'floor_1', zone: 'Pəncərə', occasionType: OCCASION_TYPES.ENGAGEMENT, deposit: 80, depositPaid: true, source: BOOKING_SOURCE.PHONE, smsReminderSent: true },
  { id: 'RES00008', customerName: 'Tural Məlikov', customerPhone: '+994501112233', date: today.toISOString(), time: '20:30', partySize: 4, tableId: 't_g5', tableNumber: '5', status: RESERVATION_STATUS.CONFIRMED, floorId: 'floor_g', zone: 'Əsas Salon', occasionType: OCCASION_TYPES.STANDARD, source: BOOKING_SOURCE.QR, createdAt: new Date().toISOString() },
];

export const mockWaitlist = [
  { id: 'WL001', customerName: 'Tural Məlikov', customerPhone: '+994501112233', partySize: 4, waitTime: 15, priority: 'high', joinedAt: new Date(Date.now() - 900000).toISOString(), preferredFloor: 'floor_g' },
  { id: 'WL002', customerName: 'Günel Rəhimova', customerPhone: '+994552223344', partySize: 2, waitTime: 8, priority: 'normal', joinedAt: new Date(Date.now() - 480000).toISOString(), preferredFloor: 'floor_t' },
  { id: 'WL003', customerName: 'Orxan Vəliyev', customerPhone: '+994553334455', partySize: 6, waitTime: 22, priority: 'high', joinedAt: new Date(Date.now() - 1320000).toISOString(), preferredFloor: 'floor_v' },
  { id: 'WL004', customerName: 'Diana Hüseynova', customerPhone: '+994504445566', partySize: 3, waitTime: 5, priority: 'vip', joinedAt: new Date(Date.now() - 300000).toISOString(), preferredFloor: 'floor_1' },
];

export const mockCustomers = [
  { id: 'c1', name: 'Aysel Məmmədova', phone: '+994501234567', email: 'aysel@example.com', visitCount: 24, totalSpent: 3840, vip: true, loyaltyPoints: 3840, tags: ['VIP', 'Pəncərə', 'Şampan'], notes: 'Həmişə Masa 2', specialNotes: 'Şampan ilə qarşılama', lastVisit: today.toISOString(), dietary: DIETARY_OPTIONS.NONE, noShowCount: 0, blacklisted: false },
  { id: 'c2', name: 'Elvin Həsənov', phone: '+994557654321', email: 'elvin@example.com', visitCount: 8, totalSpent: 960, vip: false, loyaltyPoints: 420, tags: ['Bar'], lastVisit: today.toISOString(), blacklisted: false },
  { id: 'c3', name: 'Leyla Əliyeva', phone: '+994701112233', email: 'leyla@example.com', visitCount: 15, totalSpent: 4200, vip: true, loyaltyPoints: 2100, tags: ['VIP', 'Tədbir', 'Desert'], notes: 'Ad günləri üçün xüsusi menyu', lastVisit: tomorrow.toISOString(), blacklisted: false },
  { id: 'c4', name: 'Nərgiz Səfərova', phone: '+994503334455', email: 'nargiz@example.com', visitCount: 32, totalSpent: 12800, vip: true, loyaltyPoints: 6400, tags: ['VIP', 'Korporativ', 'VIP Salon'], notes: 'Aylıq korporativ rezervasiya', lastVisit: today.toISOString(), blacklisted: false },
  { id: 'c5', name: 'Rəşad Quliyev', phone: '+994551998877', visitCount: 6, totalSpent: 540, vip: false, loyaltyPoints: 180, tags: ['Vegetarian'], lastVisit: today.toISOString(), blacklisted: false },
  { id: 'c6', name: 'Kamran Əhmədov', phone: '+994507776655', visitCount: 3, totalSpent: 420, vip: false, loyaltyPoints: 90, tags: ['Terras'], lastVisit: dayAfter.toISOString(), blacklisted: false },
  { id: 'c7', name: 'Səbinə Rüstəmova', phone: '+994551234999', visitCount: 12, totalSpent: 2100, vip: true, loyaltyPoints: 1050, tags: ['Romantik', '1-ci Mərtəbə'], lastVisit: today.toISOString(), blacklisted: false },
  { id: 'c8', name: 'Vüsal Kərimov', phone: '+994556667788', visitCount: 45, totalSpent: 8900, vip: true, loyaltyPoints: 8900, tags: ['VIP', 'Investor', 'Premium'], notes: 'Restoran sahibi dostu', specialNotes: 'Həmişə VIP otaq', lastVisit: today.toISOString(), blacklisted: false },
  { id: 'c9', name: 'Orxan Vəliyev', phone: '+994553334455', visitCount: 2, totalSpent: 120, vip: false, loyaltyPoints: 0, tags: [], noShowCount: 3, notes: '3 dəfə gəlməyib', blacklisted: true, specialNotes: 'Depozit tələb et' },
];

export const mockStaff = [
  { id: 's1', name: 'Rəşad Əliyev', role: 'Baş Ofisiant', phone: '+994501111111', email: 'rashad@nizami.az', shift: '10:00 - 22:00', status: 'active', floorId: 'floor_g', avatar: null },
  { id: 's2', name: 'Lamiyə Hüseynova', role: 'Ofisiant', phone: '+994502222222', shift: '12:00 - 00:00', status: 'active', floorId: 'floor_1', avatar: null },
  { id: 's3', name: 'Cavid Məmmədov', role: 'Barmen', shift: '16:00 - 02:00', status: 'on_break', floorId: 'floor_g', avatar: null },
  { id: 's4', name: 'Nigar Quliyeva', role: 'Hostess', shift: '10:00 - 20:00', status: 'active', floorId: 'floor_g', avatar: null },
  { id: 's5', name: 'Elnur Səfərov', role: 'VIP Menecer', shift: '18:00 - 01:00', status: 'active', floorId: 'floor_v', avatar: null },
  { id: 's6', name: 'Günay Məlikova', role: 'Terras Ofisiant', shift: '11:00 - 23:00', status: 'active', floorId: 'floor_t', avatar: null },
];

export const mockMenuItems = [
  { id: 'm1', name: 'Şəki Plovu', description: 'Ənənəvi Şəki plovu, quru meyvələrlə', price: 28, category: 'main', available: true, isPopular: true, prepTime: '25 dəq', image: 'https://images.unsplash.com/photo-1516684669134-de6f7ed147ab?w=400&h=300&fit=crop', allergens: ['gluten'] },
  { id: 'm2', name: 'Dolma', description: 'Yarpaq dolması, qaymaq ilə', price: 16, category: 'main', available: true, isPopular: true, prepTime: '20 dəq', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e00c?w=400&h=300&fit=crop', allergens: [] },
  { id: 'm3', name: 'Qutab Mix', description: 'Göyərti, pendir və ət qutabı', price: 12, category: 'appetizer', available: true, prepTime: '12 dəq', image: 'https://images.unsplash.com/photo-1626082927389-6c097acf0812?w=400&h=300&fit=crop', allergens: ['gluten', 'dairy'] },
  { id: 'm4', name: 'Baklava Premium', description: 'Fındıqlı ev baklavası, dondurma ilə', price: 14, category: 'dessert', available: true, isPopular: true, prepTime: '5 dəq', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop', allergens: ['nuts', 'gluten'] },
  { id: 'm5', name: 'Ayran Ev', description: 'Ev hazırlanmış ayran', price: 4, category: 'drink', available: true, prepTime: '2 dəq', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', allergens: ['dairy'] },
  { id: 'm6', name: 'Chef\'s Tasting Menu', description: '7 course degustasiya menyu — şefin seçimi', price: 95, category: 'special', available: true, isPopular: true, prepTime: '120 dəq', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', allergens: [] },
  { id: 'm7', name: 'Lüks Setri', description: 'Kaviar, dəniz məhsulları, şampan', price: 180, category: 'special', available: true, prepTime: '30 dəq', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop', allergens: ['seafood'] },
  { id: 'm8', name: 'Mango Smoothie', description: 'Tropik mango smoothie', price: 9, category: 'drink', available: false, prepTime: '5 dəq', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84665?w=400&h=300&fit=crop', allergens: [] },
  { id: 'm9', name: 'Caesar Salad', description: 'Romaine, parmesan, kruton', price: 18, category: 'appetizer', available: true, prepTime: '10 dəq', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', allergens: ['dairy', 'gluten'] },
  { id: 'm10', name: 'Wagyu Steak', description: 'A5 Wagyu, truffle purée', price: 120, category: 'main', available: true, isPopular: true, prepTime: '35 dəq', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', allergens: [] },
];

export const mockEventPackages = [
  { id: 'pkg_birthday', name: 'Ad Günü Premium', occasionType: OCCASION_TYPES.BIRTHDAY, minGuests: 6, maxGuests: 20, pricePerPerson: 45, minSpend: 800, depositPercent: 30, includes: ['Xüsusi masa bəzəyi', 'Tort servisi', 'Şampan toast', 'Foto zona'], floorId: 'floor_g' },
  { id: 'pkg_engagement', name: 'Nişan Paketi', occasionType: OCCASION_TYPES.ENGAGEMENT, minGuests: 10, maxGuests: 40, pricePerPerson: 55, minSpend: 1500, depositPercent: 40, includes: ['Romantik dekor', 'Canlı musiqi', 'Premium menyu', 'Şampan'], floorId: 'floor_1' },
  { id: 'pkg_wedding', name: 'Toy Qabağı Yeməyi', occasionType: OCCASION_TYPES.WEDDING, minGuests: 30, maxGuests: 80, pricePerPerson: 65, minSpend: 5000, depositPercent: 50, includes: ['VIP Salon', 'Full catering', 'Bar paketi', 'Koordinator'], floorId: 'floor_v' },
  { id: 'pkg_corporate', name: 'Korporativ Şam', occasionType: OCCASION_TYPES.CORPORATE, minGuests: 15, maxGuests: 50, pricePerPerson: 75, minSpend: 3000, depositPercent: 35, includes: ['Private room', 'Presentation ekran', 'Premium menyu', 'Dedicated server'], floorId: 'floor_v' },
  { id: 'pkg_tasting', name: 'Chef Degustasiya', occasionType: OCCASION_TYPES.TASTING, minGuests: 4, maxGuests: 12, pricePerPerson: 95, minSpend: 600, depositPercent: 100, includes: ['7 course menu', 'Şərab pairing', 'Şef ilə görüş'], floorId: 'floor_v' },
  { id: 'pkg_private', name: 'Private Dining', occasionType: OCCASION_TYPES.PRIVATE_DINING, minGuests: 4, maxGuests: 16, pricePerPerson: 120, minSpend: 1200, depositPercent: 50, includes: ['Tam gizlilik', 'Custom menyu', 'Sommelier', 'VIP giriş'], floorId: 'floor_v' },
];

export const mockEvents = [
  {
    id: 'EVT001', title: 'Leyla — 30 yaş Ad Günü', occasionType: OCCASION_TYPES.BIRTHDAY,
    customerName: 'Leyla Əliyeva', customerPhone: '+994701112233', customerEmail: 'leyla@example.com',
    date: tomorrow.toISOString(), startTime: '18:30', endTime: '22:00', partySize: 18,
    packageId: 'pkg_birthday', floorId: 'floor_g', tableIds: ['t_g8'], status: EVENT_STATUS.DEPOSIT_PAID,
    deposit: 240, depositPaid: true, minSpend: 800, estimatedTotal: 810, notes: 'Gluten-free tort',
    checklist: [
      { id: 'deposit', label: 'Depozit alınıb', done: true, auto: true },
      { id: 'menu', label: 'Menyu təsdiqlənib', done: true },
      { id: 'room', label: 'Salon hazırlığı', done: false },
      { id: 'staff', label: 'Personal: Rəşad + Lamiyə', done: true },
      { id: 'sms', label: 'SMS xatırlatma', done: true, auto: true },
      { id: 'decor', label: 'Dekorasiya / tort', done: false },
    ],
    assignedStaffIds: ['s1', 's2'], createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'EVT002', title: 'AzərTech Korporativ Şam', occasionType: OCCASION_TYPES.CORPORATE,
    customerName: 'Nərgiz Səfərova', customerPhone: '+994503334455',
    date: today.toISOString(), startTime: '21:30', endTime: '00:30', partySize: 24,
    packageId: 'pkg_corporate', floorId: 'floor_v', tableIds: ['t_v1', 't_v2'], status: EVENT_STATUS.IN_PROGRESS,
    deposit: 500, depositPaid: true, minSpend: 3000, estimatedTotal: 4200,
    checklist: [
      { id: 'deposit', label: 'Depozit alınıb', done: true, auto: true },
      { id: 'menu', label: 'Menyu təsdiqlənib', done: true },
      { id: 'room', label: 'VIP Salon A+B', done: true },
      { id: 'staff', label: 'Elnur + 2 ofisiant', done: true },
      { id: 'sms', label: 'SMS xatırlatma', done: true, auto: true },
      { id: 'decor', label: 'Korporativ branding', done: true },
    ],
    assignedStaffIds: ['s5', 's1'], mergedTables: true, createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'EVT003', title: 'Günay & Orxan Nişan', occasionType: OCCASION_TYPES.ENGAGEMENT,
    customerName: 'Günay Həsənova', customerPhone: '+994551234567',
    date: dayAfter.toISOString(), startTime: '19:00', endTime: '23:00', partySize: 35,
    packageId: 'pkg_engagement', floorId: 'floor_1', tableIds: ['t_13', 't_15', 't_16'], status: EVENT_STATUS.CONFIRMED,
    deposit: 600, depositPaid: false, minSpend: 1500, estimatedTotal: 1925,
    checklist: [
      { id: 'deposit', label: 'Depozit alınıb', done: false, auto: true },
      { id: 'menu', label: 'Menyu seçimi gözlənilir', done: false },
      { id: 'room', label: '1-ci mərtəbə rezerv', done: true },
      { id: 'staff', label: 'Personal planlanır', done: false },
      { id: 'sms', label: 'SMS xatırlatma', done: false, auto: true },
      { id: 'decor', label: 'Gül dekorasiyası', done: false },
    ],
    assignedStaffIds: [], createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'EVT004', title: 'Məmmədovlar Toy Qabağı', occasionType: OCCASION_TYPES.WEDDING,
    customerName: 'Vüsal Kərimov', customerPhone: '+994556667788',
    date: new Date(Date.now() + 604800000).toISOString(), startTime: '18:00', endTime: '01:00', partySize: 60,
    packageId: 'pkg_wedding', floorId: 'floor_v', tableIds: ['t_v1', 't_v2', 't_v3'], status: EVENT_STATUS.INQUIRY,
    deposit: 2500, depositPaid: false, minSpend: 5000, estimatedTotal: 7800,
    checklist: [
      { id: 'deposit', label: 'Depozit alınıb', done: false, auto: true },
      { id: 'menu', label: 'Toy menyusu', done: false },
      { id: 'room', label: 'VIP + Terras', done: false },
      { id: 'staff', label: 'Full team', done: false },
      { id: 'sms', label: 'SMS', done: false, auto: true },
      { id: 'decor', label: 'Toy dekorasiyası', done: false },
    ],
    assignedStaffIds: [], createdAt: new Date().toISOString(),
  },
];

export const mockSmsLogs = [
  { id: 'sms1', to: '+994551234999', message: 'Səbinə, bu axşam 19:30 rezervasiyanız təsdiqlənib. Nizami Garden.', type: 'reminder', sentAt: new Date(Date.now() - 3600000).toISOString(), status: 'delivered' },
  { id: 'sms2', to: '+994701112233', message: 'Leyla xanım, sabahkı ad günü tədbiriniz üçün depozit alındı. Təşəkkürlər!', type: 'deposit', sentAt: new Date(Date.now() - 86400000).toISOString(), status: 'delivered' },
  { id: 'sms3', to: '+994503334455', message: 'Nərgiz xanım, korporativ şamınız bu axşam 21:30-da başlayır.', type: 'event', sentAt: new Date(Date.now() - 7200000).toISOString(), status: 'delivered' },
];

export const mockAutomations = [
  { id: 'auto1', label: '19:00 rezervasiyalarına SMS xatırlatma', time: '17:00', status: 'scheduled', count: 3 },
  { id: 'auto2', label: 'Sabahkı tədbirlər üçün checklist yoxlaması', time: '09:00', status: 'scheduled', count: 2 },
  { id: 'auto3', label: '90 dəq+ oturan masalara desert təklifi', time: 'Real-time', status: 'active', count: 2 },
  { id: 'auto4', label: 'Depozit ödənilməyən tədbirlərə xəbərdarlıq', time: 'Real-time', status: 'active', count: 1 },
];

export const mockNotifications = [
  { id: 'n1', type: 'reservation', title: 'Yeni rezervasiya', message: 'Səbinə Rüstəmova — 19:30, 2 nəfər, 1-ci Mərtəbə', time: new Date(Date.now() - 300000).toISOString(), read: false },
  { id: 'n2', type: 'waitlist', title: 'VIP Gözləmə', message: 'Diana Hüseynova 5 dəqiqədir gözləyir', time: new Date(Date.now() - 300000).toISOString(), read: false },
  { id: 'n3', type: 'capacity', title: 'Doluluq xəbərdarlığı', message: 'Bu axşam 20:00-22:00 doluluq 96% — 2 masa əlavə rezerv açın', time: new Date(Date.now() - 600000).toISOString(), read: false },
  { id: 'n4', type: 'table', title: 'Xidmət Xəbərdarlığı', message: 'Masa G4 — 45 dəq oturub, desert təklif edin', time: new Date(Date.now() - 900000).toISOString(), read: false },
  { id: 'n5', type: 'revenue', title: 'Gəlir Rekordu', message: 'Bu həftə gəlir hədəfinin 94%-inə çatdınız 🎉', time: new Date(Date.now() - 3600000).toISOString(), read: true },
  { id: 'n6', type: 'staff', title: 'Personal', message: 'VIP Menecer Elnur növbəyə başladı', time: new Date(Date.now() - 7200000).toISOString(), read: true },
];

export const mockActivities = [
  { id: 'a1', type: 'checkin', message: 'Rəşad Quliyev check-in — Masa 104 (1-ci Mərtəbə)', time: new Date(Date.now() - 120000).toISOString() },
  { id: 'a2', type: 'reservation', message: 'VIP rezervasiya: Nərgiz Səfərova — V1 Salon', time: new Date(Date.now() - 300000).toISOString() },
  { id: 'a3', type: 'table', message: 'Masa 2 → Əsas yemək fazası', time: new Date(Date.now() - 480000).toISOString() },
  { id: 'a4', type: 'waitlist', message: 'Diana Hüseynova VIP gözləmə siyahısına əlavə edildi', time: new Date(Date.now() - 600000).toISOString() },
  { id: 'a5', type: 'capacity', message: 'Terras 21:00 üçün əlavə 3 rezervasiya potensialı', time: new Date(Date.now() - 900000).toISOString() },
  { id: 'a6', type: 'cancel', message: 'Rezervasiya ləğv: #RES00099', time: new Date(Date.now() - 1200000).toISOString() },
  { id: 'a7', type: 'customer', message: 'Vüsal Kərimov VIP status yeniləndi', time: new Date(Date.now() - 1800000).toISOString() },
];

const generateDailyData = (days) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const base = 18 + Math.floor(Math.random() * 22);
    data.push({ date: date.toISOString().split('T')[0], reservations: base, revenue: base * (195 + Math.floor(Math.random() * 90)) });
  }
  return data;
};

export const mockAnalytics = {
  stats: { totalReservations: 284, todayReservations: 28, occupancyRate: 82, avgServiceTime: 54, revenue: 42350, noShowRate: 4, repeatCustomers: 68, avgPartySize: 3.9, satisfaction: 4.9 },
  chartData: { daily: generateDailyData(7), monthly: generateDailyData(30), yearly: generateDailyData(90) },
  topTables: [
    { tableNumber: '21', reservations: 52, revenue: 18600 },
    { tableNumber: '8', reservations: 48, revenue: 14200 },
    { tableNumber: '9', reservations: 41, revenue: 9800 },
    { tableNumber: '15', reservations: 38, revenue: 7600 },
    { tableNumber: '2', reservations: 35, revenue: 7100 },
  ],
  peakHours: [
    { hour: '12:00', count: 18 }, { hour: '13:00', count: 26 }, { hour: '14:00', count: 20 },
    { hour: '18:00', count: 15 }, { hour: '19:00', count: 32 }, { hour: '20:00', count: 42 },
    { hour: '21:00', count: 38 }, { hour: '22:00', count: 22 },
  ],
  operationalInsights: [
    { id: 'op1', type: 'optimization', icon: 'layers', title: 'Çoxmərtəbəli optimallaşdırma', description: 'Zemin mərtəbə 92% dolu, Terras 45% boş. 19:30-21:00 arası VIP qonaqları Terrasa yönləndirin.', impact: 'Yüksək', color: 'blue' },
    { id: 'op2', type: 'revenue', icon: 'dollar', title: 'Premium menyu upsell', description: 'Chef\'s Tasting Menu bu həftə 34% artım potensialı. VIP masalarda avtomatik təklif edin.', impact: 'Yüksək', color: 'green' },
    { id: 'op3', type: 'service', icon: 'clock', title: 'Masa dövriyyəsi', description: 'Masa G4 45 dəq oturub — desert/bill fazasına keçirin. Orta xidmət 54→48 dəq mümkündür.', impact: 'Yüksək', color: 'purple' },
    { id: 'op4', type: 'staff', icon: 'users', title: 'Növbə planı', description: 'Cümə axşamı Terras üçün +1 ofisiant, VIP Salon üçün Elnur kifayətdir.', impact: 'Orta', color: 'amber' },
    { id: 'op5', type: 'customer', icon: 'star', title: 'VIP retention', description: 'Vüsal Kərimov 45 ziyarət — xüsusi şampan təklifi göndərin. LTV: 8900 AZN.', impact: 'Orta', color: 'blue' },
  ],
};

export const mockLoyaltyProgram = {
  pointsPerAzn: 1,
  tiers: [
    { id: 'bronze', name: 'Bronze', minPoints: 0, discount: 0, color: 'bg-amber-100 text-amber-800' },
    { id: 'silver', name: 'Silver', minPoints: 500, discount: 5, color: 'bg-slate-200 text-slate-700' },
    { id: 'gold', name: 'Gold', minPoints: 2000, discount: 10, color: 'bg-amber-200 text-amber-900' },
    { id: 'platinum', name: 'Platinum', minPoints: 5000, discount: 15, color: 'bg-indigo-100 text-indigo-800' },
  ],
  rewards: [
    { id: 'rw1', name: 'Pulsuz desert', pointsCost: 200, description: 'Baklava və ya tiramisu' },
    { id: 'rw2', name: 'Şampan toast', pointsCost: 500, description: '2 nəfər üçün' },
    { id: 'rw3', name: 'Chef tasting 10%', pointsCost: 1500, description: 'Tasting menu endirimi' },
  ],
};

export const mockCampaigns = [
  { id: 'camp1', name: 'Ad günü xatırlatma', trigger: 'birthday_3days', channel: 'sms', status: 'active', sent: 24, converted: 8, template: 'Ad gününüz yaxınlaşır — xüsusi masa təklif edirik!' },
  { id: 'camp2', name: '30 gün gəlməyənlər', trigger: 'inactive_30d', channel: 'sms', status: 'active', sent: 15, converted: 4, template: 'Sizi darıxdıq! 10% endirim kodu: GERIQAYIT' },
  { id: 'camp3', name: 'VIP şampan təklifi', trigger: 'vip_milestone', channel: 'whatsapp', status: 'active', sent: 6, converted: 5, template: 'VIP statusunuz üçün pulsuz prosecco' },
  { id: 'camp4', name: 'Ziyarət sonrası feedback', trigger: 'post_visit', channel: 'sms', status: 'active', sent: 42, converted: 18, template: 'Bu axşamı 1-5 ulduzla qiymətləndirin' },
];

export const mockIncidents = [
  { id: 'inc1', type: 'complaint', customerName: 'Elvin Həsənov', tableNumber: '6', description: 'Yemək gecikdi — 25 dəq gözlədi', status: 'resolved', severity: 'medium', createdAt: new Date(Date.now() - 7200000).toISOString(), resolution: 'Desert comp verildi' },
  { id: 'inc2', type: 'maintenance', customerName: '—', tableNumber: '7', description: 'Stul qırıq — təmir lazım', status: 'open', severity: 'low', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'inc3', type: 'complaint', customerName: 'Tural Məlikov', tableNumber: '—', description: 'Səs çox yüksək idi', status: 'open', severity: 'low', createdAt: new Date(Date.now() - 1800000).toISOString() },
];

export const mockFeedbacks = [
  { id: 'fb1', customerName: 'Aysel Məmmədova', rating: 5, comment: 'Mükəmməl xidmət, plov əla idi', tableNumber: '2', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'fb2', customerName: 'Rəşad Quliyev', rating: 4, comment: 'Vegetarian menyu zəif idi', tableNumber: '12', createdAt: new Date(Date.now() - 43200000).toISOString() },
  { id: 'fb3', customerName: 'Nərgiz Səfərova', rating: 5, comment: 'Korporativ axşam flawless', tableNumber: '20', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const mockBranches = [
  { id: 'rest_1', name: 'Nizami Garden', address: 'Nizami küç.', revenue: 42350, occupancy: 82, reservations: 284, staff: 6 },
  { id: 'rest_2', name: 'Mangal Steakhouse', address: 'Port Baku', revenue: 38100, occupancy: 76, reservations: 241, staff: 5 },
  { id: 'rest_3', name: 'Dukkan Organic', address: 'Yasamal', revenue: 29800, occupancy: 71, reservations: 198, staff: 4 },
];

export const mockClosedBills = [];

export const mockRestaurant = {
  id: 'rest_1', name: 'Nizami Garden', address: 'Nizami küç. 123, Bakı, Azərbaycan',
  phone: '+994123456789', email: 'info@nizamigarden.az', cuisine: 'Azərbaycan & Avropa Premium',
  rating: 4.9, qrCode: 'SM-NIZAMI2026', floors: 4, totalCapacity: 124,
  openingHours: {
    monday: { open: '10:00', close: '23:00' }, tuesday: { open: '10:00', close: '23:00' },
    wednesday: { open: '10:00', close: '23:00' }, thursday: { open: '10:00', close: '23:00' },
    friday: { open: '10:00', close: '00:00' }, saturday: { open: '10:00', close: '00:00' },
    sunday: { open: '10:00', close: '23:00' },
  },
  settings: {
    reservationDuration: 90, maxPartySize: 12, advanceBookingDays: 30,
    notificationsEnabled: true, autoConfirm: false, multiFloor: true,
    maxCoversPerSlot: 48,
    blockedDates: [
      { date: new Date(Date.now() + 604800000).toISOString().split('T')[0], reason: 'Private korporativ — bütün salon', allDay: true },
      { date: new Date(Date.now() + 1209600000).toISOString().split('T')[0], reason: 'VIP otaq təmiri', allDay: false, slots: ['19:00', '19:30', '20:00'] },
    ],
    serviceChargeRate: 0.1,
  },
};

export const mockUser = { id: 'user_1', name: 'Haldun Məmmədov', email: 'demo@seatmind.az', role: 'admin', restaurantId: 'rest_1', avatar: null };
export const DEMO_CREDENTIALS = { email: 'demo@seatmind.az', password: 'demo123' };

export const getInitialAppState = () => ({
  floors: mockFloors,
  tables: mockTables,
  reservations: mockReservations,
  waitlist: mockWaitlist,
  customers: mockCustomers,
  staff: mockStaff,
  menuItems: mockMenuItems,
  notifications: mockNotifications,
  activities: mockActivities,
  restaurant: mockRestaurant,
  events: mockEvents,
  eventPackages: mockEventPackages,
  smsLogs: mockSmsLogs,
  automations: mockAutomations,
  loyaltyProgram: mockLoyaltyProgram,
  campaigns: mockCampaigns,
  incidents: mockIncidents,
  feedbacks: mockFeedbacks,
  branches: mockBranches,
  closedBills: mockClosedBills,
  user: mockUser,
  serverTips: { s1: 45, s2: 32, s5: 28, s6: 18 },
});
