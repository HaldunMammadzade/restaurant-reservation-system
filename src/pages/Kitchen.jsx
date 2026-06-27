import React, { useMemo, useState } from 'react';
import { Clock, UtensilsCrossed, AlertTriangle, ArrowRight, Plus, Check, X } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';
import { SERVICE_PHASE_LABELS, SERVICE_PHASE_COLORS, DIETARY_LABELS } from '../utils/constants';
import { TABLE_STATUS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const Kitchen = () => {
  const {
    tables, reservations, floors, menuItems, advanceServicePhase, staff,
    addTableOrder, removeTableOrder, updateTableOrderStatus,
  } = useApp();
  const [orderTableId, setOrderTableId] = useState(null);

  const activeTables = useMemo(() =>
    tables
      .filter((t) => t.status === TABLE_STATUS.OCCUPIED)
      .map((t) => {
        const res = reservations.find((r) => r.tableId === t.id && r.status === 'checked_in');
        const mins = t.seatedAt ? Math.floor((Date.now() - t.seatedAt) / 60000) : 0;
        const server = staff.find((s) => s.id === t.serverId);
        const floor = floors.find((f) => f.id === t.floorId);
        const bill = (t.orders || []).reduce((s, o) => s + o.price * o.qty, 0);
        return { ...t, res, mins, server, floor, urgent: mins > 75, bill };
      })
      .sort((a, b) => b.mins - a.mins),
  [tables, reservations, staff, floors]);

  const kitchenQueue = useMemo(() => {
    const items = [];
    activeTables.forEach((t) => {
      (t.orders || []).filter((o) => o.status === 'kitchen').forEach((o) => {
        items.push({ ...o, tableNumber: t.number, tableId: t.id });
      });
    });
    return items;
  }, [activeTables]);

  const byPhase = useMemo(() => {
    const groups = {};
    Object.keys(SERVICE_PHASE_LABELS).forEach((k) => { groups[k] = []; });
    activeTables.forEach((t) => {
      const phase = t.servicePhase || 'seated';
      groups[phase]?.push(t);
    });
    return groups;
  }, [activeTables]);

  const availableMenu = menuItems.filter((m) => m.available);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mətbəx / Expo"
        subtitle="Aktiv masalar, sifarişlər, allergiya və xidmət fazası"
        badge={`${kitchenQueue.length} sifariş gözləyir`}
      />

      {kitchenQueue.length > 0 && (
        <Card title="Mətbəx növbəsi" subtitle="Hazırlanmalı sifarişlər" premium>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {kitchenQueue.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{o.name} ×{o.qty}</p>
                  <p className="text-xs text-slate-500">Masa {o.tableNumber}</p>
                </div>
                <Button size="small" variant="primary" icon={<Check size={14} />}
                  onClick={() => { updateTableOrderStatus(o.tableId, o.id, 'ready'); toast.success('Hazırdır'); }}>
                  Hazır
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.entries(SERVICE_PHASE_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-lg border border-slate-200 bg-white p-3 text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: SERVICE_PHASE_COLORS[key] }} />
            <p className="text-[10px] text-slate-500">{label}</p>
            <p className="text-lg font-bold text-slate-800">{byPhase[key]?.length || 0}</p>
          </div>
        ))}
      </div>

      {activeTables.length === 0 ? (
        <Card premium><p className="text-center text-slate-500 py-10">Hazırda aktiv masa yoxdur</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {activeTables.map((t) => (
            <div key={t.id} className={`rounded-xl border bg-white p-4 ${t.urgent ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">Masa {t.number}</span>
                    {t.urgent && <AlertTriangle size={16} className="text-amber-600" />}
                  </div>
                  <p className="text-sm text-slate-600">{t.guestName} · {t.partySize} nəfər</p>
                  <p className="text-xs text-slate-400">{t.floor?.name} · {t.zone}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-md text-white" style={{ backgroundColor: SERVICE_PHASE_COLORS[t.servicePhase] || '#6366F1' }}>
                  {SERVICE_PHASE_LABELS[t.servicePhase] || 'Oturub'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Clock size={12} />{t.mins} dəq</span>
                {t.server && <span>Ofisiant: {t.server.name.split(' ')[0]}</span>}
                {t.bill > 0 && <span className="font-semibold text-emerald-700">{formatCurrency(t.bill)}</span>}
              </div>

              {(t.orders || []).length > 0 && (
                <div className="mb-3 space-y-1">
                  {t.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                      <span className={o.status === 'ready' ? 'text-emerald-700' : 'text-slate-700'}>
                        {o.name} ×{o.qty} · {formatCurrency(o.price * o.qty)}
                        {o.status === 'ready' && ' ✓'}
                      </span>
                      <button onClick={() => removeTableOrder(t.id, o.id)} className="text-rose-400 hover:text-rose-600"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}

              {t.res?.dietary && t.res.dietary !== 'none' && (
                <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-800">
                  <UtensilsCrossed size={14} />
                  {DIETARY_LABELS[t.res.dietary]}
                </div>
              )}

              {orderTableId === t.id ? (
                <div className="mb-3 p-2 border border-slate-200 rounded-xl max-h-32 overflow-y-auto space-y-1">
                  {availableMenu.slice(0, 8).map((m) => (
                    <button key={m.id} type="button" onClick={() => { addTableOrder(t.id, m); toast.success(`${m.name} əlavə edildi`); setOrderTableId(null); }}
                      className="w-full text-left text-xs px-2 py-1.5 hover:bg-primary-50 rounded-lg flex justify-between">
                      <span>{m.name}</span>
                      <span className="text-slate-400">{formatCurrency(m.price)}</span>
                    </button>
                  ))}
                  <button onClick={() => setOrderTableId(null)} className="text-xs text-slate-500 w-full text-center pt-1">Bağla</button>
                </div>
              ) : (
                <Button size="small" variant="outline" fullWidth icon={<Plus size={14} />} className="mb-2"
                  onClick={() => setOrderTableId(t.id)}>
                  Sifariş əlavə et
                </Button>
              )}

              <Button size="small" variant="secondary" fullWidth icon={<ArrowRight size={14} />}
                onClick={() => { advanceServicePhase(t.id); toast.success(`Masa ${t.number} — növbəti fazaya`); }}>
                Növbəti mərhələ
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
