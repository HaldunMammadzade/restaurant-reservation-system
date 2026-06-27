import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'confirm', label: 'Rezervasiya təsdiqi', text: '{name}, {date} {time} rezervasiyanız təsdiqlənib. {restaurant}.' },
  { id: 'reminder', label: 'Xatırlatma', text: '{name}, bu gün {time} rezervasiyanız var. Gözləyirik!' },
  { id: 'ready', label: 'Masa hazırdır', text: '{name}, masanız hazırdır. Zəhmət olmasa daxil olun.' },
  { id: 'deposit', label: 'Depozit alındı', text: '{name}, depozitiniz qəbul edildi. Təşəkkür edirik.' },
  { id: 'cancel', label: 'Ləğv bildirişi', text: '{name}, rezervasiyanız ləğv edildi.' },
];

const Communications = () => {
  const { smsLogs, sendSms, restaurant, todayReservations, waitlist } = useApp();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const applyTemplate = (tpl) => {
    const sample = todayReservations[0];
    setMessage(tpl.text
      .replace('{name}', sample?.customerName?.split(' ')[0] || 'Qonaq')
      .replace('{date}', sample?.date ? formatDate(sample.date) : '—')
      .replace('{time}', sample?.time || '—')
      .replace('{restaurant}', restaurant?.name || 'Restoran'));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!phone || !message) return;
    sendSms(phone, message, 'manual');
    toast.success('SMS göndərildi');
    setMessage('');
  };

  const quickSendWaitlist = (entry) => {
    sendSms(entry.customerPhone, `${entry.customerName}, masanız tezliklə hazır olacaq. Təxmini gözləmə: ${entry.waitTime || 10} dəq.`, 'waitlist');
    toast.success('Gözləmə SMS göndərildi');
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Mesajlar" subtitle="SMS şablonları, göndərmə və tarixçə" badge={`${smsLogs.length} mesaj`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-4">
          <Card premium title="SMS Göndər">
            <form onSubmit={handleSend} className="space-y-3">
              <Input label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994501234567" required />
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Mesaj</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none" />
              </div>
              <Button type="submit" variant="primary" fullWidth icon={<Send size={16} />}>Göndər</Button>
            </form>
          </Card>

          <Card premium title="Şablonlar">
            <div className="space-y-1.5">
              {TEMPLATES.map((t) => (
                <button key={t.id} type="button" onClick={() => applyTemplate(t)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </Card>

          {waitlist.length > 0 && (
            <Card premium title="Gözləmə — ETA SMS">
              <div className="space-y-2">
                {waitlist.map((w) => (
                  <div key={w.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{w.customerName}</p>
                      <p className="text-xs text-slate-400">{w.partySize} nəfər</p>
                    </div>
                    <button onClick={() => quickSendWaitlist(w)} className="text-xs font-medium text-primary-600 hover:underline">SMS</button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card premium title="Mesaj tarixçəsi" subtitle="Son göndərilən SMS-lər">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {smsLogs.map((log) => (
                <div key={log.id} className="flex gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-sm font-medium text-slate-800">{log.to}</span>
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} />{log.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{log.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />{new Date(log.sentAt).toLocaleString('az-AZ')} · {log.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communications;
