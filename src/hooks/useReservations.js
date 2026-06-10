import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setReservations,
  setTodayReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  setLoading,
  setError,
} from '../store/slices/reservationSlice';
import { reservationService } from '../services/reservationService';
import toast from 'react-hot-toast';

export const useReservations = (restaurantId) => {
  const dispatch = useDispatch();
  const { reservations, todayReservations, loading, error, filters } = useSelector(
    (state) => state.reservations
  );

  useEffect(() => {
    if (restaurantId) {
      fetchReservations();
      fetchTodayReservations();
    }
  }, [restaurantId, filters]);

  const fetchReservations = async () => {
    try {
      dispatch(setLoading(true));
      const data = await reservationService.getAll(restaurantId, filters);
      dispatch(setReservations(data));
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Rezervasiyalar yüklənmədi');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchTodayReservations = async () => {
    try {
      const data = await reservationService.getToday(restaurantId);
      dispatch(setTodayReservations(data));
    } catch (err) {
      console.error('Today reservations error:', err);
    }
  };

  const createReservation = async (reservationData) => {
    try {
      const data = await reservationService.create({
        ...reservationData,
        restaurantId,
      });
      dispatch(addReservation(data));
      toast.success('Rezervasiya yaradıldı');
      return data;
    } catch (err) {
      toast.error('Rezervasiya yaradılmadı');
      throw err;
    }
  };

  const updateReservationData = async (id, reservationData) => {
    try {
      const data = await reservationService.update(id, reservationData);
      dispatch(updateReservation(data));
      toast.success('Rezervasiya yeniləndi');
      return data;
    } catch (err) {
      toast.error('Rezervasiya yenilənmədi');
      throw err;
    }
  };

  const deleteReservationData = async (id) => {
    try {
      await reservationService.delete(id);
      dispatch(deleteReservation(id));
      toast.success('Rezervasiya silindi');
    } catch (err) {
      toast.error('Rezervasiya silinmədi');
      throw err;
    }
  };

  const checkInReservation = async (id) => {
    try {
      const data = await reservationService.checkIn(id);
      dispatch(updateReservation(data));
      toast.success('Müştəri qeydə alındı');
      return data;
    } catch (err) {
      toast.error('Check-in uğursuz oldu');
      throw err;
    }
  };

  const markNoShow = async (id) => {
    try {
      const data = await reservationService.noShow(id);
      dispatch(updateReservation(data));
      toast.success('No-show olaraq qeyd edildi');
      return data;
    } catch (err) {
      toast.error('Əməliyyat uğursuz oldu');
      throw err;
    }
  };

  return {
    reservations,
    todayReservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation: updateReservationData,
    deleteReservation: deleteReservationData,
    checkInReservation,
    markNoShow,
  };
};
