import api from './api';

export const floorPlanService = {
  getTables: async (restaurantId) => {
    const response = await api.get(`/floor-plan/${restaurantId}/tables`);
    return response.data;
  },

  getLayout: async (restaurantId) => {
    const response = await api.get(`/floor-plan/${restaurantId}/layout`);
    return response.data;
  },

  createTable: async (restaurantId, tableData) => {
    const response = await api.post(`/floor-plan/${restaurantId}/tables`, tableData);
    return response.data;
  },

  updateTable: async (tableId, tableData) => {
    const response = await api.put(`/floor-plan/tables/${tableId}`, tableData);
    return response.data;
  },

  deleteTable: async (tableId) => {
    const response = await api.delete(`/floor-plan/tables/${tableId}`);
    return response.data;
  },

  updateTablePosition: async (tableId, position) => {
    const response = await api.patch(`/floor-plan/tables/${tableId}/position`, position);
    return response.data;
  },

  updateTableStatus: async (tableId, status) => {
    const response = await api.patch(`/floor-plan/tables/${tableId}/status`, { status });
    return response.data;
  },

  saveLayout: async (restaurantId, layoutData) => {
    const response = await api.put(`/floor-plan/${restaurantId}/layout`, layoutData);
    return response.data;
  },
};
