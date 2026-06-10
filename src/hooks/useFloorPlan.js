import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTables,
  addTable,
  updateTable,
  deleteTable,
  updateTablePosition,
  updateTableStatus,
  setLoading,
  setError,
} from '../store/slices/floorPlanSlice';
import { floorPlanService } from '../services/floorPlanService';
import toast from 'react-hot-toast';

export const useFloorPlan = (restaurantId) => {
  const dispatch = useDispatch();
  const { tables, selectedTable, layout, loading, error } = useSelector(
    (state) => state.floorPlan
  );

  useEffect(() => {
    if (restaurantId) {
      fetchTables();
    }
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      dispatch(setLoading(true));
      const data = await floorPlanService.getTables(restaurantId);
      dispatch(setTables(data));
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Masalar yüklənmədi');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTable = async (tableData) => {
    try {
      const data = await floorPlanService.createTable(restaurantId, tableData);
      dispatch(addTable(data));
      toast.success('Masa əlavə edildi');
      return data;
    } catch (err) {
      toast.error('Masa əlavə edilmədi');
      throw err;
    }
  };

  const updateTableData = async (tableId, tableData) => {
    try {
      const data = await floorPlanService.updateTable(tableId, tableData);
      dispatch(updateTable(data));
      toast.success('Masa yeniləndi');
      return data;
    } catch (err) {
      toast.error('Masa yenilənmədi');
      throw err;
    }
  };

  const deleteTableData = async (tableId) => {
    try {
      await floorPlanService.deleteTable(tableId);
      dispatch(deleteTable(tableId));
      toast.success('Masa silindi');
    } catch (err) {
      toast.error('Masa silinmədi');
      throw err;
    }
  };

  const moveTable = async (tableId, position) => {
    try {
      await floorPlanService.updateTablePosition(tableId, position);
      dispatch(updateTablePosition({ id: tableId, ...position }));
    } catch (err) {
      toast.error('Masa yerləşdirilmədi');
      throw err;
    }
  };

  const changeTableStatus = async (tableId, status) => {
    try {
      await floorPlanService.updateTableStatus(tableId, status);
      dispatch(updateTableStatus({ id: tableId, status }));
      toast.success('Masa statusu dəyişdirildi');
    } catch (err) {
      toast.error('Status dəyişdirilmədi');
      throw err;
    }
  };

  return {
    tables,
    selectedTable,
    layout,
    loading,
    error,
    fetchTables,
    createTable,
    updateTable: updateTableData,
    deleteTable: deleteTableData,
    moveTable,
    changeTableStatus,
  };
};
