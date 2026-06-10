import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Command } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/helpers';
import CommandPalette from './CommandPalette';
import NotificationPanel from './NotificationPanel';

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const { unreadCount, occupancyRate } = useApp();
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={22} className="text-slate-600" />
            </button>
            
            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-800">
                  {currentRestaurant?.name || 'Restaurant'}
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full ring-1 ring-emerald-200">
                  {occupancyRate}% dolu
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTime.toLocaleDateString('az-AZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCommandOpen(true)}
            className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-6 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all group"
          >
            <Search size={16} className="text-slate-400" />
            <span className="text-sm text-slate-400 flex-1 text-left">Axtarış...</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-white rounded-md border border-slate-200">
              <Command size={10} />K
            </kbd>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Search size={20} className="text-slate-600" />
            </button>

            <button
              onClick={() => { setNotifOpen(!notifOpen); setCommandOpen(false); }}
              className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bell size={20} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">{user?.role || 'Manager'}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                {getInitials(user?.name || 'Admin')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};

export default Header;
