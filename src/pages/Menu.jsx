import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit, Flame, Clock, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import MenuItemImage from '../components/menu/MenuItemImage';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { MENU_CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const categoryColors = {
  appetizer: 'from-amber-500 to-orange-500',
  main: 'from-rose-500 to-red-500',
  dessert: 'from-pink-500 to-rose-500',
  drink: 'from-cyan-500 to-blue-500',
  special: 'from-indigo-500 to-indigo-600',
};

const emptyForm = {
  name: '', description: '', price: '', category: 'main',
  prepTime: '', isPopular: false, available: true, image: '',
};

const Menu = () => {
  const { menuItems, createMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef(null);

  const unavailable = menuItems.filter((i) => !i.available);
  const filtered = (activeCategory === 'all' ? menuItems : menuItems.filter((i) => i.category === activeCategory))
    .filter((i) => showUnavailable || i.available);

  const toggleAvailability = (item) => {
    updateMenuItem(item.id, { available: !item.available });
    toast.success(item.available ? '86 — menyu xaric edildi' : 'Yenidən aktiv edildi');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Şəkil 2MB-dan kiçik olmalıdır');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = { ...form, price: parseFloat(form.price) };
    if (selected) {
      updateMenuItem(selected.id, input);
      toast.success('Məhsul yeniləndi');
    } else {
      createMenuItem(input);
      toast.success('Məhsul əlavə edildi');
    }
    setModalOpen(false);
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
      prepTime: item.prepTime || '',
      isPopular: item.isPopular || false,
      available: item.available !== false,
      image: item.image || '',
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Menyu" subtitle="Məhsullar, qiymətlər və 86 (bitmiş) idarəetməsi" badge={`${menuItems.length} məhsul`}
        action={<Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelected(null); setForm(emptyForm); setModalOpen(true); }}>Məhsul əlavə et</Button>} />

      {unavailable.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-rose-800">{unavailable.length} məhsul 86 (bitib)</p>
            <p className="text-xs text-rose-600 mt-0.5">{unavailable.map((i) => i.name).slice(0, 4).join(', ')}{unavailable.length > 4 ? '...' : ''}</p>
          </div>
          <button onClick={() => setShowUnavailable(!showUnavailable)} className="text-xs font-medium text-rose-700 underline">
            {showUnavailable ? 'Gizlət' : 'Hamısını göstər'}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Hamısı</button>
        {Object.entries(MENU_CATEGORIES).map(([key, label]) => (
          <button key={key} onClick={() => setActiveCategory(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === key ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            className={`card-premium overflow-hidden group !p-0 ${!item.available ? 'opacity-75 ring-2 ring-rose-200' : ''}`}>
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <MenuItemImage item={item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColors[item.category]}`} />
              {!item.available && (
                <span className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">86 — Bitib</span>
                </span>
              )}
              {item.isPopular && item.available && (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Flame size={10} /> Populyar
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{MENU_CATEGORIES[item.category]}</p>
                </div>
                <span className="text-lg font-bold text-primary-600">{formatCurrency(Number(item.price))}</span>
              </div>
              {item.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.description}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {item.prepTime && <><Clock size={12} />{item.prepTime}</>}
                  <span className={`px-2 py-0.5 rounded-full ${item.available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {item.available ? 'Mövcud' : 'Bitib'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => toggleAvailability(item)} title={item.available ? '86 et' : 'Aktiv et'}
                    className={`p-1.5 rounded-lg text-xs font-bold ${item.available ? 'hover:bg-rose-50 text-rose-600' : 'hover:bg-emerald-50 text-emerald-600'}`}>
                    {item.available ? '86' : '✓'}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"><Edit size={14} /></button>
                  <button onClick={() => { deleteMenuItem(item.id); toast.success('Silindi'); }} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Məhsul Redaktə' : 'Yeni Məhsul'} size="small">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative h-36 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-400 cursor-pointer overflow-hidden bg-slate-50 flex flex-col items-center justify-center transition-colors"
          >
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-medium">Şəkil yüklə (JPG, PNG — max 2MB)</span>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
          <Input label="Ad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Təsvir" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Qiymət (AZN)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {Object.entries(MENU_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Input label="Hazırlanma vaxtı" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="20 dəq" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} /><span className="text-sm">Populyar</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /><span className="text-sm">Mövcuddur</span></label>
          <Button type="submit" variant="primary" fullWidth>{selected ? 'Yenilə' : 'Əlavə et'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Menu;
