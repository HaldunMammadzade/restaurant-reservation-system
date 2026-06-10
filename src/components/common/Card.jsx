import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle,
  headerAction,
  className = '',
  padding = true,
  hoverable = false,
  premium = false,
  delay = 0,
}) => {
  const baseClass = premium ? 'card-premium' : 'card';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${baseClass} ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={padding ? '' : 'p-0'}>{children}</div>
    </motion.div>
  );
};

export default Card;
