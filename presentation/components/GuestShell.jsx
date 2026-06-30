import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Leaf, Sun, Moon } from 'lucide-react';
import { PRESENTATION_RESTAURANT } from '../data/salonZones';
import { usePresentation } from '../context/PresentationContext';
import AmbientOrbs from './AmbientOrbs';

const GuestShell = ({ children, showBack = false, backTo = '/teqdimat', transparent = false, fullWidth = false }) => {
  const location = useLocation();
  const { timeMode, setTimeMode } = usePresentation();
  const isHome = location.pathname === '/teqdimat' || location.pathname === '/teqdimat/';
  const isNight = timeMode === 'evening';

  return (
    <div className={`presentation-root ${isNight ? 'pres-night' : 'pres-day'}`}>
      <AmbientOrbs />
      <div className={`sticky top-0 z-50 ${transparent ? '' : 'pres-glass'}`}>
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2 min-w-[80px]">
            {showBack && !isHome ? (
              <Link to={backTo} className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </Link>
            ) : (
              <Leaf size={18} className="text-emerald-400" />
            )}
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 font-medium">Reserve</p>
            <p className="text-sm font-semibold text-white">{PRESENTATION_RESTAURANT.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setTimeMode(isNight ? 'day' : 'evening')}
            className="pres-glass min-w-[80px] flex items-center justify-end gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold text-white/80 hover:text-white transition-all"
            title={isNight ? 'Gündüz rejimi' : 'Gecə rejimi'}
          >
            {isNight ? <Moon size={14} className="text-indigo-300" /> : <Sun size={14} className="text-amber-300" />}
            {isNight ? 'Gecə' : 'Gündüz'}
          </button>
        </div>
      </div>
      <main className={fullWidth ? 'w-full' : 'max-w-lg mx-auto min-h-[calc(100dvh-56px)]'}>
        {children}
      </main>
    </div>
  );
};

export default GuestShell;
