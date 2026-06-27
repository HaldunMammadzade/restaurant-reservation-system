import React, { useMemo, useState } from 'react';
import {
  Clock, UserCheck, Phone, Star, Users, Bell, UserPlus,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useApp } from '../context/AppContext';
import { RESERVATION_STATUS } from '../utils/constants';
import { calcNoShowRisk } from '../utils/operationsEngine';
import toast from 'react-hot-toast';

const parseTimeToday = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const minutesUntil = (timeStr) => {
  const target = parseTimeToday(timeStr);
  return Math.round((target - Date.now()) / 60000);
};

const Hostess = () => {
  const {
    todayReservations, waitlist, floors, checkInReservation,
    sendReservationReminder, seatFromWaitlist, getCustomerForPhone, tables,
    createWalkIn,
  } = useApp();

  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkIn, setWalkIn] = useState({ customerName: '', customerPhone: '', partySize: 2, floorId: '', zone: '' });

  const arrivals = useMemo(() =>
    todayReservations
      .filter((r) => [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.PENDING].includes(r.status))
      .map((r) => {
        const mins = minutesUntil(r.time);
        const cust = getCustomerForPhone(r.customerPhone);
        const risk = calcNoShowRisk(cust, r);
        const floor = floors.find((f) => f.id === r.floorId);
        return { ...r, mins, cust, risk, floor, overdue: mins < -15 };
      })
      .sort((a, b) => a.mins - b.mins),
  [todayReservations, floors, getCustomerForPhone]);

  const nextHour = arrivals.filter((r) => r.mins >= -15 && r.mins <= 120);
  const late = arrivals.filter((r) => r.overdue);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Qəbul Masası"
        subtitle="Gələn qonaqlar, gecikənlər və gözləmə — hostess üçün canlı panel"
        badge={`${nextHour.length} yaxınlaşır`}
        action={
          <Button variant="primary" icon={<UserPlus size={16} />} onClick={() => setWalkInOpen(true)}>
            Walk-in
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Bu gün cəmi', value: todayReservations.length, icon: Users },
          { label: 'Növbəti 2 saat', value: nextHour.length, icon: Clock },
          { label: 'Gecikən', value: late.length, icon: Bell, alert: late.length > 0 },
          { label: 'Gözləmə', value: waitlist.length, icon: Users },
        ].map((s) => (
          <div key={s.label} className={`card-premium ${s.alert ? 'ring-2 ring-rose-200' : ''}`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card title="Gələn qonaqlar" subtitle="Növbəti 2 saat" className="xl:col-span-2" premium>
          <div className="space-y-2">
            {nextHour.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Yaxın saatlarda gəliş yoxdur</p>
            ) : nextHour.map((r) => (
              <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border ${r.mins < 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-14 text-center flex-shrink-0 ${r.mins < 0 ? 'text-amber-700' : 'text-primary-600'}`}>
                  <p className="text-lg font-bold">{r.mins <= 0 ? 'İndi' : r.mins}</p>
                  <p className="text-[10px]">{r.mins <= 0 ? 'gözlənilir' : 'dəq'}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{r.customerName}</p>
                    {r.vip && <Star size={12} className="text-amber-500 fill-amber-500" />}
                    {r.risk >= 30 && <span className="text-[10px] text-rose-600 font-medium">{r.risk}% no-show</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.time} · {r.partySize} nəfər · Masa {r.tableNumber} · {r.floor?.shortName}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Phone size={10} />{r.customerPhone}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <Button size="small" variant="primary" icon={<UserCheck size={14} />}
                    onClick={() => { checkInReservation(r.id); toast.success(`${r.customerName} check-in`); }}>
                    Check-in
                  </Button>
                  <button onClick={() => { sendReservationReminder(r.id); toast.success('SMS göndərildi'); }}
                    className="text-[10px] text-primary-600 hover:underline">SMS xatırlat</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Gözləmə siyahısı" premium>
          <div className="space-y-2">
            {waitlist.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Boş</p>
            ) : waitlist.map((w) => {
              const table = tables.find((t) => t.status === 'available' && t.capacity >= w.partySize);
              return (
                <div key={w.id} className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium">{w.customerName}</p>
                  <p className="text-xs text-slate-500">{w.partySize} nəfər · {w.waitTime} dəq gözləyir</p>
                  {table && (
                    <Button size="small" variant="outline" className="mt-2 w-full"
                      onClick={() => { seatFromWaitlist(w.id, table.id); toast.success('Oturdu'); }}>
                      Masa {table.number} — otur
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {late.length > 0 && (
        <Card title="Gecikən rezervasiyalar" premium>
          <div className="space-y-2">
            {late.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div>
                  <p className="font-medium text-rose-900">{r.customerName} · {r.time}</p>
                  <p className="text-xs text-rose-700">{Math.abs(r.mins)} dəq gecikir · Masa {r.tableNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="small" variant="primary" onClick={() => { checkInReservation(r.id); toast.success('Check-in'); }}>Gəldi</Button>
                  <Button size="small" variant="outline" onClick={() => { sendReservationReminder(r.id); toast.success('SMS'); }}>Zəng/SMS</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Modal isOpen={walkInOpen} onClose={() => setWalkInOpen(false)} title="Walk-in Qonaq" size="small">
        <form onSubmit={(e) => {
          e.preventDefault();
          const table = createWalkIn(walkIn);
          if (table) {
            toast.success(`${walkIn.customerName} — Masa ${table.number}`);
            setWalkInOpen(false);
            setWalkIn({ customerName: '', customerPhone: '', partySize: 2, floorId: '', zone: '' });
          } else toast.error('Uyğun boş masa yoxdur');
        }} className="space-y-3">
          <Input label="Ad Soyad" value={walkIn.customerName} onChange={(e) => setWalkIn({ ...walkIn, customerName: e.target.value })} required />
          <Input label="Telefon" value={walkIn.customerPhone} onChange={(e) => setWalkIn({ ...walkIn, customerPhone: e.target.value })} />
          <Input label="Nəfər sayı" type="number" min={1} max={12} value={walkIn.partySize} onChange={(e) => setWalkIn({ ...walkIn, partySize: parseInt(e.target.value, 10) })} required />
          <Select label="Mərtəbə" value={walkIn.floorId} onChange={(e) => setWalkIn({ ...walkIn, floorId: e.target.value })}
            options={[{ value: '', label: 'Avtomatik' }, ...floors.map((f) => ({ value: f.id, label: f.name }))]} />
          <Select label="Zona" value={walkIn.zone} onChange={(e) => setWalkIn({ ...walkIn, zone: e.target.value })}
            options={[{ value: '', label: 'Avtomatik' }, ...[...new Set(tables.map((t) => t.zone))].map((z) => ({ value: z, label: z }))]} />
          <Button type="submit" variant="primary" fullWidth>Otur</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Hostess;
