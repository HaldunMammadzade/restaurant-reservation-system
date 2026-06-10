import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-primary-900 to-violet-900 p-6 sm:p-8"
    >
      <div className="absolute inset-0 ai-shimmer opacity-30" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <Sparkles size={24} className="text-primary-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">SeatMind AI</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                AKTİV
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Bu axşam 19:00-21:00 arası <span className="text-white font-semibold">92% doluluq</span> proqnozlaşdırılır. 
              2 əlavə masa rezervasiyası tövsiyə olunur.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Zap size={12} className="text-amber-400" />
                <span>+18% gəlir potensialı</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles size={12} className="text-primary-300" />
                <span>4 yeni tövsiyə</span>
              </div>
            </div>
          </div>
        </div>
        <Link
          to="/analytics"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 flex-shrink-0"
        >
          Tövsiyələri gör
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default AIBanner;
