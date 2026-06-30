import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ParallaxImage from './ParallaxImage';
import { getTableView } from '../data/tableViews';
import { formatTableName } from '../utils/formatTable';
import { usePresentation } from '../context/PresentationContext';

const SeatCompare = ({ tableA, tableB, onSelect, onBack }) => {
  const { timeMode } = usePresentation();
  const [index, setIndex] = useState(0);
  const tables = [tableA, tableB].filter(Boolean);
  const current = tables[index];
  const view = getTableView(current);
  const viewImg = timeMode === 'evening' ? view.evening : view.day;

  const next = () => setIndex((i) => (i + 1) % tables.length);
  const prev = () => setIndex((i) => (i - 1 + tables.length) % tables.length);

  return (
    <div className="min-h-[100dvh] flex flex-col pres-safe-bottom">
      <div className="relative h-[55dvh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="absolute inset-0"
          >
            <ParallaxImage src={viewImg} alt="" className="w-full h-full" intensity={16} />
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 pres-glass w-10 h-10 rounded-full flex items-center justify-center text-white">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 pres-glass w-10 h-10 rounded-full flex items-center justify-center text-white">
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {tables.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'bg-emerald-400 w-6' : 'bg-white/40 w-2.5'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="pres-glass rounded-2xl p-4">
          <p className="text-xs text-emerald-400 uppercase tracking-wider">Müqayisə · {index + 1}/{tables.length}</p>
          <h3 className="text-xl font-bold mt-1">{formatTableName(current.number)}</h3>
          <p className="text-white/60 text-sm">{view.label} · {current.zone} · {current.capacity} nəfər</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {tables.map((t, i) => {
            const v = getTableView(t);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`rounded-xl overflow-hidden border-2 transition-all text-left ${i === index ? 'border-emerald-400' : 'border-white/10'}`}
              >
                <img src={timeMode === 'evening' ? v.evening : v.day} alt="" className="w-full h-20 object-cover" />
                <div className="p-2 bg-white/5">
                  <p className="text-xs font-bold text-white">{formatTableName(t.number)}</p>
                  <p className="text-[10px] text-white/50">{v.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="flex-1 py-3 rounded-2xl border border-white/20 text-sm font-medium text-white">
            Geri
          </button>
          <button
            type="button"
            onClick={() => onSelect(current)}
            className="flex-[2] py-3 rounded-2xl bg-emerald-500 text-sm font-bold text-white"
          >
            {formatTableName(current.number)} seç
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatCompare;
