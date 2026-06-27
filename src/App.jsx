import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { AppProvider } from './context/AppContext';
import AppInitializer from './components/auth/AppInitializer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Waitlist from './pages/Waitlist';
import FloorPlan from './pages/FloorPlan';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Customers from './pages/Customers';
import Staff from './pages/Staff';
import Menu from './pages/Menu';
import Operations from './pages/Operations';
import Hostess from './pages/Hostess';
import DailyClose from './pages/DailyClose';
import Kitchen from './pages/Kitchen';
import Communications from './pages/Communications';
import Events from './pages/Events';
import Billing from './pages/Billing';
import PrepList from './pages/PrepList';
import Loyalty from './pages/Loyalty';
import Incidents from './pages/Incidents';
import TableMenu from './pages/TableMenu';
import QrBooking from './pages/QrBooking';

function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <AppInitializer>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff', color: '#0F172A', padding: '14px 18px',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px', fontWeight: '500',
                },
                success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book/:qrCode" element={<QrBooking />} />
              <Route path="/table/:tableId" element={<TableMenu />} />

              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                  <Route path="reservations" element={<Reservations />} />
                  <Route path="events" element={<Events />} />
                  <Route path="waitlist" element={<Waitlist />} />
                <Route path="floor-plan" element={<FloorPlan />} />
                <Route path="customers" element={<Customers />} />
                <Route path="menu" element={<Menu />} />
                <Route path="staff" element={<Staff />} />
                <Route path="hostess" element={<Hostess />} />
                <Route path="daily-close" element={<DailyClose />} />
                <Route path="operations" element={<Operations />} />
                <Route path="billing" element={<Billing />} />
                <Route path="prep" element={<PrepList />} />
                <Route path="loyalty" element={<Loyalty />} />
                <Route path="incidents" element={<Incidents />} />
                <Route path="kitchen" element={<Kitchen />} />
                <Route path="communications" element={<Communications />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ai-hub" element={<Navigate to="/operations" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AppInitializer>
      </AppProvider>
    </Provider>
  );
}

export default App;
