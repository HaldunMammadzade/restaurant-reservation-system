import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { TABLE_STATUS, TABLE_SHAPES } from '../../utils/constants';

const ZONES = ['Pəncərə', 'Əsas Salon', 'VIP', 'Terras', 'Bar'];

const TablePropertiesPanel = ({ table, onUpdate, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    number: '', capacity: 4, shape: TABLE_SHAPES.SQUARE, status: TABLE_STATUS.AVAILABLE, zone: 'Əsas Salon',
  });

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number,
        capacity: table.capacity,
        shape: table.shape,
        status: table.status,
        zone: table.zone || 'Əsas Salon',
      });
    }
  }, [table]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...table, ...formData, capacity: parseInt(formData.capacity) });
  };

  if (!table) return null;

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-premium-xl z-50 border-l border-slate-200"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Masa #{table.number}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-4">
          <Input label="Masa Nömrəsi" name="number" value={formData.number} onChange={handleChange} required />
          <Select label="Tutum" name="capacity" value={formData.capacity} onChange={handleChange}
            options={[2, 4, 6, 8, 10, 12].map(n => ({ value: n, label: `${n} nəfər` }))} required />
          <Select label="Forma" name="shape" value={formData.shape} onChange={handleChange}
            options={[
              { value: TABLE_SHAPES.SQUARE, label: 'Kvadrat' },
              { value: TABLE_SHAPES.ROUND, label: 'Dairəvi' },
              { value: TABLE_SHAPES.RECTANGLE, label: 'Düzbucaqlı' },
            ]} required />
          <Select label="Zona" name="zone" value={formData.zone} onChange={handleChange}
            options={ZONES.map(z => ({ value: z, label: z }))} />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[
              { value: TABLE_STATUS.AVAILABLE, label: 'Boş' },
              { value: TABLE_STATUS.OCCUPIED, label: 'Dolu' },
              { value: TABLE_STATUS.RESERVED, label: 'Rezerv' },
              { value: TABLE_STATUS.CLEANING, label: 'Təmizlənir' },
              { value: TABLE_STATUS.MAINTENANCE, label: 'Təmir' },
            ]} required />

          <div className="pt-3 space-y-2">
            <Button type="submit" variant="primary" fullWidth icon={<Save size={16} />}>Yadda Saxla</Button>
            <Button type="button" variant="danger" fullWidth icon={<Trash2 size={16} />}
              onClick={() => { if (window.confirm('Masanı silmək istədiyinizdən əminsiniz?')) onDelete(table.id); }}>
              Masanı Sil
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TablePropertiesPanel;
