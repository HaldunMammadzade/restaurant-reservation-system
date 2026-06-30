import React from 'react';
import { motion } from 'framer-motion';
import { TABLE_STATUS } from '../../src/utils/constants';

const statusStyle = {
  [TABLE_STATUS.AVAILABLE]: { fill: 'rgba(74, 222, 128, 0.35)', stroke: '#4ade80', pulse: true },
  [TABLE_STATUS.OCCUPIED]: { fill: 'rgba(239, 68, 68, 0.25)', stroke: '#f87171', pulse: false },
  [TABLE_STATUS.RESERVED]: { fill: 'rgba(245, 158, 11, 0.3)', stroke: '#fbbf24', pulse: false },
  [TABLE_STATUS.CLEANING]: { fill: 'rgba(148, 163, 184, 0.2)', stroke: '#94a3b8', pulse: false },
  [TABLE_STATUS.MAINTENANCE]: { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#a78bfa', pulse: false },
};

const InteractiveFloorMap = ({
  tables, floorId, selectedId, onSelectTable, compact = false, nightMode = false,
}) => {
  const floorTables = tables.filter((t) => t.floorId === floorId);
  const w = compact ? 320 : 360;
  const h = compact ? 280 : 400;

  return (
    <div className={`relative mx-auto ${compact ? 'w-full max-w-[320px]' : 'w-full max-w-[360px]'}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className={`w-full rounded-2xl border transition-colors duration-500 ${nightMode ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-white/5 border-white/10'}`}>
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="url(#grid)" rx="16" />

        {floorTables.map((table) => {
          const st = statusStyle[table.status] || statusStyle.available;
          const isSelected = selectedId === table.id;
          const cx = (table.x / 560) * w;
          const cy = (table.y / 400) * h;
          const r = table.capacity >= 6 ? 22 : table.capacity >= 4 ? 18 : 14;
          const canSelect = table.status === TABLE_STATUS.AVAILABLE;

          return (
            <g key={table.id} style={{ cursor: canSelect ? 'pointer' : 'default' }}
              onClick={() => canSelect && onSelectTable?.(table)}>
              {st.pulse && canSelect && (
                <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.4" className="pres-pulse-ring" />
              )}
              <motion.circle
                cx={cx} cy={cy} r={r}
                fill={isSelected ? 'rgba(74, 222, 128, 0.6)' : st.fill}
                stroke={isSelected ? '#4ade80' : st.stroke}
                strokeWidth={isSelected ? 3 : 1.5}
                initial={false}
                animate={{ scale: isSelected ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                {table.number}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap gap-3 mt-3 justify-center text-[10px] text-white/50">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Boş</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Rezerv</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Dolu</span>
      </div>
    </div>
  );
};

export default InteractiveFloorMap;
