import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import {
  TABLE_STATUS, TABLE_SHAPES, SERVICE_PHASE, SERVICE_PHASE_LABELS,
} from '../../utils/constants';

const TablePropertiesPanel = ({
  table, floors, staff, mergeCandidates, onUpdate, onDelete, onAdvancePhase, onClear, onClose,
  onMerge, onUnmerge, onAssignServer,
}) => {
  const [formData, setFormData] = useState({
    number: '', capacity: 4, shape: TABLE_SHAPES.SQUARE,
    status: TABLE_STATUS.AVAILABLE, zone: 'Əsas Salon',
    guestName: '', partySize: 2, servicePhase: SERVICE_PHASE.SEATED, floorId: '', serverId: '', minimumSpend: '',
  });

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number,
        capacity: table.capacity,
        shape: table.shape,
        status: table.status,
        zone: table.zone || 'Əsas Salon',
        guestName: table.guestName || '',
        partySize: table.partySize || 2,
        servicePhase: table.servicePhase || SERVICE_PHASE.SEATED,
        floorId: table.floorId || floors?.[0]?.id,
        serverId: table.serverId || '',
        minimumSpend: table.minimumSpend != null ? String(table.minimumSpend) : '',
      });
    }
  }, [table, floors]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...table,
      ...formData,
      capacity: parseInt(formData.capacity, 10),
      partySize: parseInt(formData.partySize, 10) || undefined,
      guestName: formData.guestName || undefined,
      minimumSpend: formData.minimumSpend ? parseFloat(formData.minimumSpend) : undefined,
    });
  };

  if (!table) return null;

  const seatedMins = table.seatedAt ? Math.floor((Date.now() - table.seatedAt) / 60000) : null;

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-premium-xl z-50 border-l border-slate-200"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Masa #{table.number}</h3>
            {seatedMins !== null && <p className="text-xs text-slate-400">{seatedMins} dəqiqədir oturub</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-4">
          <Input label="Masa Nömrəsi" name="number" value={formData.number} onChange={handleChange} required />
          <Select label="Mərtəbə" name="floorId" value={formData.floorId} onChange={handleChange}
            options={(floors || []).map((f) => ({ value: f.id, label: f.name }))} />
          <Select label="Tutum" name="capacity" value={formData.capacity} onChange={handleChange}
            options={[2, 4, 6, 8, 10, 12].map((n) => ({ value: n, label: `${n} nəfər` }))} required />
          <Select label="Forma" name="shape" value={formData.shape} onChange={handleChange}
            options={[
              { value: TABLE_SHAPES.SQUARE, label: 'Kvadrat' },
              { value: TABLE_SHAPES.ROUND, label: 'Dairəvi' },
              { value: TABLE_SHAPES.RECTANGLE, label: 'Düzbucaqlı' },
            ]} required />
          <Input label="Zona" name="zone" value={formData.zone} onChange={handleChange} />
          <Input label="Minimum xərcləmə (AZN)" name="minimumSpend" type="number" step="1" value={formData.minimumSpend} onChange={handleChange} placeholder="Məs: VIP masalar üçün 200" />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[
              { value: TABLE_STATUS.AVAILABLE, label: 'Boş' },
              { value: TABLE_STATUS.OCCUPIED, label: 'Dolu' },
              { value: TABLE_STATUS.RESERVED, label: 'Rezerv' },
              { value: TABLE_STATUS.CLEANING, label: 'Təmizlənir' },
              { value: TABLE_STATUS.MAINTENANCE, label: 'Təmir' },
            ]} required />

          {formData.status === TABLE_STATUS.OCCUPIED && (
            <>
              <Input label="Qonaq adı" name="guestName" value={formData.guestName} onChange={handleChange} />
              <Input label="Nəfər sayı" name="partySize" type="number" value={formData.partySize} onChange={handleChange} />
              <Select label="Xidmət fazası" name="servicePhase" value={formData.servicePhase} onChange={handleChange}
                options={Object.entries(SERVICE_PHASE_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
              {staff?.length > 0 && (
                <Select label="Ofisiant" name="serverId" value={formData.serverId || ''} onChange={(e) => {
                  handleChange(e);
                  onAssignServer?.(e.target.value);
                }}
                  options={[{ value: '', label: 'Təyin edilməyib' }, ...staff.map((s) => ({ value: s.id, label: `${s.name} (${s.role})` }))]} />
              )}
              <Button type="button" variant="secondary" fullWidth icon={<ArrowRight size={16} />} onClick={onAdvancePhase}>
                Növbəti fazaya keç
              </Button>
            </>
          )}

          {mergeCandidates?.length > 0 && formData.status === TABLE_STATUS.AVAILABLE && (
            <Select label="Masa birləşdir" value="" onChange={(e) => e.target.value && onMerge?.(e.target.value)}
              options={[{ value: '', label: 'Seçin...' }, ...mergeCandidates.map((t) => ({ value: t.id, label: `+ Masa ${t.number} (${t.capacity}n)` }))]} />
          )}
          {table.mergedWith?.length > 0 && (
            <Button type="button" variant="outline" fullWidth onClick={onUnmerge}>Birləşməni ləğv et ({table.mergedWith.length} masa)</Button>
          )}

          <div className="pt-3 space-y-2">
            <Button type="submit" variant="primary" fullWidth icon={<Save size={16} />}>Yadda Saxla</Button>
            {formData.status === TABLE_STATUS.OCCUPIED && (
              <Button type="button" variant="outline" fullWidth icon={<RotateCcw size={16} />} onClick={onClear}>
                Masanı boşalt
              </Button>
            )}
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
