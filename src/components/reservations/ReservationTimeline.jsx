import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { OCCASION_ICONS, OCCASION_COLORS, OCCASION_LABELS, RESERVATION_STATUS_COLORS, RESERVATION_STATUS_LABELS } from '../../utils/constants';
import Badge from '../common/Badge';

const HOURS = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];

const ReservationTimeline = ({ reservations, tables, floors, date, onSelect }) => {
  const dateStr = new Date(date).toDateString();

  const dayReservations = useMemo(() =>
    reservations.filter((r) =>
      new Date(r.date).toDateString() === dateStr
      && r.status !== 'cancelled' && r.status !== 'no_show',
    ).sort((a, b) => a.time.localeCompare(b.time)),
  [reservations, dateStr]);

  const byFloor = useMemo(() => {
    const map = {};
    floors.forEach((f) => { map[f.id] = { floor: f, slots: {} }; });
    HOURS.forEach((h) => {
      floors.forEach((f) => { map[f.id].slots[h] = []; });
    });
    dayReservations.forEach((r) => {
      const floorId = r.floorId || tables.find((t) => t.id === r.tableId)?.floorId;
      if (floorId && map[floorId]?.slots[r.time]) {
        map[floorId].slots[r.time].push(r);
      }
    });
    return Object.values(map);
  }, [dayReservations, floors, tables]);

  return (
    <div className="card-premium overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[120px_repeat(13,1fr)] gap-px bg-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 p-2 text-xs font-bold text-slate-500">Mərtəbə</div>
          {HOURS.map((h) => (
            <div key={h} className="bg-slate-100 p-2 text-[10px] font-bold text-slate-500 text-center">{h}</div>
          ))}

          {byFloor.map(({ floor, slots }) => (
            <React.Fragment key={floor.id}>
              <div className="bg-white p-2 flex items-center gap-1.5">
                <span>{floor.icon}</span>
                <span className="text-xs font-semibold text-slate-700 truncate">{floor.shortName}</span>
              </div>
              {HOURS.map((h) => {
                const items = slots[h] || [];
                return (
                  <div key={`${floor.id}-${h}`} className="bg-white p-1 min-h-[52px]">
                    {items.map((r) => (
                      <motion.button
                        key={r.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onSelect?.(r)}
                        className={`w-full text-left p-1.5 rounded-lg mb-0.5 text-[10px] border-l-2 ${
                          r.occasionType && r.occasionType !== 'standard' && OCCASION_COLORS[r.occasionType]
                            ? OCCASION_COLORS[r.occasionType]
                            : 'bg-primary-50 border-primary-400 text-primary-800'
                        }`}
                      >
                        <div className="font-bold truncate">{r.customerName.split(' ')[0]}</div>
                        <div className="opacity-70">{r.tableNumber} · {r.partySize}n</div>
                        {r.occasionType !== 'standard' && <span>{OCCASION_ICONS[r.occasionType]}</span>}
                      </motion.button>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-3 px-1">Timeline — mərtəbə və saat üzrə bütün rezervasiyalar. Kliklə detallara bax.</p>
    </div>
  );
};

export default ReservationTimeline;
