import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, MapPin } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { useApp } from '../context/AppContext';
import { OCCASION_TYPES, OCCASION_LABELS, DIETARY_OPTIONS, DIETARY_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';

const QrBooking = () => {
  const { qrCode } = useParams();
  const { restaurant, floors, createQrReservation, getAvailableSlots } = useApp();
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', date: new Date().toISOString().split('T')[0],
    time: '19:00', partySize: 2, notes: '', floorId: '', zone: '',
    occasionType: OCCASION_TYPES.STANDARD, dietary: DIETARY_OPTIONS.NONE,
  });

  const slots = useMemo(() =>
    getAvailableSlots(form.date, form.partySize, form.floorId || undefined, form.zone || undefined),
  [form.date, form.partySize, form.floorId, form.zone, getAvailableSlots]);

  const selectedSlot = slots.find((s) => s.time === form.time);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot?.availableCount) {
      toast.error('Bu vaxt üçün boş masa yoxdur');
      return;
    }
    const res = createQrReservation({
      ...form,
      date: new Date(form.date).toISOString(),
    });
    if (res) {
      setSubmitted(res);
      toast.success('Rezervasiya sorğunuz qəbul edildi!');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Rezervasiya Qəbul Edildi!</h1>
          <p className="text-slate-500 mb-2">{submitted.customerName}, {form.date} · {submitted.time}</p>
          <p className="text-sm text-emerald-600 font-semibold">Masa {submitted.tableNumber} · SMS təsdiq göndərildi</p>
          <p className="text-xs text-slate-400 mt-4">Kod: {qrCode} · #{submitted.id.slice(-8)}</p>
        </motion.div>
      </div>
    );
  }

  const rName = restaurant?.name || 'Restoran';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto p-6 pt-12">
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">{rName}</h1>
          <p className="text-slate-500 text-sm mt-1">Online rezervasiya</p>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl shadow-premium-xl p-8 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Masa Rezervasiya Et</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Ad Soyad" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            <Input label="Telefon" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="+994501234567" required />

            <select value={form.occasionType} onChange={(e) => setForm({ ...form, occasionType: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {Object.entries(OCCASION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Tarix" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Saat</label>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required>
                  {slots.length === 0 ? <option value="">Boş slot yoxdur</option> : slots.map((s) => (
                    <option key={s.time} value={s.time}>{s.time} — {s.availableCount} masa boş</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedSlot && (
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <MapPin size={14} />{selectedSlot.availableCount} masa mövcuddur · avtomatik təyin ediləcək
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input label="Nəfər sayı" type="number" min="1" max="12" value={form.partySize} onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value, 10) })} required />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mərtəbə (istəyə görə)</label>
                <select value={form.floorId} onChange={(e) => setForm({ ...form, floorId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Hər hansı</option>
                  {floors.map((f) => <option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}
                </select>
              </div>
            </div>

            <select value={form.dietary} onChange={(e) => setForm({ ...form, dietary: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {Object.entries(DIETARY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>

            <Input label="Xüsusi istək" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Pəncərə, tort, allergiya..." />
            <Button type="submit" variant="primary" fullWidth icon={<Calendar size={18} />}>Rezervasiya Et</Button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">Rezervasiya sorğunuz hostess panelinə düşəcək · SMS təsdiq</p>
        </motion.div>
      </div>
    </div>
  );
};

export default QrBooking;
