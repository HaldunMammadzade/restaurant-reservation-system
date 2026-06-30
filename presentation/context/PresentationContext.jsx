import React, { createContext, useContext, useState, useCallback } from 'react';

const PresentationContext = createContext(null);

export const PresentationProvider = ({ children }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [compareTable, setCompareTable] = useState(null);
  const [lastReservation, setLastReservation] = useState(null);
  const [timeMode, setTimeMode] = useState('day');
  const [draft, setDraft] = useState({
    customerName: '',
    customerPhone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    notes: '',
    dietary: 'none',
  });

  const selectTable = useCallback((table) => {
    setSelectedTable(table);
    setCompareTable(null);
  }, []);

  const setCompare = useCallback((table) => {
    setCompareTable(table);
  }, []);

  const updateDraft = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetFlow = useCallback(() => {
    setSelectedTable(null);
    setCompareTable(null);
    setLastReservation(null);
  }, []);

  const toggleTimeMode = useCallback(() => {
    setTimeMode((m) => (m === 'day' ? 'evening' : 'day'));
  }, []);

  return (
    <PresentationContext.Provider value={{
      selectedTable, compareTable, lastReservation, draft, timeMode,
      selectTable, setCompare, setLastReservation, updateDraft, resetFlow,
      setTimeMode, toggleTimeMode,
    }}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error('usePresentation within PresentationProvider');
  return ctx;
};
