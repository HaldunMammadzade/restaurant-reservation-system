import React, { useState, useMemo } from 'react';
import {
  Plus, Trash2, Edit, CheckCircle2, Circle, Banknote, MessageSquare,
  Calendar, Users, ArrowRight, PartyPopper, MapPin, Cake, Gem, Heart, Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import OccasionIcon from '../components/events/OccasionIcon';
import { useApp } from '../context/AppContext';
import {
  OCCASION_TYPES, OCCASION_LABELS,
  EVENT_STATUS, EVENT_STATUS_LABELS,
} from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const filterOptions = [
  { id: 'all', label: 'Hamısı', icon: PartyPopper },
  { id: 'upcoming', label: 'Gələcək', icon: Calendar },
  { id: 'birthday', label: 'Ad günü', icon: Cake },
  { id: 'engagement', label: 'Nişan', icon: Gem },
  { id: 'wedding', label: 'Toy', icon: Heart },
  { id: 'corporate', label: 'Korporativ', icon: Building2 },
];

const Events = () => {
  const {
    events, eventPackages, floors, tables,
    createEvent, updateEvent, deleteEvent, toggleEventChecklist,
    confirmEventDeposit, convertEventToReservation, sendSms,
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', occasionType: OCCASION_TYPES.BIRTHDAY, customerName: '', customerPhone: '',
    date: new Date().toISOString().split('T')[0], startTime: '19:00', endTime: '23:00',
    partySize: 10, packageId: 'pkg_birthday', floorId: 'floor_v', notes: '',
  });

  const filtered = useMemo(() => {
    if (filter === 'all') return events;
    if (filter === 'upcoming') return events.filter((e) => e.status !== EVENT_STATUS.COMPLETED && e.status !== EVENT_STATUS.CANCELLED);
    return events.filter((e) => e.occasionType === filter);
  }, [events, filter]);

  const openCreate = () => {
    setSelected(null);
    setForm({
      title: '', occasionType: OCCASION_TYPES.BIRTHDAY, customerName: '', customerPhone: '',
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      startTime: '19:00', endTime: '23:00', partySize: 10, packageId: 'pkg_birthday',
      floorId: 'floor_v', notes: '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const floorTables = tables.filter((t) => t.floorId === form.floorId && t.status === 'available').slice(0, Math.ceil(form.partySize / 6));
    const input = { ...form, tableIds: floorTables.map((t) => t.id), title: form.title || `${form.customerName} — ${OCCASION_LABELS[form.occasionType]}` };
    if (selected) {
      updateEvent(selected.id, input);
      toast.success('Tədbir yeniləndi');
    } else {
      createEvent(input);
      toast.success('Tədbir yaradıldı — checklist hazırlandı');
    }
    setModalOpen(false);
  };

  const checklistProgress = (ev) => {
    const done = ev.checklist?.filter((c) => c.done).length || 0;
    return { done, total: ev.checklist?.length || 0, pct: ev.checklist?.length ? Math.round((done / ev.checklist.length) * 100) : 0 };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tədbir & Private Dining"
        subtitle="Ad günü, nişan, toy, korporativ — checklist, depozit, personal"
        badge={`${events.length} tədbir`}
        action={<Button variant="primary" icon={<Plus size={18} />} onClick={openCreate}>Yeni Tədbir</Button>}
      />

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Hazır paketlər</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {eventPackages.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-premium card-hover cursor-pointer" onClick={() => { setForm({ ...form, packageId: pkg.id, occasionType: pkg.occasionType, floorId: pkg.floorId }); openCreate(); }}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <OccasionIcon type={pkg.occasionType} size={20} />
                </div>
                <span className="text-sm font-bold text-primary-600">{formatCurrency(pkg.pricePerPerson)}/nəfər</span>
              </div>
              <h4 className="font-bold text-slate-800">{pkg.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{pkg.minGuests}–{pkg.maxGuests} nəfər · Min. {formatCurrency(pkg.minSpend)}</p>
              <ul className="mt-2 space-y-0.5">
                {pkg.includes.slice(0, 3).map((inc) => (
                  <li key={inc} className="text-[10px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-500" /> {inc}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.id ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <f.icon size={14} /> {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card premium><EmptyState title="Tədbir yoxdur" description="Yeni tədbir və ya paket seçin" action={<Button variant="primary" onClick={openCreate}>Tədbir Yarat</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((event, i) => {
            const prog = checklistProgress(event);
            const floor = floors.find((f) => f.id === event.floorId);
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card-premium card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <OccasionIcon type={event.occasionType} size={18} className="text-slate-700" />
                      </div>
                      <h3 className="font-bold text-slate-800">{event.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{event.customerName} · {event.customerPhone}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{EVENT_STATUS_LABELS[event.status]}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2"><Calendar size={12} className="text-primary-500 mb-1" />{formatDate(event.date)}</div>
                  <div className="bg-slate-50 rounded-lg p-2"><Users size={12} className="text-primary-500 mb-1" />{event.partySize} nəfər</div>
                  <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-1"><MapPin size={12} className="text-primary-500" />{floor?.shortName || '—'}</div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Checklist ({prog.done}/{prog.total})</span>
                    <span className="font-bold text-primary-600">{prog.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all" style={{ width: `${prog.pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className={event.depositPaid ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                    Depozit: {formatCurrency(event.deposit)} {event.depositPaid ? '· alınıb' : '· gözlənilir'}
                  </span>
                  <span className="text-slate-400">~{formatCurrency(event.estimatedTotal)}</span>
                </div>

                <div className="flex gap-1.5 flex-wrap border-t border-slate-100 pt-3">
                  <Button size="small" variant="outline" onClick={() => setDetailEvent(event)}>Checklist</Button>
                  {!event.depositPaid && (
                    <Button size="small" variant="secondary" icon={<Banknote size={14} />} onClick={() => { confirmEventDeposit(event.id); toast.success('Depozit qeyd edildi + SMS'); }}>
                      Depozit
                    </Button>
                  )}
                  <Button size="small" variant="primary" icon={<ArrowRight size={14} />} onClick={() => { convertEventToReservation(event.id); toast.success('Rezervasiyaya çevrildi'); }}>
                    Rezerv
                  </Button>
                  <button onClick={() => { setSelected(event); setForm({ ...event, date: event.date.split('T')[0] }); setModalOpen(true); }} className="p-2 hover:bg-primary-50 rounded-lg text-primary-600"><Edit size={14} /></button>
                  <button onClick={() => { deleteEvent(event.id); toast.success('Silindi'); }} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Tədbir Redaktə' : 'Yeni Tədbir'} size="large">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Tədbir adı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Məs: Leyla — 30 yaş ad günü" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Müştəri" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            <Input label="Telefon" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select value={form.occasionType} onChange={(e) => setForm({ ...form, occasionType: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(OCCASION_LABELS).filter(([k]) => k !== 'standard').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {eventPackages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Input label="Nəfər" type="number" value={form.partySize} onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value, 10) })} />
            <select value={form.floorId} onChange={(e) => setForm({ ...form, floorId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {floors.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Tarix" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Başlama" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input label="Bitmə" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <Input label="Qeydlər" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" variant="primary" fullWidth icon={<PartyPopper size={18} />}>{selected ? 'Yenilə' : 'Tədbir Yarat'}</Button>
        </form>
      </Modal>

      <Modal isOpen={!!detailEvent} onClose={() => setDetailEvent(null)} title="Tədbir Checklist" size="medium">
        {detailEvent && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{detailEvent.title} · {formatDate(detailEvent.date)} {detailEvent.startTime}</p>
            {detailEvent.checklist?.map((item) => (
              <button key={item.id} onClick={() => toggleEventChecklist(detailEvent.id, item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${item.done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-primary-300'}`}>
                {item.done ? <CheckCircle2 size={20} className="text-emerald-600" /> : <Circle size={20} className="text-slate-300" />}
                <span className={`text-sm font-medium ${item.done ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>{item.label}</span>
                {item.auto && <span className="ml-auto text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Sistem</span>}
              </button>
            ))}
            <Button variant="outline" fullWidth icon={<MessageSquare size={16} />} onClick={() => {
              sendSms(detailEvent.customerPhone, `${detailEvent.customerName}, "${detailEvent.title}" tədbiriniz yaxınlaşır. ${detailEvent.startTime} — gözləyirik!`, 'event');
              toggleEventChecklist(detailEvent.id, 'sms');
              toast.success('SMS göndərildi');
            }}>SMS Xatırlatma Göndər</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;
