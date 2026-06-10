import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { TIME_SLOTS, PARTY_SIZES } from '../../utils/constants';
import { User, Phone, Mail, Calendar, Clock, Users, StickyNote } from 'lucide-react';

const ReservationModal = ({ isOpen, onClose, onSubmit, reservation, tables }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    partySize: 2,
    tableId: '',
    notes: '',
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail,
        date: reservation.date.split('T')[0],
        time: reservation.time,
        partySize: reservation.partySize,
        tableId: reservation.tableId,
        notes: reservation.notes || '',
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        partySize: 2,
        tableId: '',
        notes: '',
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableTables = tables?.filter(t => 
    t.status === 'available' && t.capacity >= formData.partySize
  ) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reservation ? 'Rezervasiyanı Redaktə Et' : 'Yeni Rezervasiya'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Müştəri Adı"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Ad Soyad"
            icon={<User size={18} />}
            required
          />

          <Input
            label="Telefon"
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="+994501234567"
            icon={<Phone size={18} />}
            required
          />
        </div>

        <Input
          label="Email"
          name="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={handleChange}
          placeholder="email@example.com"
          icon={<Mail size={18} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tarix"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            icon={<Calendar size={18} />}
            required
          />

          <Select
            label="Vaxt"
            name="time"
            value={formData.time}
            onChange={handleChange}
            options={TIME_SLOTS.map(time => ({ value: time, label: time }))}
            placeholder="Vaxt seçin"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Qonaq Sayı"
            name="partySize"
            value={formData.partySize}
            onChange={handleChange}
            options={PARTY_SIZES.map(size => ({ value: size, label: `${size} nəfər` }))}
            required
          />

          <Select
            label="Masa"
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            options={availableTables.map(table => ({
              value: table.id,
              label: `Masa ${table.number} (${table.capacity} nəfərlik)`
            }))}
            placeholder="Masa seçin"
            required
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 font-semibold text-sm text-gray-700">
            Qeydlər
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Əlavə qeydlər və xüsusi tələblər..."
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Ləğv et
          </Button>
          <Button type="submit" variant="primary" fullWidth>
            {reservation ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationModal;
