import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Grid3x3, BarChart3, Settings, Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { reservations, tables } = useApp();

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const pages = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, keywords: 'panel əsas' },
    { label: 'Rezervasiyalar', path: '/reservations', icon: Calendar, keywords: 'rezervasiya booking' },
    { label: 'Gözləmə Siyahısı', path: '/waitlist', icon: Users, keywords: 'waitlist gözləmə' },
    { label: 'Masa Planı', path: '/floor-plan', icon: Grid3x3, keywords: 'masa plan floor' },
    { label: 'Analitika', path: '/analytics', icon: BarChart3, keywords: 'statistika hesabat' },
    { label: 'Tənzimləmələr', path: '/settings', icon: Settings, keywords: 'settings parametr' },
  ];

  const results = useMemo(() => {
    if (!query.trim()) return { pages, reservations: [], tables: [] };

    const q = query.toLowerCase();
    const matchedPages = pages.filter(p =>
      p.label.toLowerCase().includes(q) || p.keywords.includes(q)
    );
    const matchedReservations = reservations.filter(r =>
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.id.toLowerCase().includes(q)
    ).slice(0, 5);
    const matchedTables = tables.filter(t =>
      t.number.includes(q) || t.zone?.toLowerCase().includes(q)
    ).slice(0, 5);

    return { pages: matchedPages, reservations: matchedReservations, tables: matchedTables };
  }, [query, reservations, tables]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-[70]"
          >
            <div className="bg-white rounded-2xl shadow-premium-xl border border-slate-200/80 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <Search size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Səhifə, rezervasiya, masa axtarın..."
                  className="flex-1 border-0 ring-0 focus:ring-0 p-0 text-base bg-transparent placeholder:text-slate-400"
                />
                <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-100 rounded-md">ESC</kbd>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.pages.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Səhifələr</p>
                    {results.pages.map((page) => (
                      <button
                        key={page.path}
                        onClick={() => handleSelect(page.path)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                          <page.icon size={18} className="text-primary-600" />
                        </div>
                        <span className="flex-1 font-medium text-slate-700">{page.label}</span>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {results.reservations.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rezervasiyalar</p>
                    {results.reservations.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect('/reservations')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {r.tableNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-700 truncate">{r.customerName}</p>
                          <p className="text-xs text-slate-500">{r.time} • {r.partySize} nəfər</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {results.tables.length > 0 && (
                  <div>
                    <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Masalar</p>
                    {results.tables.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect('/floor-plan')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-700 font-bold text-sm">
                          {t.number}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">Masa {t.number}</p>
                          <p className="text-xs text-slate-500">{t.zone} • {t.capacity} nəfər</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {query && results.pages.length === 0 && results.reservations.length === 0 && results.tables.length === 0 && (
                  <p className="text-center py-8 text-slate-400 text-sm">Nəticə tapılmadı</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
