import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, gradient, delay = 0 }) => {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

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
        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
