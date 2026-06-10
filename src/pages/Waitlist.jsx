import React, { useState } from 'react';
import { Plus, Clock, Users, Phone, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Waitlist = () => {
  const { waitlist, tables, addToWaitlist, removeFromWaitlist, seatFromWaitlist } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seatModal, setSeatModal] = useState(null);
  const [formData, setFormData] = useState({ customerName: '', customerPhone: '', partySize: 2 });

  const availableTables = tables.filter(t => t.status === 'available');

  const handleAdd = (e) => {
    e.preventDefault();
    addToWaitlist(formData);
    setFormData({ customerName: '', customerPhone: '', partySize: 2 });
    setIsModalOpen(false);
    toast.success('Gözləmə siyahısına əlavə edildi!');
  };

  const handleSeat = (tableId) => {
    if (seatModal) {
      seatFromWaitlist(seatModal.id, tableId);
      setSeatModal(null);
      toast.success('Müştəri oturdu!');
    }
  };

  const priorityColors = {
    high: 'bg-rose-50 text-rose-700 ring-rose-200',
    normal: 'bg-slate-50 text-slate-600 ring-slate-200',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gözləmə Siyahısı"
        subtitle="Boş masa gözləyən müştəriləri idarə edin"
        badge={`${waitlist.length} nəfər`}
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Əlavə et
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Gözləyən', value: waitlist.length, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Orta Gözləmə', value: '12 dəq', icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Boş Masa', value: availableTables.length, icon: UserCheck, color: 'from-emerald-500 to-emerald-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium flex items-center gap-4"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-md`}>
              <stat.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {waitlist.length === 0 ? (
        <Card premium>
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Gözləmə siyahısı boşdur</h3>
            <p className="text-sm text-slate-500 mt-1">Yeni müştəri əlavə edin</p>
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)} className="mt-4">
              Müştəri əlavə et
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {waitlist.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium card-hover"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{entry.customerName}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ring-1 ${priorityColors[entry.priority]}`}>
                        {entry.priority === 'high' ? 'Prioritet' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Phone size={12} />{entry.customerPhone}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{entry.partySize} nəfər</span>
                      <span className="flex items-center gap-1"><Clock size={12} />
                        {formatDistanceToNow(new Date(entry.joinedAt), { locale: az })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    icon={<UserCheck size={16} />}
                    onClick={() => setSeatModal(entry)}
                    disabled={availableTables.length === 0}
                  >
                    Otur
                  </Button>
                  <button
                    onClick={() => { removeFromWaitlist(entry.id); toast.success('Silindi'); }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gözləmə Siyahısına Əlavə Et" size="small">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Ad Soyad" name="customerName" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
          <Input label="Telefon" name="customerPhone" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} required />
          <Input label="Nəfər sayı" name="partySize" type="number" min="1" max="12" value={formData.partySize} onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })} required />
          <Button type="submit" variant="primary" fullWidth>Əlavə et</Button>
        </form>
      </Modal>

      <Modal isOpen={!!seatModal} onClose={() => setSeatModal(null)} title="Masa Seçin" size="small">
        {availableTables.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
            <p className="text-slate-600">Boş masa yoxdur</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSeat(table.id)}
                className="p-4 bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200 rounded-xl transition-all text-center"
              >
                <p className="text-lg font-bold text-slate-800">{table.number}</p>
                <p className="text-xs text-slate-500">{table.capacity} nəfər</p>
                <p className="text-[10px] text-slate-400 mt-1">{table.zone}</p>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Waitlist;
