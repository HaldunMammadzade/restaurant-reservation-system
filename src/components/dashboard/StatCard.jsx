import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const iconBgMap = {
  'from-blue-500 to-blue-600': 'bg-blue-100 text-blue-600',
  'from-emerald-500 to-emerald-600': 'bg-emerald-100 text-emerald-600',
  'from-violet-500 to-purple-600': 'bg-violet-100 text-violet-600',
  'from-amber-500 to-orange-600': 'bg-amber-100 text-amber-600',
};

const StatCard = ({ title, value, change, icon: Icon, gradient, delay = 0 }) => {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');
  const iconClass = iconBgMap[gradient] || 'bg-slate-100 text-slate-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-premium card-hover group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-500'
            }`}>
              {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : null}
              <span>{change} əvvəlki aya görə</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
