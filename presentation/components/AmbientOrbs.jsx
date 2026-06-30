import React from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '../context/PresentationContext';

const AmbientOrbs = () => {
  const { timeMode } = usePresentation();
  const isNight = timeMode === 'evening';

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${isNight ? 'bg-indigo-600/20' : 'bg-emerald-500/15'}`}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute top-1/3 -left-20 w-48 h-48 rounded-full blur-3xl ${isNight ? 'bg-amber-600/10' : 'bg-teal-400/10'}`}
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-20 right-10 w-32 h-32 rounded-full blur-2xl ${isNight ? 'bg-violet-500/15' : 'bg-emerald-400/10'}`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
};

export default AmbientOrbs;
