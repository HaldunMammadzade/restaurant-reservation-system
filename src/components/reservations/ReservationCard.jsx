import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Phone, Edit, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS } from '../../utils/constants';

const ReservationCard = ({ reservation, onEdit, onDelete, onCheckIn, onCancel, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card-premium card-hover border-l-[3px] border-l-primary-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-base font-bold text-slate-800">{reservation.customerName}</h3>
            <Badge variant={RESERVATION_STATUS_COLORS[reservation.status]}>
              {RESERVATION_STATUS_LABELS[reservation.status]}
            </Badge>
            {reservation.vip && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full ring-1 ring-amber-200">
                <Star size={10} /> VIP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Phone size={12} />
            {reservation.customerPhone}
          </p>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold">{reservation.tableNumber}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">#{reservation.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
          <Clock size={14} className="text-primary-500" />
          <span className="font-medium">{reservation.time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
          <Users size={14} className="text-primary-500" />
          <span className="font-medium">{reservation.partySize} nəfər</span>
        </div>
      </div>

      {reservation.notes && (
        <div className="p-2.5 bg-slate-50 rounded-lg mb-3 border border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed">{reservation.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-slate-100">
        {reservation.status === 'confirmed' && (
          <button onClick={() => onCheckIn(reservation.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-xs font-semibold">
            <CheckCircle size={14} />
            Check-in
          </button>
        )}
        <button onClick={() => onEdit(reservation)} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition-colors text-xs font-semibold">
          <Edit size={14} />
          Redaktə
        </button>
        {reservation.status !== 'cancelled' && (
          <button onClick={() => onCancel(reservation.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors text-xs font-semibold">
            <XCircle size={14} />
            Ləğv
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ReservationCard;
