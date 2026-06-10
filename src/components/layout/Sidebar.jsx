import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Grid3x3, 
  BarChart3, 
  Settings, 
  LogOut,
  ChefHat,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { todayReservations, waitlist } = useApp();
  const { currentRestaurant } = useSelector((state) => state.restaurant);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/reservations', icon: Calendar, label: 'Rezervasiyalar', badge: todayReservations.length },
    { path: '/waitlist', icon: Users, label: 'Gözləmə Siyahısı', badge: waitlist.length },
    { path: '/floor-plan', icon: Grid3x3, label: 'Masa Planı' },
    { path: '/analytics', icon: BarChart3, label: 'Analitika' },
    { path: '/settings', icon: Settings, label: 'Tənzimləmələr' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-sidebar transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-sm">
                <ChefHat size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SeatMind</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles size={10} className="text-primary-300" />
                  <p className="text-[11px] text-slate-400 font-medium">AI Restaurant OS</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 font-medium">Restoran</p>
              <p className="text-sm font-semibold text-white mt-0.5 truncate">
                {currentRestaurant?.name || 'Nizami Garden'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="live-dot" />
                <span className="text-xs text-emerald-400 font-medium">Aktiv</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'nav-item-active'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-white rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="px-3 py-3 mb-2 rounded-xl bg-gradient-to-r from-primary-600/20 to-violet-600/20 border border-primary-500/20">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary-300" />
                <span className="text-xs font-semibold text-primary-200">AI Aktiv</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Bu axşam doluluq 92% olacaq
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Çıxış</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
