import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Phone, Mail, Calendar, AlertTriangle, Utensils, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import { DIETARY_LABELS, OCCASION_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/helpers';

const GuestProfileModal = ({ customer, reservation, onClose, onCheckIn, onSendSms }) => {
  if (!customer && !reservation) return null;

  const name = customer?.name || reservation?.customerName;
  const phone = customer?.phone || reservation?.customerPhone;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-premium-xl max-w-md w-full overflow-hidden">
        <div className="bg-primary-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg"><X size={18} /></button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${customer?.vip ? 'bg-amber-400 text-amber-900' : 'bg-white/20'}`}>
              {name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{name}</h2>
                {(customer?.vip || reservation?.vip) && <Star size={16} className="fill-amber-300 text-amber-300" />}
              </div>
              <p className="text-sm text-white/80 flex items-center gap-1 mt-1"><Phone size={12} />{phone}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {customer && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">Ziyarət</p>
                <p className="text-lg font-bold text-slate-800">{customer.visitCount}x</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">LTV</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(customer.totalSpent)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">No-show</p>
                <p className={`text-lg font-bold ${customer.noShowCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{customer.noShowCount || 0}</p>
              </div>
            </div>
          )}

          {reservation && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Calendar size={14} />{formatDate(reservation.date)} · {reservation.time} · Masa {reservation.tableNumber}</div>
              {reservation.occasionType && reservation.occasionType !== 'standard' && (
                <span className="inline-block px-2 py-0.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full">
                  {OCCASION_LABELS[reservation.occasionType]}
                </span>
              )}
              {(reservation.dietary && reservation.dietary !== 'none') && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-amber-800 text-xs">
                  <Utensils size={14} />{DIETARY_LABELS[reservation.dietary]}
                </div>
              )}
              {reservation.deposit > 0 && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                  <TrendingUp size={14} />Depozit: {formatCurrency(reservation.deposit)} {reservation.depositPaid ? '✓ alınıb' : '— gözlənilir'}
                </div>
              )}
              {customer?.notes && (
                <div className="p-2 bg-slate-50 rounded-lg text-xs text-slate-600">{customer.notes}</div>
              )}
              {customer?.noShowCount > 1 && (
                <div className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg text-rose-700 text-xs">
                  <AlertTriangle size={14} />Diqqət: {customer.noShowCount} no-show tarixçəsi
                </div>
              )}
            </div>
          )}

          {customer?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] bg-primary-50 text-primary-700 rounded-full">{tag}</span>)}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onCheckIn && reservation?.status === 'confirmed' && (
              <Button variant="primary" fullWidth onClick={() => { onCheckIn(reservation.id); onClose(); }}>Check-in</Button>
            )}
            {onSendSms && (
              <Button variant="outline" fullWidth onClick={() => onSendSms(reservation?.id)}>SMS Göndər</Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuestProfileModal;
