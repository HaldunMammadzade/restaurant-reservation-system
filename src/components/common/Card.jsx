import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children, title, subtitle, headerAction, className = '',
  padding = true, hoverable = false, premium = false, flush = false, delay = 0,
}) => {
  const baseClass = premium ? 'card-premium' : 'card';
  const padClass = flush || !padding ? '!p-0' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`${baseClass} ${padClass} ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}
    >
      {(title || headerAction) && (
        <div className={`flex items-center justify-between mb-4 pb-3 border-b border-slate-100 ${flush ? 'px-5 pt-5' : ''}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={flush ? '' : padding ? '' : '-mx-6'}>{children}</div>
    </motion.div>
  );
};

export default Card;
