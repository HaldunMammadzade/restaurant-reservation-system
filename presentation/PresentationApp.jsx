import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PresentationProvider } from './context/PresentationContext';
import GuestHome from './pages/GuestHome';
import ExplorePage from './pages/ExplorePage';
import ZoneDetailPage from './pages/ZoneDetailPage';
import SeatViewPage from './pages/SeatViewPage';
import ComparePage from './pages/ComparePage';
import ReservePage from './pages/ReservePage';
import ConfirmPage from './pages/ConfirmPage';
import TablePicker3DPage from './pages/TablePicker3DPage';
import './styles/presentation.css';

const PresentationApp = () => (
  <PresentationProvider>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#141a16', color: '#f5f0e8', border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: '16px', fontSize: '14px',
        },
      }}
    />
    <Routes>
      <Route index element={<GuestHome />} />
      <Route path="3d" element={<TablePicker3DPage />} />
      <Route path="3d/:floorId" element={<TablePicker3DPage />} />
      <Route path="3d/:floorId/:tableId" element={<TablePicker3DPage />} />
      <Route path="explore" element={<ExplorePage />} />
      <Route path="explore/:zoneId" element={<ZoneDetailPage />} />
      <Route path="seat/:tableId" element={<SeatViewPage />} />
      <Route path="compare" element={<ComparePage />} />
      <Route path="reserve" element={<ReservePage />} />
      <Route path="confirm" element={<ConfirmPage />} />
      <Route path="*" element={<Navigate to="/teqdimat" replace />} />
    </Routes>
  </PresentationProvider>
);

export default PresentationApp;
