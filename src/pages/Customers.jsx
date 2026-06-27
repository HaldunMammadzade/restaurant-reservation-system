import React, { useState, useMemo } from 'react';
import { Plus, Search, Star, Phone, Trash2, Edit, Award, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { getCustomerLoyalty } from '../utils/loyaltyEngine';
import toast from 'react-hot-toast';

const Customers = () => {
  const { customers, createCustomer, updateCustomer, deleteCustomer, loyaltyProgram } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '', vip: false, tags: '', blacklisted: false, specialNotes: '' });

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q),
    );
  }, [customers, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    if (selected) {
      updateCustomer(selected.id, input);
      toast.success('Müştəri yeniləndi');
    } else {
      createCustomer(input);
      toast.success('Müştəri əlavə edildi');
    }
    setModalOpen(false);
  };

  const openEdit = (c) => {
    setSelected(c);
    setForm({
      name: c.name, phone: c.phone, email: c.email || '',
      notes: c.notes || '', vip: c.vip, tags: (c.tags || []).join(', '),
      blacklisted: c.blacklisted || false, specialNotes: c.specialNotes || '',
    });
    setModalOpen(true);
  };

  const vipCount = customers.filter((c) => c.vip).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Müştəri CRM" subtitle="VIP idarəetməsi və müştəri bazası" badge={`${customers.length} müştəri · ${vipCount} VIP`}
        action={<Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelected(null); setForm({ name: '', phone: '', email: '', notes: '', vip: false, tags: '', blacklisted: false, specialNotes: '' }); setModalOpen(true); }}>Yeni Müştəri</Button>} />

      <Card premium>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ad, telefon və ya email ilə axtar..." icon={<Search size={16} />} />
      </Card>

      {filtered.length === 0 ? (
        <Card premium><EmptyState title="Müştəri tapılmadı" description="Axtarışı dəyişin və ya yeni müştəri əlavə edin" /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const loyalty = getCustomerLoyalty(c, loyaltyProgram);
            return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card-premium card-hover ${c.blacklisted ? 'ring-2 ring-rose-200' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold ${c.blacklisted ? 'bg-rose-600' : c.vip ? 'bg-amber-600' : 'bg-primary-600'}`}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{c.name}</h3>
                      {c.vip && <Star size={14} className="text-amber-500 fill-amber-500" />}
                      {c.blacklisted && <span className="flex items-center gap-0.5 text-[10px] text-rose-600 font-bold"><Ban size={10} />Qara siyahı</span>}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} />{c.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"><Edit size={16} /></button>
                  <button onClick={() => { deleteCustomer(c.id); toast.success('Silindi'); }} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-slate-400">Ziyarət</p>
                  <p className="font-bold text-slate-800">{c.visitCount}x</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-slate-400">Xərclənib</p>
                  <p className="font-bold text-slate-800">{formatCurrency(Number(c.totalSpent))}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2.5">
                  <p className="text-amber-600 flex items-center gap-0.5"><Award size={10} />{loyalty.tier?.name || 'Bronze'}</p>
                  <p className="font-bold text-slate-800">{loyalty.points} xal</p>
                </div>
              </div>
              {c.specialNotes && <p className="text-[10px] text-slate-500 mt-2 italic">{c.specialNotes}</p>}
              {c.tags?.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] bg-primary-50 text-primary-700 rounded-full">{tag}</span>)}
                </div>
              )}
            </motion.div>
          );})}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Müştəri Redaktə' : 'Yeni Müştəri'} size="small">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Etiketlər (vergüllə)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VIP, Pəncərə" />
          <Input label="Qeydlər" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Input label="Xüsusi qeydlər" value={form.specialNotes} onChange={(e) => setForm({ ...form, specialNotes: e.target.value })} placeholder="Allergiya, sevimli masa..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.vip} onChange={(e) => setForm({ ...form, vip: e.target.checked })} className="rounded" />
            <span className="text-sm font-medium text-slate-700">VIP Müştəri</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.blacklisted} onChange={(e) => setForm({ ...form, blacklisted: e.target.checked })} className="rounded" />
            <span className="text-sm font-medium text-rose-700">Qara siyahı</span>
          </label>
          <Button type="submit" variant="primary" fullWidth>{selected ? 'Yenilə' : 'Əlavə et'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
