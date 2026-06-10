import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: [],
  selectedTable: null,
  layout: {
    width: 1200,
    height: 800,
  },
  loading: false,
  error: null,
};

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.tables = action.payload;
    },
    addTable: (state, action) => {
      state.tables.push(action.payload);
    },
    updateTable: (state, action) => {
      const index = state.tables.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tables[index] = { ...state.tables[index], ...action.payload };
      }
    },
    deleteTable: (state, action) => {
      state.tables = state.tables.filter(t => t.id !== action.payload);
      if (state.selectedTable?.id === action.payload) {
        state.selectedTable = null;
      }
    },
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
    updateTablePosition: (state, action) => {
      const { id, x, y } = action.payload;
      const table = state.tables.find(t => t.id === id);
      if (table) {
        table.x = x;
        table.y = y;
      }
    },
    updateTableStatus: (state, action) => {
      const { id, status } = action.payload;
      const table = state.tables.find(t => t.id === id);
      if (table) {
        table.status = status;
      }
    },
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTables,
  addTable,
  updateTable,
  deleteTable,
  setSelectedTable,
  updateTablePosition,
  updateTableStatus,
  setLayout,
  setLoading,
  setError,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;
