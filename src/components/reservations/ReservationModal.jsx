import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import {
  TIME_SLOTS, PARTY_SIZES, OCCASION_TYPES, OCCASION_LABELS,
  DIETARY_OPTIONS, DIETARY_LABELS, BOOKING_SOURCE, BOOKING_SOURCE_LABELS,
} from '../../utils/constants';
import { findBookingConflicts } from '../../utils/bookingConflict';
import { suggestBestTable } from '../../utils/bookingHelpers';
import { User, Phone, Mail, Calendar, Users, StickyNote, Layers, MapPin, AlertTriangle, Wand2 } from 'lucide-react';

const ReservationModal = ({ isOpen, onClose, onSubmit, reservation, tables, floors, reservations = [], getAvailableSlots }) => {
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    date: new Date().toISOString().split('T')[0], time: '',
    partySize: 2, tableId: '', floorId: '', zone: '', notes: '',
    occasionType: OCCASION_TYPES.STANDARD, dietary: DIETARY_OPTIONS.NONE,
    deposit: 0, depositPaid: false, vip: false, source: BOOKING_SOURCE.MANAGER,
    mergedTableIds: [],
  });
  const [secondTable, setSecondTable] = useState('');

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail || '',
        date: reservation.date.split('T')[0],
        time: reservation.time,
        partySize: reservation.partySize,
        tableId: reservation.tableId,
        floorId: reservation.floorId || '',
        zone: reservation.zone || '',
        notes: reservation.notes || '',
        occasionType: reservation.occasionType || OCCASION_TYPES.STANDARD,
        dietary: reservation.dietary || DIETARY_OPTIONS.NONE,
        deposit: reservation.deposit || 0,
        depositPaid: reservation.depositPaid || false,
        vip: reservation.vip || false,
        source: reservation.source || BOOKING_SOURCE.MANAGER,
        mergedTableIds: reservation.mergedTableIds || [],
      });
      setSecondTable(reservation.mergedTableIds?.[0] || '');
    } else {
      setFormData({
        customerName: '', customerPhone: '', customerEmail: '',
        date: new Date().toISOString().split('T')[0], time: '',
        partySize: 2, tableId: '', floorId: '', zone: '', notes: '',
        occasionType: OCCASION_TYPES.STANDARD, dietary: DIETARY_OPTIONS.NONE,
        deposit: 0, depositPaid: false, vip: false, source: BOOKING_SOURCE.MANAGER,
        mergedTableIds: [],
      });
      setSecondTable('');
    }
  }, [reservation, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      partySize: parseInt(formData.partySize, 10),
      deposit: parseFloat(formData.deposit) || 0,
      mergedTableIds: secondTable ? [secondTable] : [],
    });
  };

  const floorTables = tables?.filter((t) => {
    if (formData.floorId && t.floorId !== formData.floorId) return false;
    if (formData.zone && t.zone !== formData.zone) return false;
    return t.status === 'available' && t.capacity >= formData.partySize;
  }) || [];

  const zones = [...new Set(tables?.filter((t) => !formData.floorId || t.floorId === formData.floorId).map((t) => t.zone) || [])];

  const slots = getAvailableSlots
    ? getAvailableSlots(formData.date, formData.partySize, formData.floorId || undefined, formData.zone || undefined)
    : [];

  const needsDeposit = [OCCASION_TYPES.BIRTHDAY, OCCASION_TYPES.WEDDING, OCCASION_TYPES.ENGAGEMENT, OCCASION_TYPES.CORPORATE, OCCASION_TYPES.PRIVATE_DINING].includes(formData.occasionType);

  const conflicts = findBookingConflicts(reservations, {
    date: formData.date, time: formData.time, tableId: formData.tableId,
    tableIds: secondTable ? [secondTable] : [], excludeId: reservation?.id,
  });

  const handleSmartTable = () => {
    const best = suggestBestTable(tables, formData.partySize, formData.floorId || undefined, formData.zone || undefined);
    if (best) setFormData({ ...formData, tableId: best.id, floorId: best.floorId, zone: best.zone });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reservation ? 'Rezervasiyanı Redaktə Et' : 'Yeni Rezervasiya'} size="large">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Müştəri Adı" name="customerName" value={formData.customerName} onChange={handleChange} icon={<User size={18} />} required />
          <Input label="Telefon" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleChange} icon={<Phone size={18} />} required />
        </div>
        <Input label="Email" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} icon={<Mail size={18} />} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select label="Tədbir növü" name="occasionType" value={formData.occasionType} onChange={handleChange}
            options={Object.entries(OCCASION_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
          <Select label="Diet / Allergen" name="dietary" value={formData.dietary} onChange={handleChange}
            options={Object.entries(DIETARY_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
          <Select label="Mənbə" name="source" value={formData.source} onChange={handleChange}
            options={Object.entries(BOOKING_SOURCE_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
          <label className="flex items-end gap-2 pb-2 cursor-pointer">
            <input type="checkbox" name="vip" checked={formData.vip} onChange={handleChange} className="rounded" />
            <span className="text-sm font-medium">VIP</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Tarix" name="date" type="date" value={formData.date} onChange={handleChange} icon={<Calendar size={18} />} required />
          <Select label="Vaxt" name="time" value={formData.time} onChange={handleChange}
            options={TIME_SLOTS.map((time) => ({ value: time, label: `${time}${slots.find((s) => s.time === time) ? ` (${slots.find((s) => s.time === time).availableCount} masa)` : ''}` }))}
            placeholder="Vaxt seçin" required />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select label="Mərtəbə" name="floorId" value={formData.floorId} onChange={handleChange}
            options={[{ value: '', label: 'Hamısı' }, ...(floors || []).map((f) => ({ value: f.id, label: `${f.icon} ${f.name}` }))]} />
          <Select label="Zona" name="zone" value={formData.zone} onChange={handleChange}
            options={[{ value: '', label: 'Hamısı' }, ...zones.map((z) => ({ value: z, label: z }))]} />
          <Select label="Qonaq Sayı" name="partySize" value={formData.partySize} onChange={handleChange}
            options={PARTY_SIZES.map((s) => ({ value: s, label: `${s} nəfər` }))} required />
          <Select label="Əsas Masa" name="tableId" value={formData.tableId} onChange={handleChange}
            options={floorTables.map((t) => ({ value: t.id, label: `${t.number} (${t.capacity}n) ${t.zone}` }))}
            placeholder="Masa" required />
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="small" icon={<Wand2 size={14} />} onClick={handleSmartTable}>
            Ən uyğun masa
          </Button>
          {conflicts.length > 0 && (
            <div className="flex-1 flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Masa konflikti ({conflicts.length})</p>
                {conflicts.map((c) => <p key={c.reservation.id}>{c.message}</p>)}
              </div>
            </div>
          )}
        </div>

        {formData.partySize >= 6 && (
          <Select label="Əlavə masa (birləşdirmə)" value={secondTable} onChange={(e) => setSecondTable(e.target.value)}
              options={[{ value: '', label: 'Yox' }, ...floorTables.filter((t) => t.id !== formData.tableId).map((t) => ({ value: t.id, label: t.number }))]} />
        )}

        {(needsDeposit || formData.deposit > 0) && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <Input label="Depozit (AZN)" name="deposit" type="number" value={formData.deposit} onChange={handleChange} />
            <label className="flex items-end gap-2 pb-2 cursor-pointer">
              <input type="checkbox" name="depositPaid" checked={formData.depositPaid} onChange={handleChange} />
              <span className="text-sm font-medium text-emerald-700">Depozit alınıb</span>
            </label>
          </div>
        )}

        <div className="form-group">
          <label className="block mb-2 font-semibold text-sm text-gray-700">Qeydlər</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Xüsusi tələblər, tort, dekorasiya..." rows="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none" />
        </div>

        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>Ləğv et</Button>
          <Button type="submit" variant="primary" fullWidth>{reservation ? 'Yenilə' : 'Yarat'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationModal;
