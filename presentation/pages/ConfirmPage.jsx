import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Eye, ExternalLink } from 'lucide-react';
import GuestShell from '../components/GuestShell';
import { usePresentation } from '../context/PresentationContext';
import { PRESENTATION_RESTAURANT } from '../data/salonZones';
import { getTableView } from '../data/tableViews';
import { formatTableName } from '../utils/formatTable';
import { useApp } from '../../src/context/AppContext';

const ConfirmPage = () => {
  const navigate = useNavigate();
  const { lastReservation, selectedTable, resetFlow, timeMode } = usePresentation();
  const { tables } = useApp();

  const table = selectedTable || tables.find((t) => t.id === lastReservation?.tableId);
  const view = table ? getTableView(table) : null;

  if (!lastReservation) {
    navigate('/teqdimat');
    return null;
  }

  return (
    <GuestShell>
      <div className="px-4 py-8 pres-safe-bottom text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center pres-success-burst"
        >
          <CheckCircle size={40} className="text-emerald-400" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-white">Rezervasiya qəbul edildi!</h1>
          <p className="text-white/50 text-sm mt-2">
            {PRESENTATION_RESTAURANT.name} sizinlə əlaqə saxlayacaq
          </p>
        </div>

        {table && view && (
          <div className="relative h-40 rounded-2xl overflow-hidden text-left">
            <img src={timeMode === 'evening' ? view.evening : view.day} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="text-xs text-emerald-300 flex items-center gap-1"><Eye size={12} /> Sizin görünüşünüz</p>
              <p className="text-lg font-bold text-white">{formatTableName(table.number)}</p>
            </div>
          </div>
        )}

        <div className="pres-glass rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-emerald-400" />
            <div>
              <p className="text-xs text-white/50">Tarix və vaxt</p>
              <p className="text-sm font-semibold text-white">
                {new Date(lastReservation.date).toLocaleDateString('az-AZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' · '}{lastReservation.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-emerald-400" />
            <div>
              <p className="text-xs text-white/50">Masa</p>
              <p className="text-sm font-semibold text-white">
                {formatTableName(lastReservation.tableNumber)} · {lastReservation.zone} · {lastReservation.partySize} nəfər
              </p>
            </div>
          </div>
          <p className="text-[10px] text-white/40 pt-2 border-t border-white/10">
            Rezervasiya № {lastReservation.id} · Admin paneldə canlı görünür
          </p>
        </div>

        <div className="space-y-2">
          <a
            href="/floor-plan"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl pres-glass text-sm text-emerald-300 font-medium"
          >
            <ExternalLink size={16} /> Admin masa planını aç (demo)
          </a>
          <button
            type="button"
            onClick={() => { resetFlow(); navigate('/teqdimat'); }}
            className="w-full py-3 rounded-2xl bg-white/10 text-sm text-white font-medium"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    </GuestShell>
  );
};

export default ConfirmPage;
