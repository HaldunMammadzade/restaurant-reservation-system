import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservations: [],
  todayReservations: [],
  upcomingReservations: [],
  loading: false,
  error: null,
  filters: {
    date: new Date().toISOString().split('T')[0],
    status: 'all',
    searchQuery: '',
  },
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    setTodayReservations: (state, action) => {
      state.todayReservations = action.payload;
    },
    setUpcomingReservations: (state, action) => {
      state.upcomingReservations = action.payload;
    },
    addReservation: (state, action) => {
      state.reservations.unshift(action.payload);
      state.todayReservations.unshift(action.payload);
    },
    updateReservation: (state, action) => {
      const updateInArray = (arr) => {
        const index = arr.findIndex(r => r.id === action.payload.id);
        if (index !== -1) arr[index] = action.payload;
      };
      updateInArray(state.reservations);
      updateInArray(state.todayReservations);
      updateInArray(state.upcomingReservations);
    },
    deleteReservation: (state, action) => {
      state.reservations = state.reservations.filter(r => r.id !== action.payload);
      state.todayReservations = state.todayReservations.filter(r => r.id !== action.payload);
      state.upcomingReservations = state.upcomingReservations.filter(r => r.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
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
  setReservations,
  setTodayReservations,
  setUpcomingReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  setFilters,
  setLoading,
  setError,
} = reservationSlice.actions;

export default reservationSlice.reducer;
