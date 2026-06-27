import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Info, Grid3x3, TrendingUp, CheckCheck, PartyPopper } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';

const typeIcons = {
  reservation: Calendar,
  waitlist: Users,
  capacity: Info,
  event: PartyPopper,
  table: Grid3x3,
  revenue: TrendingUp,
};

const typeColors = {
  reservation: 'bg-blue-50 text-blue-600',
  waitlist: 'bg-amber-50 text-amber-600',
  capacity: 'bg-slate-100 text-slate-600',
  event: 'bg-pink-50 text-pink-700',
  table: 'bg-emerald-50 text-emerald-600',
  revenue: 'bg-rose-50 text-rose-600',
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-20 w-full max-w-sm bg-white rounded-2xl shadow-premium-xl border border-slate-200/80 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">Bildirişlər</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-primary-100 text-primary-700 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    title="Hamısını oxunmuş et"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">Bildiriş yoxdur</p>
              ) : (
                notifications.map((notif) => {
                  const Icon = typeIcons[notif.type] || Calendar;
                  const colorClass = typeColors[notif.type] || 'bg-slate-50 text-slate-600';

                  return (
                    <button
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0 ${
                        !notif.read ? 'bg-primary-50/30' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDistanceToNow(new Date(notif.time), { addSuffix: true, locale: az })}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
