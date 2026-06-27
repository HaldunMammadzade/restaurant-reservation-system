/** Etibarlı food stock şəkilləri — Unsplash source URL */
export const MENU_IMAGE_URLS = {
  m1: 'https://images.unsplash.com/photo-1516684669134-de6f7ed147ab?w=400&h=300&fit=crop',
  m2: 'https://images.unsplash.com/photo-1546833998-877b37c2e00c?w=400&h=300&fit=crop',
  m3: 'https://images.unsplash.com/photo-1626082927389-6c097acf0812?w=400&h=300&fit=crop',
  m4: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop',
  m5: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  m6: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  m7: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  m8: 'https://images.unsplash.com/photo-1505252585461-04db1eb84665?w=400&h=300&fit=crop',
  m9: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
  m10: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
};

export const resolveMenuImage = (item) => MENU_IMAGE_URLS[item.id] || item.image;
