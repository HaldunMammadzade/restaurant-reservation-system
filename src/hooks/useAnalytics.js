import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setStats,
  setChartData,
  setTopTables,
  setPeakHours,
  setLoading,
  setError,
} from '../store/slices/analyticsSlice';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

export const useAnalytics = (restaurantId) => {
  const dispatch = useDispatch();
  const { stats, chartData, topTables, peakHours, loading, error, dateRange } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    if (restaurantId) {
      fetchAllAnalytics();
    }
  }, [restaurantId, dateRange]);

  const fetchAllAnalytics = async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        fetchStats(),
        fetchChartData(),
        fetchTopTables(),
        fetchPeakHours(),
      ]);
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Analitika yüklənmədi');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchStats = async () => {
    try {
      const data = await analyticsService.getStats(restaurantId, dateRange);
      dispatch(setStats(data));
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const fetchChartData = async () => {
    try {
      const data = await analyticsService.getChartData(restaurantId, 'daily', dateRange);
      dispatch(setChartData(data));
    } catch (err) {
      console.error('Chart data error:', err);
    }
  };

  const fetchTopTables = async () => {
    try {
      const data = await analyticsService.getTopTables(restaurantId, dateRange);
      dispatch(setTopTables(data));
    } catch (err) {
      console.error('Top tables error:', err);
    }
  };

  const fetchPeakHours = async () => {
    try {
      const data = await analyticsService.getPeakHours(restaurantId, dateRange);
      dispatch(setPeakHours(data));
    } catch (err) {
      console.error('Peak hours error:', err);
    }
  };

  return {
    stats,
    chartData,
    topTables,
    peakHours,
    loading,
    error,
    fetchAllAnalytics,
    fetchStats,
    fetchChartData,
    fetchTopTables,
    fetchPeakHours,
  };
};
