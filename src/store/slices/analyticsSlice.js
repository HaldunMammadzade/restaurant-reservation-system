import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalReservations: 0,
    todayReservations: 0,
    occupancyRate: 0,
    avgServiceTime: 0,
    revenue: 0,
    noShowRate: 0,
  },
  chartData: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  topTables: [],
  peakHours: [],
  customerInsights: [],
  loading: false,
  error: null,
  dateRange: {
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setChartData: (state, action) => {
      state.chartData = action.payload;
    },
    setTopTables: (state, action) => {
      state.topTables = action.payload;
    },
    setPeakHours: (state, action) => {
      state.peakHours = action.payload;
    },
    setCustomerInsights: (state, action) => {
      state.customerInsights = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
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
  setStats,
  setChartData,
  setTopTables,
  setPeakHours,
  setCustomerInsights,
  setDateRange,
  setLoading,
  setError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
