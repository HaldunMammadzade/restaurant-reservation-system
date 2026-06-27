import React, { useState } from 'react';
import { Plus, Trash2, Edit, UserCheck, Coffee, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { STAFF_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  off_duty: 'bg-slate-100 text-slate-600 ring-slate-200',
  on_break: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const Staff = () => {
  const { staff, floors, createStaff, updateStaff, deleteStaff } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', phone: '', email: '', shift: '', floorId: 'floor_g', status: 'active' });

  const activeCount = staff.filter((s) => s.status === 'active').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected) {
      updateStaff(selected.id, form);
      toast.success('Yeniləndi');
    } else {
      createStaff(form);
      toast.success('İşçi əlavə edildi');
    }
    setModalOpen(false);
  };

  const toggleStatus = (member) => {
    const next = member.status === 'active' ? 'on_break' : 'active';
    updateStaff(member.id, { status: next });
    toast.success(STAFF_STATUS[next]);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Personal İdarəetməsi" subtitle="Mərtəbə üzrə ofisiant və hostess planlaması" badge={`${activeCount} aktiv`}
        action={<Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelected(null); setForm({ name: '', role: '', phone: '', email: '', shift: '', floorId: 'floor_g', status: 'active' }); setModalOpen(true); }}>İşçi Əlavə Et</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Cəmi İşçi', value: staff.length, icon: UserCheck, color: 'from-blue-500 to-blue-600' },
          { label: 'Aktiv', value: activeCount, icon: Coffee, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Fasilədə', value: staff.filter((s) => s.status === 'on_break').length, icon: Clock, color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-premium flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center shadow-md`}>
              <s.icon size={22} className="text-white" />
            </div>
            <div><p className="text-sm text-slate-500">{s.label}</p><p className="text-2xl font-bold text-slate-900">{s.value}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member, i) => {
          const floor = floors.find((f) => f.id === member.floorId);
          return (
            <motion.div key={member.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card-premium card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.role}</p>
                    {floor && <p className="text-[10px] text-primary-600 font-semibold">{floor.icon} {floor.name}</p>}
                  </div>
                </div>
                <button onClick={() => toggleStatus(member)} className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ring-1 cursor-pointer ${statusColors[member.status]}`}>
                  {STAFF_STATUS[member.status]}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{member.shift || 'Növbə təyin edilməyib'}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setSelected(member); setForm({ name: member.name, role: member.role, phone: member.phone || '', email: member.email || '', shift: member.shift || '', floorId: member.floorId || 'floor_g', status: member.status }); setModalOpen(true); }} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"><Edit size={14} /></button>
                  <button onClick={() => { deleteStaff(member.id); toast.success('Silindi'); }} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'İşçi Redaktə' : 'Yeni İşçi'} size="small">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Vəzifə" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Növbə" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} placeholder="10:00 - 22:00" />
          <select value={form.floorId} onChange={(e) => setForm({ ...form, floorId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {floors.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {Object.entries(STAFF_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Button type="submit" variant="primary" fullWidth>{selected ? 'Yenilə' : 'Əlavə et'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;
