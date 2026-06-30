const views = {
  window: {
    day: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=900&fit=crop',
    label: 'Pəncərə manzarası',
    description: 'Şəhər panoraması və təbii işıq',
    tags: ['Panorama', 'Gün işığı'],
  },
  terrace: {
    day: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1550966841-3ee67bd65d08?w=1400&h=900&fit=crop',
    label: 'Terras görünüşü',
    description: 'Bağ, yaşıllıq və açıq səma',
    tags: ['Terras', 'Brunch', 'Gün batımı'],
  },
  garden: {
    day: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1400&h=900&fit=crop',
    label: 'Bağ görünüşü',
    description: 'Yaşıllıq və sakit atmosfer',
    tags: ['Bağ', 'Sakit'],
  },
  interior: {
    day: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1400&h=900&fit=crop',
    label: 'Salon interyeri',
    description: 'İsti işıq və canlı atmosfer',
    tags: ['Ambient', 'Bar yaxınlığı'],
  },
  corner: {
    day: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1400&h=900&fit=crop',
    label: 'Künc görünüşü',
    description: 'Sakit künc, romantik axşamlar',
    tags: ['Romantik', 'Künc'],
  },
  private: {
    day: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=900&fit=crop',
    evening: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&h=900&fit=crop',
    label: 'VIP otaq',
    description: 'Tam gizlilik və premium xidmət',
    tags: ['VIP', 'Private'],
  },
};

const zoneToView = {
  Pəncərə: 'window',
  Panorama: 'terrace',
  Bağ: 'garden',
  'Əsas Salon': 'interior',
  Bar: 'interior',
  Qəbul: 'interior',
  Mərkəz: 'interior',
  Künc: 'corner',
  'Private Room A': 'private',
  'Private Room B': 'private',
  Lounge: 'corner',
  'Bar Terras': 'terrace',
};

const floorDefault = {
  floor_t: 'terrace',
  floor_1: 'window',
  floor_g: 'interior',
  floor_v: 'private',
};

export const getTableView = (table) => {
  const viewKey = zoneToView[table?.zone] || floorDefault[table?.floorId] || 'interior';
  const view = views[viewKey];
  return { ...view, viewKey };
};

export const getViewHighlights = (table) => {
  const { tags } = getTableView(table);
  const extras = [];
  if (table?.capacity <= 2) extras.push('2 nəfər');
  if (table?.zone === 'Pəncərə') extras.push('Gün batımı tövsiyə');
  if (table?.floorId === 'floor_t') extras.push('Açıq hava');
  return [...tags, ...extras].slice(0, 4);
};

export const allViewTypes = views;
