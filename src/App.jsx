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
                  background: '#fff',
                  color: '#0F172A',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: { primary: '#10B981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#EF4444', secondary: '#fff' },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="waitlist" element={<Waitlist />} />
                <Route path="floor-plan" element={<FloorPlan />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
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
