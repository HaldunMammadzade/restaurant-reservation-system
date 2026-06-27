import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Phone, Edit, CheckCircle, XCircle, Star, Banknote, MessageSquare, UserX, Eye, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';
import {
  RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS,
  OCCASION_LABELS, OCCASION_ICONS, OCCASION_COLORS,
  BOOKING_SOURCE_LABELS, DIETARY_LABELS,
} from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { calcNoShowRisk } from '../../utils/operationsEngine';

const ReservationCard = ({
  reservation, onEdit, onDelete, onCheckIn, onCancel, onViewProfile,
  onSendReminder, onMarkNoShow, delay = 0,
}) => {
  const { getCustomerForPhone } = useApp();
  const customer = getCustomerForPhone(reservation.customerPhone);
  const noShowRisk = calcNoShowRisk(customer, reservation);

  return (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="card-premium card-hover border-l-[3px] border-l-primary-500"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <button onClick={() => onViewProfile?.(reservation)} className="text-base font-bold text-slate-800 hover:text-primary-600 flex items-center gap-1">
            {reservation.customerName}
            <Eye size={12} className="opacity-40" />
          </button>
          <Badge variant={RESERVATION_STATUS_COLORS[reservation.status]}>
            {RESERVATION_STATUS_LABELS[reservation.status]}
          </Badge>
          {noShowRisk >= 25 && reservation.status !== 'checked_in' && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ring-1 ${noShowRisk >= 40 ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
              <AlertTriangle size={10} /> {noShowRisk}% risk
            </span>
          )}
          {reservation.vip && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full ring-1 ring-amber-200">
              <Star size={10} /> VIP
            </span>
          )}
          {reservation.occasionType && reservation.occasionType !== 'standard' && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ring-1 ${OCCASION_COLORS[reservation.occasionType] || ''}`}>
              {OCCASION_ICONS[reservation.occasionType]} {OCCASION_LABELS[reservation.occasionType]}
            </span>
          )}
          {reservation.deposit > 0 && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ring-1 ${reservation.depositPaid ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>
              <Banknote size={10} /> {formatCurrency(reservation.deposit)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={12} />{reservation.customerPhone}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {reservation.source && <span className="text-[10px] text-slate-400">{BOOKING_SOURCE_LABELS[reservation.source]}</span>}
          {reservation.dietary && reservation.dietary !== 'none' && (
            <span className="text-[10px] text-amber-600">· {DIETARY_LABELS[reservation.dietary]}</span>
          )}
          {reservation.smsReminderSent && <span className="text-[10px] text-emerald-500">· SMS ✓</span>}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">{reservation.tableNumber}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">#{reservation.id.slice(-6)}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
        <Clock size={14} className="text-primary-500" /><span className="font-medium">{reservation.time}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
        <Users size={14} className="text-primary-500" /><span className="font-medium">{reservation.partySize} nəfər</span>
      </div>
    </div>

    {reservation.notes && (
      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3 italic">{reservation.notes}</p>
    )}

    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
      {reservation.status === 'confirmed' && (
        <button onClick={() => onCheckIn?.(reservation.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg">
          <CheckCircle size={12} /> Check-in
        </button>
      )}
      <button onClick={() => onEdit?.(reservation)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg">
        <Edit size={12} /> Redaktə
      </button>
      {onSendReminder && reservation.status !== 'checked_in' && (
        <button onClick={() => onSendReminder(reservation.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <MessageSquare size={12} /> SMS
        </button>
      )}
      {onMarkNoShow && ['confirmed', 'pending'].includes(reservation.status) && (
        <button onClick={() => onMarkNoShow(reservation.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg">
          <UserX size={12} /> No-show
        </button>
      )}
      <button onClick={() => onCancel?.(reservation.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg ml-auto">
        <XCircle size={12} /> Ləğv
      </button>
    </div>
  </motion.div>
  );
};

export default ReservationCard;
