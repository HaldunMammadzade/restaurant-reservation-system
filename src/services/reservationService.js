import api from './api';

export const reservationService = {
  getAll: async (restaurantId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/reservations/${restaurantId}?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reservations/details/${id}`);
    return response.data;
  },

  getToday: async (restaurantId) => {
    const response = await api.get(`/reservations/${restaurantId}/today`);
    return response.data;
  },

  getUpcoming: async (restaurantId) => {
    const response = await api.get(`/reservations/${restaurantId}/upcoming`);
    return response.data;
  },

  create: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  update: async (id, reservationData) => {
    const response = await api.put(`/reservations/${id}`, reservationData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/reservations/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },

  checkIn: async (id) => {
    const response = await api.post(`/reservations/${id}/checkin`);
    return response.data;
  },

  noShow: async (id) => {
    const response = await api.post(`/reservations/${id}/noshow`);
    return response.data;
  },

  sendReminder: async (id) => {
    const response = await api.post(`/reservations/${id}/reminder`);
    return response.data;
  },
};
