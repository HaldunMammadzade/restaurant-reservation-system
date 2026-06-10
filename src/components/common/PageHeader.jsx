import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, action, badge }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2"
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary-50 text-primary-700 rounded-full ring-1 ring-primary-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 mt-1 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
};

export default PageHeader;
