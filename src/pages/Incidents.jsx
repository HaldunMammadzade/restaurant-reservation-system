import React, { useState } from 'react';
import { Plus, AlertCircle, Wrench, CheckCircle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Incidents = () => {
  const { incidents, createIncident, resolveIncident } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: 'complaint', customerName: '', tableNumber: '', description: '', severity: 'medium' });

  const handleSubmit = (e) => {
    e.preventDefault();
    createIncident(form);
    toast.success('Incident qeydə alındı');
    setModalOpen(false);
    setForm({ type: 'complaint', customerName: '', tableNumber: '', description: '', severity: 'medium' });
  };

  const openCount = incidents.filter((i) => i.status === 'open').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Incident & Şikayətlər" subtitle="Qonaq şikayətləri, texniki problemlər, həll izləmə"
        badge={`${openCount} açıq`}
        action={<Button variant="primary" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Yeni qeyd</Button>} />

      <div className="space-y-3">
        {incidents.map((inc) => (
          <Card key={inc.id} premium className={inc.status === 'open' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-emerald-400'}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {inc.type === 'maintenance' ? <Wrench size={20} className="text-slate-500" /> : <AlertCircle size={20} className="text-amber-500" />}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-slate-800">{inc.description}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${inc.severity === 'high' ? 'bg-rose-100 text-rose-700' : inc.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {inc.customerName !== '—' && `${inc.customerName} · `}Masa {inc.tableNumber}
                    {' · '}{formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true, locale: az })}
                  </p>
                  {inc.resolution && <p className="text-xs text-emerald-600 mt-2">Həll: {inc.resolution}</p>}
                </div>
              </div>
              {inc.status === 'open' && (
                <Button size="small" variant="outline" icon={<CheckCircle size={14} />}
                  onClick={() => { resolveIncident(inc.id, 'Həll edildi — menecer təsdiqi'); toast.success('Bağlandı'); }}>
                  Həll et
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Yeni incident" size="small">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="complaint">Şikayət</option>
            <option value="maintenance">Texniki</option>
          </select>
          <Input label="Qonaq" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <Input label="Masa" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} />
          <Input label="Təsvir" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="low">Aşağı</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksək</option>
          </select>
          <Button type="submit" variant="primary" fullWidth>Qeyd et</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Incidents;
