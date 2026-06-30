import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Eye, Users, MapPin, ArrowRightLeft } from 'lucide-react';
import ParallaxImage from './ParallaxImage';
import { getTableView, getViewHighlights } from '../data/tableViews';
import { formatTableName } from '../utils/formatTable';
import { usePresentation } from '../context/PresentationContext';

const SeatView = ({
  table, onSelect, onCompare, compareMode = false,
}) => {
  const { timeMode } = usePresentation();
  const view = getTableView(table);
  const highlights = getViewHighlights(table);
  const imageSrc = timeMode === 'evening' ? view.evening : view.day;

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <div className="absolute inset-0">
        <ParallaxImage src={imageSrc} alt={view.label} className="w-full h-full min-h-[100dvh]" intensity={28} />
      </div>

      <div className="relative z-10 flex flex-col min-h-[100dvh] justify-between pres-safe-bottom">
        <div className="p-4 flex justify-between items-start">
          <div className="pres-glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-emerald-300">
            <Eye size={14} /> Seat View · {timeMode === 'evening' ? 'Gecə' : 'Gündüz'}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 pb-8"
        >
          <div className="pres-glass rounded-3xl p-5 space-y-4">
            <div>
              <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                <MapPin size={12} /> Oturacağınızdan görünüş
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">{formatTableName(table.number)}</h2>
              <p className="text-white/60 text-sm mt-1">{view.label} · {table.zone}</p>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">{view.description}</p>

            <div className="flex flex-wrap gap-2">
              {highlights.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] text-white/80 font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1"><Users size={14} /> {table.capacity} nəfər</span>
              <span>{table.zone}</span>
            </div>

            <div className="flex gap-2 pt-2">
              {onCompare && (
                <button
                  type="button"
                  onClick={() => onCompare(table)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  <ArrowRightLeft size={16} /> Müqayisə
                </button>
              )}
              {onSelect && !compareMode && (
                <button
                  type="button"
                  onClick={() => onSelect(table)}
                  className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 hover:brightness-110 transition-all"
                >
                  Bu masanı seç
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SeatView;
