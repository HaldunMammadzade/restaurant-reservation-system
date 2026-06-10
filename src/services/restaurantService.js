import api from './api';

export const restaurantService = {
  getAll: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  create: async (restaurantData) => {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },

  update: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  getSettings: async (id) => {
    const response = await api.get(`/restaurants/${id}/settings`);
    return response.data;
  },

  updateSettings: async (id, settings) => {
    const response = await api.put(`/restaurants/${id}/settings`, settings);
    return response.data;
  },
};
