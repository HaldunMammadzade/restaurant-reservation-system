import React from 'react';
import { Calendar, Users, Grid3x3, Sparkles, XCircle, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import { useApp } from '../../context/AppContext';

const typeConfig = {
  checkin: { icon: LogIn, color: 'bg-emerald-50 text-emerald-600' },
  reservation: { icon: Calendar, color: 'bg-blue-50 text-blue-600' },
  table: { icon: Grid3x3, color: 'bg-violet-50 text-violet-600' },
  waitlist: { icon: Users, color: 'bg-amber-50 text-amber-600' },
  ai: { icon: Sparkles, color: 'bg-purple-50 text-purple-600' },
  cancel: { icon: XCircle, color: 'bg-rose-50 text-rose-600' },
};

const ActivityFeed = ({ limit = 6 }) => {
  const { activities } = useApp();
  const items = activities.slice(0, limit);

  return (
    <div className="space-y-1">
      {items.map((activity, index) => {
        const config = typeConfig[activity.type] || typeConfig.reservation;
        const Icon = config.icon;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: az })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
