import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  mockTables,
  mockReservations,
  mockWaitlist,
  mockNotifications,
  mockActivities,
  mockRestaurant,
} from '../utils/mockData';
import { RESERVATION_STATUS } from '../utils/constants';

const STORAGE_KEY = 'seatmind_app_data';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const stored = loadFromStorage();

  const [tables, setTables] = useState(stored?.tables || mockTables);
  const [reservations, setReservations] = useState(stored?.reservations || mockReservations);
  const [waitlist, setWaitlist] = useState(stored?.waitlist || mockWaitlist);
  const [notifications, setNotifications] = useState(stored?.notifications || mockNotifications);
  const [activities, setActivities] = useState(stored?.activities || mockActivities);
  const [restaurant, setRestaurant] = useState(stored?.restaurant || mockRestaurant);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tables, reservations, waitlist, notifications, activities, restaurant,
    }));
  }, [tables, reservations, waitlist, notifications, activities, restaurant]);

  const addActivity = useCallback((type, message) => {
    const activity = {
      id: `a${Date.now()}`,
      type,
      message,
      time: new Date().toISOString(),
    };
    setActivities(prev => [activity, ...prev].slice(0, 50));
  }, []);

  const addNotification = useCallback((notification) => {
    const notif = {
      id: `n${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const todayReservations = reservations.filter(r =>
    new Date(r.date).toDateString() === new Date().toDateString()
  );

  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const occupancyRate = tables.length > 0
    ? Math.round((occupiedTables / tables.length) * 100)
    : 0;

  const addToWaitlist = useCallback((entry) => {
    const newEntry = {
      ...entry,
      id: `WL${Date.now().toString().slice(-5)}`,
      joinedAt: new Date().toISOString(),
      waitTime: 0,
      priority: 'normal',
    };
    setWaitlist(prev => [...prev, newEntry]);
    addActivity('waitlist', `${entry.customerName} gözləmə siyahısına əlavə edildi`);
    addNotification({ type: 'waitlist', title: 'Gözləmə siyahısı', message: `${entry.customerName} — ${entry.partySize} nəfər` });
  }, [addActivity, addNotification]);

  const removeFromWaitlist = useCallback((id) => {
    setWaitlist(prev => prev.filter(w => w.id !== id));
  }, []);

  const seatFromWaitlist = useCallback((id, tableId) => {
    const entry = waitlist.find(w => w.id === id);
    if (!entry) return;
    removeFromWaitlist(id);
    setTables(prev => prev.map(t =>
      t.id === tableId ? { ...t, status: 'occupied' } : t
    ));
    addActivity('checkin', `${entry.customerName} gözləmə siyahısından oturdu`);
    addNotification({ type: 'table', title: 'Müştəri oturdu', message: `${entry.customerName} — Masa ${tables.find(t => t.id === tableId)?.number}` });
  }, [waitlist, removeFromWaitlist, tables, addActivity, addNotification]);

  const createReservation = useCallback((data) => {
    const table = tables.find(t => t.id === data.tableId);
    const newRes = {
      ...data,
      id: `RES${Date.now().toString().slice(-5)}`,
      tableNumber: table?.number || '1',
      status: RESERVATION_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newRes, ...prev]);
    if (table) {
      setTables(prev => prev.map(t =>
        t.id === data.tableId ? { ...t, status: 'reserved' } : t
      ));
    }
    addActivity('reservation', `Yeni rezervasiya: ${data.customerName} — ${data.time}`);
    addNotification({ type: 'reservation', title: 'Yeni rezervasiya', message: `${data.customerName} — ${data.time}, ${data.partySize} nəfər` });
    return newRes;
  }, [tables, addActivity, addNotification]);

  const updateReservation = useCallback((id, data) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  }, []);

  const deleteReservation = useCallback((id) => {
    const res = reservations.find(r => r.id === id);
    if (res?.tableId) {
      setTables(prev => prev.map(t =>
        t.id === res.tableId ? { ...t, status: 'available' } : t
      ));
    }
    setReservations(prev => prev.filter(r => r.id !== id));
    addActivity('cancel', `Rezervasiya silindi: #${id}`);
  }, [reservations, addActivity]);

  const checkInReservation = useCallback((id) => {
    const res = reservations.find(r => r.id === id);
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: RESERVATION_STATUS.CHECKED_IN } : r
    ));
    if (res?.tableId) {
      setTables(prev => prev.map(t =>
        t.id === res.tableId ? { ...t, status: 'occupied' } : t
      ));
    }
    addActivity('checkin', `${res?.customerName} check-in etdi — Masa ${res?.tableNumber}`);
  }, [reservations, addActivity]);

  const cancelReservation = useCallback((id) => {
    const res = reservations.find(r => r.id === id);
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: RESERVATION_STATUS.CANCELLED } : r
    ));
    if (res?.tableId) {
      setTables(prev => prev.map(t =>
        t.id === res.tableId ? { ...t, status: 'available' } : t
      ));
    }
    addActivity('cancel', `Rezervasiya ləğv edildi: ${res?.customerName}`);
  }, [reservations, addActivity]);

  const value = {
    tables, setTables,
    reservations, setReservations,
    waitlist, setWaitlist,
    notifications, setNotifications,
    activities, setActivities,
    restaurant, setRestaurant,
    todayReservations,
    occupancyRate,
    unreadCount,
    addActivity,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    addToWaitlist,
    removeFromWaitlist,
    seatFromWaitlist,
    createReservation,
    updateReservation,
    deleteReservation,
    checkInReservation,
    cancelReservation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
