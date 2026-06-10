import api from './api';

export const analyticsService = {
  getStats: async (restaurantId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await api.get(`/analytics/${restaurantId}/stats?${params}`);
    return response.data;
  },

  getChartData: async (restaurantId, period, dateRange) => {
    const params = new URLSearchParams({ period, ...dateRange });
    const response = await api.get(`/analytics/${restaurantId}/charts?${params}`);
    return response.data;
  },

  getTopTables: async (restaurantId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await api.get(`/analytics/${restaurantId}/top-tables?${params}`);
    return response.data;
  },

  getPeakHours: async (restaurantId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await api.get(`/analytics/${restaurantId}/peak-hours?${params}`);
    return response.data;
  },

  getCustomerInsights: async (restaurantId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await api.get(`/analytics/${restaurantId}/customer-insights?${params}`);
    return response.data;
  },

  getOccupancyRate: async (restaurantId, date) => {
    const response = await api.get(`/analytics/${restaurantId}/occupancy?date=${date}`);
    return response.data;
  },

  getRevenueReport: async (restaurantId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await api.get(`/analytics/${restaurantId}/revenue?${params}`);
    return response.data;
  },

  exportReport: async (restaurantId, reportType, dateRange) => {
    const params = new URLSearchParams({ reportType, ...dateRange });
    const response = await api.get(`/analytics/${restaurantId}/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
