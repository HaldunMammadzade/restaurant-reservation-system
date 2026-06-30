import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Users, Box } from 'lucide-react';
import GuestShell from '../components/GuestShell';
import InteractiveFloorMap from '../components/InteractiveFloorMap';
import { salonZones } from '../data/salonZones';
import { useApp } from '../../src/context/AppContext';
import { usePresentation } from '../context/PresentationContext';
import { TABLE_STATUS } from '../../src/utils/constants';
import { getTableView } from '../data/tableViews';
import { formatTableName } from '../utils/formatTable';

const ZoneDetailPage = () => {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { tables } = useApp();
  const { selectTable, setCompare, selectedTable, timeMode } = usePresentation();
  const zone = salonZones.find((z) => z.id === zoneId);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!zone) {
    return (
      <GuestShell showBack backTo="/teqdimat/explore">
        <p className="p-6 text-white/50">Zona tapılmadı</p>
      </GuestShell>
    );
  }

  const floorTables = tables.filter((t) => t.floorId === zoneId);
  const available = floorTables.filter((t) => t.status === TABLE_STATUS.AVAILABLE);

  const openSeatView = (table) => {
    selectTable(table);
    navigate(`/teqdimat/seat/${table.id}`);
  };

  const openCompare = (table) => {
    const other = available.find((t) => t.id !== table.id);
    if (other) {
      selectTable(table);
      setCompare(other);
      navigate('/teqdimat/compare');
    }
  };

  return (
    <GuestShell showBack backTo="/teqdimat/explore">
      <div className="pres-safe-bottom">
        <div className="relative h-56">
          <img src={zone.gallery[galleryIndex] || zone.heroImage} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${zone.accent} opacity-40 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0d] to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-3xl">{zone.icon}</span>
            <h1 className="text-2xl font-bold text-white">{zone.name}</h1>
            <p className="text-sm text-white/70">{zone.description}</p>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 overflow-x-auto pres-no-scrollbar">
          {zone.gallery.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setGalleryIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${i === galleryIndex ? 'border-emerald-400' : 'border-white/10'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="px-4 py-4 space-y-6">
          <button
            type="button"
            onClick={() => navigate(`/teqdimat/3d/${zoneId}`)}
            className="w-full rounded-2xl p-4 flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 shadow-lg shadow-emerald-500/20"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Box size={24} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-white">3D Salon — Seat View</p>
              <p className="text-xs text-white/80">Masaya toxun, oturacağınızdan görün</p>
            </div>
          </button>

          <div>
            <h2 className="text-sm font-semibold text-white/80 mb-3">Canlı masa planı</h2>
            <InteractiveFloorMap
              tables={tables}
              floorId={zoneId}
              selectedId={selectedTable?.id}
              onSelectTable={openSeatView}
              nightMode={timeMode === 'evening'}
            />
            <p className="text-center text-[10px] text-white/40 mt-2">Boş masaya toxunun — Seat View açılır</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white/80 mb-3">
              Boş masalar ({available.length})
            </h2>
            <div className="space-y-2">
              {available.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-6">Bu zonada boş masa yoxdur</p>
              ) : available.map((table, i) => {
                const view = getTableView(table);
                return (
                  <motion.button
                    key={table.id}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => openSeatView(table)}
                    className="w-full pres-glass rounded-2xl p-3 flex items-center gap-3 text-left hover:bg-white/10 transition-colors"
                  >
                    <img src={timeMode === 'evening' ? view.evening : view.day} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white">{formatTableName(table.number)}</p>
                      <p className="text-xs text-white/50">{view.label} · {table.zone}</p>
                      <p className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-0.5">
                        <Eye size={10} /> Seat View mövcuddur
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60 flex items-center gap-1"><Users size={12} />{table.capacity}</p>
                      {available.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openCompare(table); }}
                          className="text-[10px] text-amber-400 mt-1 underline"
                        >
                          Müqayisə
                        </button>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GuestShell>
  );
};

export default ZoneDetailPage;
