import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { getInitialAppState, mockAnalytics } from '../utils/mockData';
import { TABLE_STATUS, RESERVATION_STATUS, EVENT_STATUS, BOOKING_SOURCE } from '../utils/constants';
import {
  findCustomerByPhone, getAvailableSlots, suggestBestTable, defaultEventChecklist,
} from '../utils/bookingHelpers';
import { computeOperationsBriefing } from '../utils/operationsEngine';
import { computeDailyClose } from '../utils/dailyClose';
import { computePrepList } from '../utils/prepListEngine';
import { calculateTableBill } from '../utils/billingHelpers';
import { pointsFromSpend } from '../utils/loyaltyEngine';
import { computeTurnQueue } from '../utils/bookingConflict';
import { computeSourceAnalytics } from '../utils/sourceAnalytics';

const STORAGE_KEY = 'seatmind_app_v6';

const genId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const loadState = () => {
  const defaults = getInitialAppState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaults;
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((fn) => setState((prev) => (typeof fn === 'function' ? fn(prev) : fn)), []);

  const addActivity = useCallback((type, message) => {
    update((s) => ({
      ...s,
      activities: [{ id: genId('a'), type, message, time: new Date().toISOString() }, ...s.activities].slice(0, 60),
    }));
  }, [update]);

  const addNotification = useCallback((n) => {
    update((s) => ({
      ...s,
      notifications: [{ id: genId('n'), read: false, time: new Date().toISOString(), ...n }, ...s.notifications],
    }));
  }, [update]);

  const sendSms = useCallback((to, message, type = 'general') => {
    const log = { id: genId('sms'), to, message, type, sentAt: new Date().toISOString(), status: 'delivered' };
    update((s) => ({ ...s, smsLogs: [log, ...s.smsLogs].slice(0, 100) }));
    addActivity('sms', `SMS göndərildi: ${to.slice(-4)}`);
    return log;
  }, [update, addActivity]);

  const upsertCustomerFromBooking = useCallback((s, data) => {
    const existing = findCustomerByPhone(s.customers, data.customerPhone);
    if (existing) {
      return {
        ...s,
        customers: s.customers.map((c) => (c.id === existing.id ? {
          ...c,
          name: data.customerName || c.name,
          email: data.customerEmail || c.email,
          vip: data.vip ?? c.vip,
          dietary: data.dietary || c.dietary,
        } : c)),
      };
    }
    const customer = {
      id: genId('c'), name: data.customerName, phone: data.customerPhone,
      email: data.customerEmail || '', visitCount: 0, totalSpent: 0,
      vip: data.vip || false, tags: [], dietary: data.dietary || 'none',
    };
    return { ...s, customers: [customer, ...s.customers] };
  }, []);

  const reserveTables = (tables, tableIds, status = TABLE_STATUS.RESERVED) =>
    tables.map((t) => (tableIds.includes(t.id) ? { ...t, status } : t));

  const freeTables = (tables, tableIds) =>
    tables.map((t) => (tableIds.includes(t.id) && (t.status === TABLE_STATUS.RESERVED || t.status === TABLE_STATUS.OCCUPIED)
      ? { ...t, status: TABLE_STATUS.AVAILABLE, guestName: undefined, partySize: undefined, servicePhase: undefined, seatedAt: undefined }
      : t));

  const getTableIds = (res) => [res.tableId, ...(res.mergedTableIds || [])].filter(Boolean);

  // ——— Reservations ———
  const createReservation = useCallback((data, options = {}) => {
    const table = state.tables.find((t) => t.id === data.tableId);
    const mergedIds = data.mergedTableIds || [];
    const allIds = [data.tableId, ...mergedIds].filter(Boolean);
    const reservation = {
      id: genId('RES'),
      status: data.status || RESERVATION_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
      vip: false,
      occasionType: 'standard',
      deposit: 0,
      depositPaid: false,
      dietary: 'none',
      source: options.source || BOOKING_SOURCE.MANAGER,
      smsReminderSent: false,
      floorId: table?.floorId || data.floorId,
      zone: table?.zone || data.zone,
      tableNumber: table?.number,
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
    };

    update((s) => {
      let next = {
        ...s,
        reservations: [reservation, ...s.reservations],
        tables: allIds.length ? reserveTables(s.tables, allIds) : s.tables,
      };
      next = upsertCustomerFromBooking(next, reservation);
      return next;
    });

    addActivity('reservation', `${data.customerName} — ${data.time}, ${data.partySize} nəfər`);
    addNotification({ type: 'reservation', title: 'Yeni rezervasiya', message: `${data.customerName} — ${data.time}` });

    if (options.sendSms !== false && state.restaurant?.settings?.notificationsEnabled) {
      sendSms(data.customerPhone, `${data.customerName}, ${data.date?.split?.('T')?.[0] || data.date} ${data.time} rezervasiyanız təsdiqlənib. ${state.restaurant.name}.`, 'confirmation');
    }
    return reservation;
  }, [state.tables, state.restaurant, update, addActivity, addNotification, sendSms, upsertCustomerFromBooking]);

  const createQrReservation = useCallback((data) => {
    const table = suggestBestTable(state.tables, data.partySize, data.floorId, data.zone)
      || getAvailableSlots(state.tables, state.reservations, data.date, data.partySize, data.floorId, data.zone, state.restaurant?.settings)
        .find((s) => s.time === data.time)?.tables?.[0];

    if (!table && !data.tableId) return null;

    return createReservation({
      ...data,
      tableId: data.tableId || table?.id,
      tableNumber: table?.number,
      floorId: data.floorId || table?.floorId,
      zone: data.zone || table?.zone,
      status: RESERVATION_STATUS.PENDING,
    }, { source: BOOKING_SOURCE.QR, sendSms: true });
  }, [state.tables, state.reservations, createReservation]);

  const updateReservation = useCallback((id, data) => {
    update((s) => ({
      ...s,
      reservations: s.reservations.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
  }, [update]);

  const deleteReservation = useCallback((id) => {
    update((s) => {
      const res = s.reservations.find((r) => r.id === id);
      const ids = res ? getTableIds(res) : [];
      return {
        ...s,
        reservations: s.reservations.filter((r) => r.id !== id),
        tables: ids.length ? freeTables(s.tables, ids) : s.tables,
      };
    });
    addActivity('cancel', `Rezervasiya silindi: #${id}`);
  }, [update, addActivity]);

  const checkInReservation = useCallback((id) => {
    update((s) => {
      const res = s.reservations.find((r) => r.id === id);
      if (!res) return s;
      const ids = getTableIds(res);
      const customer = findCustomerByPhone(s.customers, res.customerPhone);
      return {
        ...s,
        reservations: s.reservations.map((r) => (r.id === id ? { ...r, status: RESERVATION_STATUS.CHECKED_IN } : r)),
        tables: ids.length ? s.tables.map((t) => (ids.includes(t.id) ? {
          ...t, status: TABLE_STATUS.OCCUPIED, guestName: res.customerName, partySize: res.partySize,
          servicePhase: 'seated', seatedAt: Date.now(), reservationId: id,
        } : t)) : s.tables,
        customers: customer ? s.customers.map((c) => (c.id === customer.id ? {
          ...c, visitCount: c.visitCount + 1, lastVisit: new Date().toISOString(),
        } : c)) : s.customers,
      };
    });
    addActivity('checkin', `Check-in: #${id}`);
  }, [update, addActivity]);

  const cancelReservation = useCallback((id) => {
    update((s) => {
      const res = s.reservations.find((r) => r.id === id);
      const ids = res ? getTableIds(res) : [];
      return {
        ...s,
        reservations: s.reservations.map((r) => (r.id === id ? { ...r, status: RESERVATION_STATUS.CANCELLED } : r)),
        tables: ids.length ? freeTables(s.tables, ids) : s.tables,
      };
    });
    const res = state.reservations.find((r) => r.id === id);
    if (res) sendSms(res.customerPhone, `Rezervasiyanız ləğv edildi. ${state.restaurant.name}`, 'cancel');
  }, [update, state.reservations, state.restaurant, sendSms]);

  const markNoShow = useCallback((id) => {
    update((s) => {
      const res = s.reservations.find((r) => r.id === id);
      const customer = res ? findCustomerByPhone(s.customers, res.customerPhone) : null;
      const ids = res ? getTableIds(res) : [];
      return {
        ...s,
        reservations: s.reservations.map((r) => (r.id === id ? { ...r, status: RESERVATION_STATUS.NO_SHOW } : r)),
        tables: ids.length ? freeTables(s.tables, ids) : s.tables,
        customers: customer ? s.customers.map((c) => (c.id === customer.id ? { ...c, noShowCount: (c.noShowCount || 0) + 1 } : c)) : s.customers,
      };
    });
    addActivity('cancel', `No-show: #${id}`);
  }, [update, addActivity]);

  const sendReservationReminder = useCallback((id) => {
    const res = state.reservations.find((r) => r.id === id);
    if (!res) return;
    sendSms(res.customerPhone, `${res.customerName}, bu gün ${res.time} rezervasiyanız var. ${state.restaurant.name} sizi gözləyir!`, 'reminder');
    updateReservation(id, { smsReminderSent: true });
  }, [state.reservations, state.restaurant, sendSms, updateReservation]);

  // ——— Events ———
  const createEvent = useCallback((input) => {
    const pkg = state.eventPackages.find((p) => p.id === input.packageId);
    const event = {
      id: genId('EVT'),
      status: EVENT_STATUS.INQUIRY,
      depositPaid: false,
      checklist: defaultEventChecklist(input.occasionType),
      assignedStaffIds: [],
      tableIds: input.tableIds || [],
      createdAt: new Date().toISOString(),
      estimatedTotal: pkg ? (input.partySize || pkg.minGuests) * pkg.pricePerPerson : 0,
      deposit: pkg ? Math.round((input.partySize || pkg.minGuests) * pkg.pricePerPerson * (pkg.depositPercent / 100)) : 0,
      ...input,
      date: input.date instanceof Date ? input.date.toISOString() : input.date,
    };
    update((s) => ({ ...s, events: [event, ...s.events] }));
    addActivity('event', `Yeni tədbir: ${event.title}`);
    addNotification({ type: 'event', title: 'Yeni tədbir sorğusu', message: event.title });
    return event;
  }, [state.eventPackages, update, addActivity, addNotification]);

  const updateEvent = useCallback((id, input) => {
    update((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === id ? { ...e, ...input } : e)),
    }));
  }, [update]);

  const deleteEvent = useCallback((id) => {
    update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
  }, [update]);

  const toggleEventChecklist = useCallback((eventId, itemId) => {
    update((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === eventId ? {
        ...e,
        checklist: e.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
      } : e)),
    }));
  }, [update]);

  const confirmEventDeposit = useCallback((eventId) => {
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return;
    updateEvent(eventId, { depositPaid: true, status: EVENT_STATUS.DEPOSIT_PAID });
    toggleEventChecklist(eventId, 'deposit');
    sendSms(event.customerPhone, `${event.customerName}, "${event.title}" tədbiri üçün ${event.deposit} AZN depozit qəbul edildi.`, 'deposit');
    if (event.tableIds?.length) {
      update((s) => ({ ...s, tables: reserveTables(s.tables, event.tableIds) }));
    }
  }, [state.events, updateEvent, toggleEventChecklist, sendSms, update]);

  const convertEventToReservation = useCallback((eventId) => {
    const event = state.events.find((e) => e.id === eventId);
    if (!event || !event.tableIds?.[0]) return null;
    const res = createReservation({
      customerName: event.customerName,
      customerPhone: event.customerPhone,
      customerEmail: event.customerEmail,
      date: event.date,
      time: event.startTime,
      partySize: event.partySize,
      tableId: event.tableIds[0],
      mergedTableIds: event.tableIds.slice(1),
      notes: event.notes,
      vip: true,
      occasionType: event.occasionType,
      deposit: event.deposit,
      depositPaid: event.depositPaid,
      floorId: event.floorId,
      eventId: event.id,
    });
    updateEvent(eventId, { status: EVENT_STATUS.CONFIRMED, reservationId: res?.id });
    return res;
  }, [state.events, createReservation, updateEvent]);

  // ——— Waitlist ———
  const addToWaitlist = useCallback((entry) => {
    const item = { id: genId('WL'), waitTime: 0, priority: 'normal', joinedAt: new Date().toISOString(), ...entry };
    update((s) => ({ ...s, waitlist: [...s.waitlist, item] }));
    addActivity('waitlist', `${entry.customerName} gözləmə siyahısına əlavə edildi`);
  }, [update, addActivity]);

  const removeFromWaitlist = useCallback((id) => {
    update((s) => ({ ...s, waitlist: s.waitlist.filter((w) => w.id !== id) }));
  }, [update]);

  const seatFromWaitlist = useCallback((id, tableId) => {
    update((s) => {
      const entry = s.waitlist.find((w) => w.id === id);
      if (!entry) return s;
      return {
        ...s,
        waitlist: s.waitlist.filter((w) => w.id !== id),
        tables: s.tables.map((t) => (t.id === tableId ? {
          ...t, status: TABLE_STATUS.OCCUPIED, guestName: entry.customerName,
          partySize: entry.partySize, servicePhase: 'seated', seatedAt: Date.now(),
        } : t)),
      };
    });
    sendSms(state.waitlist.find((w) => w.id === id)?.customerPhone, 'Masanız hazırdır! Zəhmət olmasa daxil olun.', 'table_ready');
    addActivity('table', `Gözləmədən oturdu — masa ${tableId}`);
  }, [update, state.waitlist, sendSms, addActivity]);

  // ——— Tables ———
  const createTable = useCallback((input) => {
    update((s) => ({
      ...s,
      tables: [...s.tables, { id: genId('t'), rotation: 0, status: TABLE_STATUS.AVAILABLE, x: 100, y: 100, zone: 'Əsas Salon', floorId: 'floor_g', ...input }],
    }));
  }, [update]);

  const updateTable = useCallback((id, input) => {
    update((s) => ({ ...s, tables: s.tables.map((t) => (t.id === id ? { ...t, ...input } : t)) }));
  }, [update]);

  const deleteTable = useCallback((id) => {
    update((s) => ({ ...s, tables: s.tables.filter((t) => t.id !== id) }));
  }, [update]);

  const saveTableLayout = useCallback((positions) => {
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => {
        const pos = positions.find((p) => p.id === t.id);
        return pos ? { ...t, x: pos.x, y: pos.y, rotation: pos.rotation ?? t.rotation } : t;
      }),
    }));
  }, [update]);

  const mergeTables = useCallback((primaryId, secondaryId) => {
    update((s) => {
      const primary = s.tables.find((t) => t.id === primaryId);
      const secondary = s.tables.find((t) => t.id === secondaryId);
      if (!primary || !secondary) return s;
      const mergeGroup = primary.mergeGroup || genId('merge');
      return {
        ...s,
        tables: s.tables.map((t) => {
          if (t.id === primaryId) return { ...t, mergeGroup, mergedWith: [...(t.mergedWith || []), secondaryId], capacity: primary.capacity + secondary.capacity };
          if (t.id === secondaryId) return { ...t, mergeGroup, mergedInto: primaryId, status: TABLE_STATUS.MAINTENANCE };
          return t;
        }),
      };
    });
    addActivity('table', `Masalar birləşdirildi: ${primaryId} + ${secondaryId}`);
  }, [update, addActivity]);

  const unmergeTable = useCallback((tableId) => {
    update((s) => {
      const table = s.tables.find((t) => t.id === tableId);
      if (!table?.mergedWith?.length) return s;
      const secondaryIds = table.mergedWith;
      return {
        ...s,
        tables: s.tables.map((t) => {
          if (t.id === tableId) {
            const orig = s.tables.find((x) => x.id === tableId);
            const restoredCap = secondaryIds.reduce((sum, sid) => {
              const sec = s.tables.find((x) => x.id === sid);
              return sum - (sec?.capacity || 0);
            }, t.capacity);
            return { ...t, capacity: Math.max(restoredCap, 2), mergedWith: undefined, mergeGroup: undefined };
          }
          if (secondaryIds.includes(t.id)) return { ...t, status: TABLE_STATUS.AVAILABLE, mergedInto: undefined, mergeGroup: undefined };
          return t;
        }),
      };
    });
  }, [update]);

  const assignServerToTable = useCallback((tableId, staffId) => {
    updateTable(tableId, { serverId: staffId || undefined });
    const staff = state.staff.find((s) => s.id === staffId);
    if (staff) addActivity('staff', `${staff.name} → masa ${state.tables.find((t) => t.id === tableId)?.number}`);
  }, [updateTable, state.staff, state.tables, addActivity]);

  const advanceServicePhase = useCallback((tableId) => {
    const phases = ['seated', 'appetizer', 'main', 'dessert', 'bill'];
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => {
        if (t.id !== tableId) return t;
        const idx = phases.indexOf(t.servicePhase || 'seated');
        return { ...t, servicePhase: phases[Math.min(idx + 1, phases.length - 1)] };
      }),
    }));
  }, [update]);

  const clearTable = useCallback((tableId) => {
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => (t.id === tableId ? {
        ...t, status: TABLE_STATUS.CLEANING, guestName: undefined, partySize: undefined,
        servicePhase: undefined, seatedAt: undefined, reservationId: undefined, orders: [],
      } : t)),
    }));
  }, [update]);

  const addTableOrder = useCallback((tableId, menuItem) => {
    if (!menuItem?.available) return null;
    const order = {
      id: genId('ord'), menuItemId: menuItem.id, name: menuItem.name,
      price: menuItem.price, qty: 1, status: 'kitchen', addedAt: new Date().toISOString(),
    };
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, orders: [...(t.orders || []), order] } : t)),
    }));
    addActivity('table', `Sifariş: ${menuItem.name} → masa ${state.tables.find((t) => t.id === tableId)?.number}`);
    return order;
  }, [update, addActivity, state.tables]);

  const removeTableOrder = useCallback((tableId, orderId) => {
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, orders: (t.orders || []).filter((o) => o.id !== orderId) } : t)),
    }));
  }, [update]);

  const updateTableOrderStatus = useCallback((tableId, orderId, status) => {
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => (t.id === tableId ? {
        ...t,
        orders: (t.orders || []).map((o) => (o.id === orderId ? { ...o, status } : o)),
      } : t)),
    }));
  }, [update]);

  // ——— Customers, Staff, Menu ———
  const createCustomer = useCallback((input) => {
    update((s) => ({ ...s, customers: [{
      id: genId('c'), visitCount: 0, totalSpent: 0, tags: [], noShowCount: 0,
      loyaltyPoints: 0, blacklisted: false, ...input,
    }, ...s.customers] }));
    addActivity('customer', `Yeni müştəri: ${input.name}`);
  }, [update, addActivity]);

  const updateCustomer = useCallback((id, input) => {
    update((s) => ({ ...s, customers: s.customers.map((c) => (c.id === id ? { ...c, ...input } : c)) }));
  }, [update]);

  const deleteCustomer = useCallback((id) => {
    update((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) }));
  }, [update]);

  const createStaff = useCallback((input) => {
    update((s) => ({ ...s, staff: [...s.staff, { id: genId('s'), status: 'active', floorId: 'floor_g', ...input }] }));
  }, [update]);

  const updateStaff = useCallback((id, input) => {
    update((s) => ({ ...s, staff: s.staff.map((m) => (m.id === id ? { ...m, ...input } : m)) }));
  }, [update]);

  const deleteStaff = useCallback((id) => {
    update((s) => ({ ...s, staff: s.staff.filter((m) => m.id !== id) }));
  }, [update]);

  const createMenuItem = useCallback((input) => {
    update((s) => ({ ...s, menuItems: [{ id: genId('m'), available: true, isPopular: false, allergens: [], ...input }, ...s.menuItems] }));
  }, [update]);

  const updateMenuItem = useCallback((id, input) => {
    update((s) => ({ ...s, menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, ...input } : m)) }));
  }, [update]);

  const deleteMenuItem = useCallback((id) => {
    update((s) => ({ ...s, menuItems: s.menuItems.filter((m) => m.id !== id) }));
  }, [update]);

  const markNotificationRead = useCallback((id) => {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  }, [update]);

  const markAllNotificationsRead = useCallback(() => {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, [update]);

  const setRestaurant = useCallback((data) => {
    update((s) => ({ ...s, restaurant: { ...s.restaurant, ...data } }));
  }, [update]);

  const resetDemoData = useCallback(() => setState(getInitialAppState()), []);

  const closeTableBill = useCallback((tableId, { discountPercent = 0, compAmount = 0, paymentMethod = 'card', tipAmount = 0, splitParts = 1 }) => {
    const table = state.tables.find((t) => t.id === tableId);
    if (!table) return null;
    const customer = table.guestName
      ? state.customers.find((c) => c.name?.split(' ')[0] === table.guestName?.split(' ')[0])
      : null;
    const loyalty = customer ? Math.round((customer.loyaltyPoints || 0) >= 500 ? calculateTableBill(table).subtotal * 0.05 : 0) : 0;
    const bill = calculateTableBill(table, { discountPercent, compAmount, loyaltyDiscount: loyalty });
    const closedBill = {
      id: genId('bill'), tableId, tableNumber: table.number, guestName: table.guestName,
      ...bill, paymentMethod, tipAmount, splitParts, closedAt: new Date().toISOString(),
    };
    update((s) => {
      let customers = s.customers;
      if (customer) {
        const pts = pointsFromSpend(bill.total, s.loyaltyProgram?.pointsPerAzn || 1);
        customers = customers.map((c) => c.id === customer.id
          ? { ...c, loyaltyPoints: (c.loyaltyPoints || 0) + pts, visitCount: c.visitCount + 1, totalSpent: c.totalSpent + bill.total }
          : c);
      }
      const tips = { ...s.serverTips };
      if (table.serverId && tipAmount) tips[table.serverId] = (tips[table.serverId] || 0) + tipAmount;
      return {
        ...s,
        customers,
        serverTips: tips,
        closedBills: [closedBill, ...s.closedBills].slice(0, 200),
        tables: s.tables.map((t) => t.id === tableId ? {
          ...t, status: TABLE_STATUS.CLEANING, orders: [], guestName: undefined,
          partySize: undefined, servicePhase: undefined, seatedAt: undefined,
        } : t),
      };
    });
    addActivity('table', `Hesab bağlandı: Masa ${table.number} — ${bill.total.toFixed(2)} AZN`);
    return closedBill;
  }, [state.tables, state.customers, update, addActivity]);

  const createWalkIn = useCallback((data) => {
    const table = suggestBestTable(state.tables, data.partySize, data.floorId, data.zone)
      || state.tables.find((t) => t.status === TABLE_STATUS.AVAILABLE && t.capacity >= data.partySize);
    if (!table) return null;
    update((s) => ({
      ...s,
      tables: s.tables.map((t) => t.id === table.id ? {
        ...t, status: TABLE_STATUS.OCCUPIED, guestName: data.customerName,
        partySize: data.partySize, servicePhase: 'seated', seatedAt: Date.now(),
      } : t),
    }));
    addActivity('checkin', `Walk-in: ${data.customerName} — Masa ${table.number}`);
    return table;
  }, [state.tables, update, addActivity]);

  const createIncident = useCallback((input) => {
    const inc = { id: genId('inc'), status: 'open', createdAt: new Date().toISOString(), ...input };
    update((s) => ({ ...s, incidents: [inc, ...s.incidents] }));
    addActivity('table', `Incident: ${input.description?.slice(0, 40)}`);
    return inc;
  }, [update, addActivity]);

  const resolveIncident = useCallback((id, resolution) => {
    update((s) => ({
      ...s,
      incidents: s.incidents.map((i) => i.id === id ? { ...i, status: 'resolved', resolution } : i),
    }));
  }, [update]);

  const addFeedback = useCallback((input) => {
    const fb = { id: genId('fb'), createdAt: new Date().toISOString(), ...input };
    update((s) => ({ ...s, feedbacks: [fb, ...s.feedbacks] }));
    return fb;
  }, [update]);

  const runCampaign = useCallback((campaignId) => {
    const camp = state.campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const targets = state.customers.filter((c) => !c.blacklisted).slice(0, 3);
    targets.forEach((c) => sendSms(c.phone, camp.template, 'campaign'));
    update((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => c.id === campaignId ? { ...c, sent: c.sent + targets.length } : c),
    }));
    addActivity('sms', `Kampaniya: ${camp.name} — ${targets.length} SMS`);
  }, [state.campaigns, state.customers, sendSms, update, addActivity]);

  const redeemLoyaltyReward = useCallback((customerId, rewardId) => {
    const reward = state.loyaltyProgram?.rewards?.find((r) => r.id === rewardId);
    const customer = state.customers.find((c) => c.id === customerId);
    if (!reward || !customer || (customer.loyaltyPoints || 0) < reward.pointsCost) return false;
    update((s) => ({
      ...s,
      customers: s.customers.map((c) => c.id === customerId
        ? { ...c, loyaltyPoints: c.loyaltyPoints - reward.pointsCost } : c),
    }));
    addActivity('customer', `${customer.name} — ${reward.name} istifadə etdi`);
    return true;
  }, [state.loyaltyProgram, state.customers, update, addActivity]);

  const setUserRole = useCallback((role) => {
    update((s) => ({ ...s, user: { ...s.user, role } }));
  }, [update]);

  const {
    tables, reservations, waitlist, customers, staff, menuItems,
    notifications, activities, restaurant, floors,
    events, eventPackages, smsLogs, automations,
    loyaltyProgram, campaigns, incidents, feedbacks, branches, closedBills, user, serverTips,
  } = state;

  const todayReservations = useMemo(() => reservations.filter(
    (r) => new Date(r.date).toDateString() === new Date().toDateString()
      && r.status !== RESERVATION_STATUS.CANCELLED && r.status !== RESERVATION_STATUS.NO_SHOW,
  ), [reservations]);

  const upcomingEvents = useMemo(() => events.filter(
    (e) => e.status !== EVENT_STATUS.CANCELLED && e.status !== EVENT_STATUS.COMPLETED
      && new Date(e.date) >= new Date(new Date().toDateString()),
  ), [events]);

  const occupiedTables = tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED).length;
  const occupancyRate = tables.length ? Math.round((occupiedTables / tables.length) * 100) : 0;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const dashboardStats = useMemo(() => ({
    ...mockAnalytics.stats,
    todayReservations: todayReservations.length,
    occupancyRate,
    waitlistCount: waitlist.length,
    totalTables: tables.length,
    availableTables: tables.filter((t) => t.status === TABLE_STATUS.AVAILABLE).length,
    upcomingEvents: upcomingEvents.length,
  }), [todayReservations.length, occupancyRate, waitlist.length, tables, upcomingEvents.length]);

  const analytics = useMemo(() => ({
    ...mockAnalytics,
    stats: { ...mockAnalytics.stats, occupancyRate, todayReservations: todayReservations.length },
  }), [occupancyRate, todayReservations.length]);

  const operationsBriefing = useMemo(() => computeOperationsBriefing({
    reservations, events, customers, tables, staff, floors, restaurant, waitlist, menuItems,
  }), [reservations, events, customers, tables, staff, floors, restaurant, waitlist, menuItems]);

  const dailyClose = useMemo(() => computeDailyClose({
    reservations, events, tables, customers, menuItems, waitlist, operationsBriefing,
  }), [reservations, events, tables, customers, menuItems, waitlist, operationsBriefing]);

  const prepList = useMemo(() => computePrepList({ reservations, events, menuItems }), [reservations, events, menuItems]);
  const turnQueue = useMemo(() => computeTurnQueue(tables, restaurant), [tables, restaurant]);
  const sourceAnalytics = useMemo(() => computeSourceAnalytics(reservations), [reservations]);

  const getFloorStats = useCallback((floorId) => {
    const ft = tables.filter((t) => t.floorId === floorId);
    const occ = ft.filter((t) => t.status === TABLE_STATUS.OCCUPIED).length;
    return {
      total: ft.length, occupied: occ,
      available: ft.filter((t) => t.status === TABLE_STATUS.AVAILABLE).length,
      reserved: ft.filter((t) => t.status === TABLE_STATUS.RESERVED).length,
      rate: ft.length ? Math.round((occ / ft.length) * 100) : 0,
    };
  }, [tables]);

  const getSlots = useCallback((date, partySize, floorId, zone) =>
    getAvailableSlots(tables, reservations, date, partySize, floorId, zone, restaurant?.settings),
  [tables, reservations, restaurant?.settings]);

  const getCustomerForPhone = useCallback((phone) => findCustomerByPhone(customers, phone), [customers]);

  const value = {
    floors, tables, reservations, waitlist, customers, staff, menuItems,
    notifications, activities, restaurant, events, eventPackages, smsLogs, automations,
    loyaltyProgram, campaigns, incidents, feedbacks, branches, closedBills, user, serverTips,
    todayReservations, upcomingEvents, occupancyRate, unreadCount, dashboardStats, analytics,
    operationsBriefing, dailyClose, prepList, turnQueue, sourceAnalytics,
    loading: false,
    getFloorStats, getAvailableSlots: getSlots, getCustomerForPhone,
    createReservation, createQrReservation, updateReservation, deleteReservation,
    checkInReservation, cancelReservation, markNoShow, sendReservationReminder,
    createEvent, updateEvent, deleteEvent, toggleEventChecklist, confirmEventDeposit, convertEventToReservation,
    addToWaitlist, removeFromWaitlist, seatFromWaitlist, createWalkIn,
    createTable, updateTable, deleteTable, saveTableLayout, mergeTables, unmergeTable,
    assignServerToTable, advanceServicePhase, clearTable,
    addTableOrder, removeTableOrder, updateTableOrderStatus, closeTableBill,
    createCustomer, updateCustomer, deleteCustomer,
    createStaff, updateStaff, deleteStaff,
    createMenuItem, updateMenuItem, deleteMenuItem,
    createIncident, resolveIncident, addFeedback, runCampaign, redeemLoyaltyReward,
    markNotificationRead, markAllNotificationsRead, sendSms,
    setRestaurant, setUserRole, resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
