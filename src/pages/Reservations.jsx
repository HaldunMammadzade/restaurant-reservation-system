import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, LayoutGrid, List } from 'lucide-react';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import ReservationCard from '../components/reservations/ReservationCard';
import ReservationModal from '../components/reservations/ReservationModal';
import { useApp } from '../context/AppContext';
import { RESERVATION_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

const Reservations = () => {
  const { reservations, tables, createReservation, updateReservation, deleteReservation, checkInReservation, cancelReservation } = useApp();
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    let filtered = [...reservations];
    if (filters.search) {
      filtered = filtered.filter(r =>
        r.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.customerPhone.includes(filters.search) ||
        r.id.includes(filters.search)
      );
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.date) {
      filtered = filtered.filter(r =>
        new Date(r.date).toDateString() === new Date(filters.date).toDateString()
      );
    }
    setFilteredReservations(filtered);
  }, [filters, reservations]);

  const handleCreateReservation = (data) => {
    createReservation(data);
    setIsModalOpen(false);
    toast.success('Rezervasiya yaradıldı!');
  };

  const handleUpdateReservation = (data) => {
    updateReservation(selectedReservation.id, data);
    setIsModalOpen(false);
    setSelectedReservation(null);
    toast.success('Rezervasiya yeniləndi!');
  };

  const stats = [
    { label: 'Cəmi', count: reservations.length, color: 'from-blue-500 to-blue-600' },
    { label: 'Filtrlənmiş', count: filteredReservations.length, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Təsdiqlənib', count: reservations.filter(r => r.status === RESERVATION_STATUS.CONFIRMED).length, color: 'from-violet-500 to-purple-600' },
    { label: 'Ləğv edilib', count: reservations.filter(r => r.status === RESERVATION_STATUS.CANCELLED).length, color: 'from-rose-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rezervasiyalar"
        subtitle="Bütün rezervasiyaları idarə edin"
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelectedReservation(null); setIsModalOpen(true); }}>
            Yeni Rezervasiya
          </Button>
        }
      />

      <Card premium delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input name="search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Ad, telefon və ya kod ilə axtar..." icon={<Search size={16} />} />
          </div>
          <Select name="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} options={[
            { value: 'all', label: 'Bütün Statuslar' },
            { value: RESERVATION_STATUS.PENDING, label: 'Gözləyir' },
            { value: RESERVATION_STATUS.CONFIRMED, label: 'Təsdiqlənib' },
            { value: RESERVATION_STATUS.CHECKED_IN, label: 'Gəlib' },
            { value: RESERVATION_STATUS.COMPLETED, label: 'Tamamlanıb' },
            { value: RESERVATION_STATUS.CANCELLED, label: 'Ləğv edilib' },
          ]} />
          <Input name="date" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} icon={<CalendarIcon size={16} />} />
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card-premium flex items-center gap-3" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">{stat.count}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-sm font-bold text-slate-800">Rezervasiya</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:bg-slate-100'}`}>
          <LayoutGrid size={18} />
        </button>
        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:bg-slate-100'}`}>
          <List size={18} />
        </button>
      </div>

      {filteredReservations.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredReservations.map((reservation, i) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onEdit={(r) => { setSelectedReservation(r); setIsModalOpen(true); }}
              onDelete={deleteReservation}
              onCheckIn={checkInReservation}
              onCancel={cancelReservation}
              delay={i * 0.03}
            />
          ))}
        </div>
      ) : (
        <Card premium>
          <EmptyState
            title="Rezervasiya tapılmadı"
            description="Seçilmiş filtrlərə uyğun rezervasiya yoxdur"
            action={<Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Yeni Rezervasiya</Button>}
          />
        </Card>
      )}

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedReservation(null); }}
        onSubmit={selectedReservation ? handleUpdateReservation : handleCreateReservation}
        reservation={selectedReservation}
        tables={tables}
      />
    </div>
  );
};

export default Reservations;
