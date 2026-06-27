import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, LayoutGrid, List, GanttChart } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import ReservationCard from '../components/reservations/ReservationCard';
import ReservationModal from '../components/reservations/ReservationModal';
import ReservationTimeline from '../components/reservations/ReservationTimeline';
import GuestProfileModal from '../components/reservations/GuestProfileModal';
import { useApp } from '../context/AppContext';
import { RESERVATION_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

const Reservations = () => {
  const {
    reservations, tables, floors,
    createReservation, updateReservation, deleteReservation,
    checkInReservation, cancelReservation, markNoShow, sendReservationReminder,
    getAvailableSlots, getCustomerForPhone,
  } = useApp();

  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [profileReservation, setProfileReservation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '', status: 'all', date: new Date().toISOString().split('T')[0], occasion: 'all',
  });

  useEffect(() => {
    let filtered = [...reservations];
    if (filters.search) {
      filtered = filtered.filter((r) =>
        r.customerName.toLowerCase().includes(filters.search.toLowerCase())
        || r.customerPhone.includes(filters.search)
        || r.id.includes(filters.search),
      );
    }
    if (filters.status !== 'all') filtered = filtered.filter((r) => r.status === filters.status);
    if (filters.occasion !== 'all') filtered = filtered.filter((r) => r.occasionType === filters.occasion);
    if (filters.date) {
      filtered = filtered.filter((r) => new Date(r.date).toDateString() === new Date(filters.date).toDateString());
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

  const handleViewProfile = (reservation) => setProfileReservation(reservation);

  const stats = [
    { label: 'Cəmi', count: reservations.length, bg: 'bg-blue-100 text-blue-700' },
    { label: 'Filtrlənmiş', count: filteredReservations.length, bg: 'bg-emerald-100 text-emerald-700' },
    { label: 'Təsdiqlənib', count: reservations.filter((r) => r.status === RESERVATION_STATUS.CONFIRMED).length, bg: 'bg-violet-100 text-violet-700' },
    { label: 'Tədbir', count: reservations.filter((r) => r.occasionType && r.occasionType !== 'standard').length, bg: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rezervasiyalar"
        subtitle="Standart rezervasiyalar, ad günləri, nişan və korporativ — hamısı bir yerdə"
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelectedReservation(null); setIsModalOpen(true); }}>
            Yeni Rezervasiya
          </Button>
        }
      />

      <Card premium delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <Input name="search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Ad, telefon və ya kod..." icon={<Search size={16} />} />
          </div>
          <Select name="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} options={[
            { value: 'all', label: 'Bütün Statuslar' },
            { value: RESERVATION_STATUS.PENDING, label: 'Gözləyir' },
            { value: RESERVATION_STATUS.CONFIRMED, label: 'Təsdiqlənib' },
            { value: RESERVATION_STATUS.CHECKED_IN, label: 'Gəlib' },
            { value: RESERVATION_STATUS.COMPLETED, label: 'Tamamlanıb' },
            { value: RESERVATION_STATUS.CANCELLED, label: 'Ləğv edilib' },
            { value: RESERVATION_STATUS.NO_SHOW, label: 'Gəlməyib' },
          ]} />
          <Select name="occasion" value={filters.occasion} onChange={(e) => setFilters({ ...filters, occasion: e.target.value })} options={[
            { value: 'all', label: 'Bütün növlər' },
            { value: 'birthday', label: '🎂 Ad günü' },
            { value: 'engagement', label: '💍 Nişan' },
            { value: 'wedding', label: '👰 Toy' },
            { value: 'corporate', label: '🏢 Korporativ' },
            { value: 'private_dining', label: '👑 Private' },
          ]} />
          <Input name="date" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} icon={<CalendarIcon size={16} />} />
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card-premium flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <span className="text-sm font-bold">{stat.count}</span>
            </div>
            <div><p className="text-xs text-slate-500">{stat.label}</p><p className="text-sm font-bold text-slate-800">Rezervasiya</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        {[
          { mode: 'grid', icon: LayoutGrid },
          { mode: 'list', icon: List },
          { mode: 'timeline', icon: GanttChart },
        ].map(({ mode, icon: Icon }) => (
          <button key={mode} onClick={() => setViewMode(mode)} className={`p-2 rounded-xl transition-colors ${viewMode === mode ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:bg-slate-100'}`}>
            <Icon size={18} />
          </button>
        ))}
      </div>

      {viewMode === 'timeline' ? (
        <ReservationTimeline
          reservations={reservations}
          tables={tables}
          floors={floors}
          date={filters.date}
          onSelect={(r) => handleViewProfile(r)}
        />
      ) : filteredReservations.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredReservations.map((reservation, i) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onEdit={(r) => { setSelectedReservation(r); setIsModalOpen(true); }}
              onDelete={deleteReservation}
              onCheckIn={checkInReservation}
              onCancel={cancelReservation}
              onViewProfile={handleViewProfile}
              onSendReminder={(id) => { sendReservationReminder(id); toast.success('SMS xatırlatma göndərildi'); }}
              onMarkNoShow={(id) => { markNoShow(id); toast.success('No-show qeyd edildi'); }}
              delay={i * 0.03}
            />
          ))}
        </div>
      ) : (
        <Card premium>
          <EmptyState title="Rezervasiya tapılmadı" description="Seçilmiş filtrlərə uyğun rezervasiya yoxdur"
            action={<Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Yeni Rezervasiya</Button>} />
        </Card>
      )}

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedReservation(null); }}
        onSubmit={selectedReservation ? handleUpdateReservation : handleCreateReservation}
        reservation={selectedReservation}
        tables={tables}
        floors={floors}
        reservations={reservations}
        getAvailableSlots={getAvailableSlots}
      />

      <AnimatePresence>
        {profileReservation && (
          <GuestProfileModal
            customer={getCustomerForPhone(profileReservation.customerPhone)}
            reservation={profileReservation}
            onClose={() => setProfileReservation(null)}
            onCheckIn={checkInReservation}
            onSendSms={(id) => { sendReservationReminder(id); toast.success('SMS göndərildi'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reservations;
