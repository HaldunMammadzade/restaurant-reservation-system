import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Eye, ChevronRight, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import GuestShell from '../components/GuestShell';
import InteractiveFloorMap from '../components/InteractiveFloorMap';
import { salonZones } from '../data/salonZones';
import { useApp } from '../../src/context/AppContext';
import { usePresentation } from '../context/PresentationContext';
import { DIETARY_OPTIONS, DIETARY_LABELS, TIME_SLOTS } from '../../src/utils/constants';
import { getTableView } from '../data/tableViews';
import { formatTableName } from '../utils/formatTable';

const ReservePage = () => {
  const navigate = useNavigate();
  const { tables, createQrReservation, getAvailableSlots } = useApp();
  const { selectedTable, selectTable, draft, updateDraft, setLastReservation, timeMode } = usePresentation();
  const [step, setStep] = useState(selectedTable ? 2 : 1);
  const [floorId, setFloorId] = useState(selectedTable?.floorId || 'floor_1');

  const slots = useMemo(() =>
    getAvailableSlots(draft.date, draft.partySize, floorId),
  [draft.date, draft.partySize, floorId, getAvailableSlots]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTable) {
      toast.error('Masa seçin');
      return;
    }
    const res = createQrReservation({
      ...draft,
      tableId: selectedTable.id,
      floorId: selectedTable.floorId,
      zone: selectedTable.zone,
      date: new Date(draft.date).toISOString(),
      partySize: parseInt(draft.partySize, 10),
    });
    if (res) {
      setLastReservation(res);
      toast.success('Rezervasiya qəbul edildi!');
      navigate('/teqdimat/confirm');
    } else {
      toast.error('Bu vaxt üçün masa mövcud deyil');
    }
  };

  const view = selectedTable ? getTableView(selectedTable) : null;
  const viewImg = view ? (timeMode === 'evening' ? view.evening : view.day) : null;

  return (
    <GuestShell showBack backTo="/teqdimat">
      <div className="px-4 py-6 pres-safe-bottom space-y-5">
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-wider">Addım {step}/2</p>
          <h1 className="text-2xl font-bold text-white mt-1">Masa rezerv et</h1>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <button
              type="button"
              onClick={() => navigate(`/teqdimat/3d/${floorId}`)}
              className="w-full rounded-3xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-800" />
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center pres-pulse-ring">
                  <Box size={28} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Premium seçim</p>
                  <p className="text-lg font-bold text-white">3D Salon + Seat View</p>
                  <p className="text-xs text-white/70">Masaya toxun → görünüşünüzü görün</p>
                </div>
                <ChevronRight className="text-white" />
              </div>
            </button>

            <p className="text-center text-[10px] text-white/40">və ya 2D plandan seçin</p>

            <div className="flex gap-2 overflow-x-auto pres-no-scrollbar pb-1">
              {salonZones.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setFloorId(z.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${floorId === z.id ? 'bg-emerald-500 text-white' : 'pres-glass text-white/60'}`}
                >
                  {z.icon} {z.name}
                </button>
              ))}
            </div>
            <InteractiveFloorMap
              tables={tables}
              floorId={floorId}
              selectedId={selectedTable?.id}
              nightMode={timeMode === 'evening'}
              onSelectTable={(t) => {
                selectTable(t);
                setStep(2);
              }}
            />
            {selectedTable && (
              <button
                type="button"
                onClick={() => navigate(`/teqdimat/seat/${selectedTable.id}`)}
                className="w-full pres-glass rounded-2xl p-3 flex items-center gap-3 text-left"
              >
                <img src={viewImg} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{formatTableName(selectedTable.number)} — Seat View</p>
                  <p className="text-xs text-white/50">Görünüşə baxın</p>
                </div>
                <Eye size={18} className="text-emerald-400" />
              </button>
            )}
            <button
              type="button"
              disabled={!selectedTable}
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-bold disabled:opacity-40"
            >
              Davam et
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4">
            {selectedTable && (
              <button
                type="button"
                onClick={() => navigate(`/teqdimat/seat/${selectedTable.id}`)}
                className="w-full relative h-32 rounded-2xl overflow-hidden"
              >
                <img src={viewImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-xs text-emerald-300">Seçilmiş masa</p>
                    <p className="text-lg font-bold text-white">{formatTableName(selectedTable.number)}</p>
                    <p className="text-[10px] text-white/60">{view?.label}</p>
                  </div>
                  <span className="text-xs text-white/80 flex items-center gap-1"><Eye size={12} /> Bax</span>
                </div>
              </button>
            )}

            <div className="pres-glass rounded-2xl p-4 space-y-3">
              <label className="block">
                <span className="text-xs text-white/50 flex items-center gap-1 mb-1"><Users size={12} /> Ad Soyad</span>
                <input
                  required
                  value={draft.customerName}
                  onChange={(e) => updateDraft({ customerName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Adınız"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/50 mb-1 block">Telefon</span>
                <input
                  required
                  value={draft.customerPhone}
                  onChange={(e) => updateDraft({ customerPhone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="+994..."
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-white/50 flex items-center gap-1 mb-1"><Calendar size={12} /> Tarix</span>
                  <input
                    type="date"
                    required
                    value={draft.date}
                    onChange={(e) => updateDraft({ date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-white/50 flex items-center gap-1 mb-1"><Clock size={12} /> Vaxt</span>
                  <select
                    value={draft.time}
                    onChange={(e) => updateDraft({ time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {TIME_SLOTS.filter((t) => slots.some((s) => s.time === t && s.availableCount > 0) || t === draft.time).map((t) => (
                      <option key={t} value={t} className="bg-slate-900">{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-white/50 mb-1 block">Nəfər sayı</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={draft.partySize}
                  onChange={(e) => updateDraft({ partySize: parseInt(e.target.value, 10) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/50 mb-1 block">Dietary</span>
                <select
                  value={draft.dietary}
                  onChange={(e) => updateDraft({ dietary: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm"
                >
                  {Object.entries(DIETARY_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-slate-900">{v}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-white/50 mb-1 block">Qeyd</span>
                <textarea
                  value={draft.notes}
                  onChange={(e) => updateDraft({ notes: e.target.value })}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm resize-none"
                  placeholder="Xüsusi tələb..."
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-white/20 text-sm text-white">
                Masa dəyiş
              </button>
              <button type="submit" className="flex-[2] py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-1">
                Təsdiqlə <ChevronRight size={16} />
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </GuestShell>
  );
};

export default ReservePage;
