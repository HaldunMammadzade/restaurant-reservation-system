import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Sun, Moon, ArrowLeft, Users, MapPin, Sparkles,
  ChevronRight, RotateCcw,
} from 'lucide-react';
import RestaurantScene, { CameraRig } from './RestaurantScene';
import { salonZones } from '../../data/salonZones';
import { getTableView, getViewHighlights } from '../../data/tableViews';
import { formatTableName } from '../../utils/formatTable';
import AmbientOrbs from '../AmbientOrbs';
import { useApp } from '../../../src/context/AppContext';
import { usePresentation } from '../../context/PresentationContext';
import { TABLE_STATUS } from '../../../src/utils/constants';

const Restaurant3DExperience = ({ initialFloorId = 'floor_1', autoSeatTableId = null }) => {
  const navigate = useNavigate();
  const { tables } = useApp();
  const { selectTable, timeMode, setTimeMode } = usePresentation();
  const [floorId, setFloorId] = useState(initialFloorId);
  const [phase, setPhase] = useState('browse');
  const [activeTable, setActiveTable] = useState(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const controlsRef = useRef();

  const floorTables = tables.filter((t) => t.floorId === floorId);
  const availableCount = floorTables.filter((t) => t.status === TABLE_STATUS.AVAILABLE).length;
  const zone = salonZones.find((z) => z.id === floorId);

  useEffect(() => {
    if (autoSeatTableId) {
      const t = tables.find((x) => x.id === autoSeatTableId);
      if (t) handleTableSelect(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSeatTableId, tables]);

  useEffect(() => {
    if (phase === 'transitioning' && animProgress >= 1) {
      const timer = setTimeout(() => setPhase('seatview'), 200);
      return () => clearTimeout(timer);
    }
  }, [phase, animProgress]);

  const handleTableSelect = useCallback((table) => {
    setActiveTable(table);
    selectTable(table);
    setPhase('transitioning');
    setAnimProgress(0);
    setShowHint(false);
  }, [selectTable]);

  const handleBackToBrowse = () => {
    setPhase('browse');
    setActiveTable(null);
    setAnimProgress(0);
  };

  const handleReserve = () => {
    if (activeTable) {
      selectTable(activeTable);
      navigate('/teqdimat/reserve');
    }
  };

  const table = activeTable;
  const view = table ? getTableView(table) : null;
  const highlights = table ? getViewHighlights(table) : [];

  return (
    <div className={`presentation-root relative w-full h-[100dvh] overflow-hidden ${timeMode === 'evening' ? 'pres-night' : 'pres-day'}`}>
      <AmbientOrbs />
      <Canvas
        shadows
        camera={{ position: [0, 11, 14], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        className="touch-none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <RestaurantScene
            tables={tables}
            floorId={floorId}
            phase={phase}
            selectedTable={activeTable}
            timeMode={timeMode}
            onTableSelect={handleTableSelect}
            controlsRef={controlsRef}
            animProgress={animProgress}
          />
          <CameraRig
            phase={phase}
            selectedTable={activeTable}
            animProgress={animProgress}
            setAnimProgress={setAnimProgress}
          />
        </Suspense>
      </Canvas>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none">
        <div className="max-w-lg mx-auto flex items-center justify-between pointer-events-auto">
          <button
            type="button"
            onClick={() => phase === 'browse' ? navigate('/teqdimat') : handleBackToBrowse()}
            className="pres-glass w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="pres-glass rounded-2xl px-4 py-2 text-center">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest">3D Salon</p>
            <p className="text-sm font-bold text-white">{zone?.name || 'Masa seçimi'}</p>
          </div>
          <div className="w-10 flex justify-end">
            <button
              type="button"
              onClick={() => setTimeMode(timeMode === 'day' ? 'evening' : 'day')}
              className="pres-glass w-10 h-10 rounded-full flex items-center justify-center text-white"
              title={timeMode === 'day' ? 'Gecə rejimi' : 'Gündüz rejimi'}
            >
              {timeMode === 'evening' ? <Moon size={16} className="text-indigo-300" /> : <Sun size={16} className="text-amber-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floor tabs */}
      {phase === 'browse' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 z-30 px-4 pointer-events-none"
        >
          <div className="max-w-lg mx-auto flex gap-2 overflow-x-auto pres-no-scrollbar pointer-events-auto pb-1">
            {salonZones.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setFloorId(z.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  floorId === z.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'pres-glass text-white/60 hover:text-white'
                }`}
              >
                {z.icon} {z.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hint */}
      <AnimatePresence>
        {phase === 'browse' && showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-0 right-0 z-30 px-4 pointer-events-none"
          >
            <div className="max-w-lg mx-auto pres-glass rounded-2xl p-4 pointer-events-auto border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 pres-pulse-ring">
                  <Eye size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Seat View — 3D masa seçimi</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    Yaşıl masaya toxunun. Kamera avtomatik oturacağınıza uçacaq və
                    <strong className="text-emerald-300"> görünüşünüzü</strong> göstərəcək.
                  </p>
                  <p className="text-[10px] text-emerald-400/70 mt-2">
                    {availableCount} boş masa · Sürüşdürün · Yaxınlaşdırın
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seat View UI */}
      <AnimatePresence>
        {(phase === 'transitioning' || phase === 'seatview') && table && view && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ delay: phase === 'seatview' ? 0 : 0.5 }}
            className="absolute bottom-0 left-0 right-0 z-30 pres-safe-bottom"
          >
            <div className="max-w-lg mx-auto px-4 pb-4">
              {phase === 'transitioning' && animProgress < 0.8 && (
                <div className="text-center mb-3">
                  <p className="text-xs text-emerald-400 animate-pulse flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Oturacağınıza keçid...
                  </p>
                </div>
              )}

              <div className="pres-glass rounded-3xl p-5 border border-emerald-500/15 pres-seat-glow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Eye size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider">Seat View</p>
                      <p className="text-lg font-bold text-white">{formatTableName(table.number)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 pres-glass rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setTimeMode('day')}
                      className={`p-2 rounded-lg transition-all ${timeMode === 'day' ? 'bg-white/20 text-white' : 'text-white/40'}`}
                    >
                      <Sun size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeMode('evening')}
                      className={`p-2 rounded-lg transition-all ${timeMode === 'evening' ? 'bg-white/20 text-white' : 'text-white/40'}`}
                    >
                      <Moon size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-white/70 leading-relaxed">
                  <MapPin size={12} className="inline mr-1 text-emerald-400" />
                  {view.label} — {view.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {highlights.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-white/50">
                  <span className="flex items-center gap-1"><Users size={12} /> {table.capacity} nəfər</span>
                  <span>{table.zone}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleBackToBrowse}
                    className="flex items-center justify-center gap-1 px-4 py-3 rounded-2xl border border-white/15 text-white text-sm"
                  >
                    <RotateCcw size={14} /> Geri
                  </button>
                  <button
                    type="button"
                    onClick={handleReserve}
                    className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/25"
                  >
                    Bu masanı rezerv et <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browse bottom stats */}
      {phase === 'browse' && (
        <div className="absolute bottom-4 left-0 right-0 z-20 px-4 pointer-events-none">
          <div className="max-w-lg mx-auto flex justify-center gap-3">
            {[
              { label: 'Boş', value: availableCount, color: 'text-emerald-400' },
              { label: 'Cəmi', value: floorTables.length, color: 'text-white/60' },
            ].map((s) => (
              <div key={s.label} className="pres-glass rounded-xl px-4 py-2 text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Restaurant3DExperience;
