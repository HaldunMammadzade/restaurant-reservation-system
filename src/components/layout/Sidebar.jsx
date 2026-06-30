import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Grid3x3, BarChart3, Settings,
  LogOut, Users, UserCircle, UtensilsCrossed, QrCode, PartyPopper,
  ChefHat, MessageSquare, ClipboardList, ConciergeBell, Receipt,
  CreditCard, ListChecks, Award, AlertCircle, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { useSelector } from 'react-redux';
import Logo from '../common/Logo';
import { filterNavByRole } from '../../utils/roleAccess';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { todayReservations, waitlist, upcomingEvents, occupancyRate, user, incidents } = useApp();
  const { currentRestaurant } = useSelector((state) => state.restaurant);

  const menuItems = filterNavByRole([
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/operations', icon: ClipboardList, label: 'Operativ Mərkəz' },
    { path: '/hostess', icon: ConciergeBell, label: 'Qəbul Masası', badge: todayReservations.filter((r) => r.status === 'confirmed').length },
    { path: '/reservations', icon: Calendar, label: 'Rezervasiyalar', badge: todayReservations.length },
    { path: '/events', icon: PartyPopper, label: 'Tədbirlər', badge: upcomingEvents.length },
    { path: '/waitlist', icon: Users, label: 'Gözləmə', badge: waitlist.length },
    { path: '/floor-plan', icon: Grid3x3, label: 'Masa Planı' },
    { path: '/billing', icon: CreditCard, label: 'Kassa' },
    { path: '/kitchen', icon: ChefHat, label: 'Mətbəx / Expo' },
    { path: '/prep', icon: ListChecks, label: 'Prep Siyahısı' },
    { path: '/customers', icon: UserCircle, label: 'Müştərilər' },
    { path: '/loyalty', icon: Award, label: 'Loyalty' },
    { path: '/menu', icon: UtensilsCrossed, label: 'Menyu' },
    { path: '/staff', icon: Users, label: 'Personal' },
    { path: '/incidents', icon: AlertCircle, label: 'Incidentlər', badge: (incidents || []).filter((i) => i.status === 'open').length },
    { path: '/communications', icon: MessageSquare, label: 'Mesajlar' },
    { path: '/daily-close', icon: Receipt, label: 'Gün Sonu' },
    { path: '/analytics', icon: BarChart3, label: 'Analitika' },
    { path: '/settings', icon: Settings, label: 'Tənzimləmələr' },
  ], user?.role || 'admin');

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-sidebar transform transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <Logo size="md" className="[&_h1]:text-white [&_p]:text-slate-400" />
          </div>

          <div className="px-3 py-3">
            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Restoran</p>
              <p className="text-sm font-medium text-white truncate">{currentRestaurant?.name || 'Nizami Garden'}</p>
              <p className="text-xs text-slate-400 mt-1">{occupancyRate}% doluluq · {user?.role || 'admin'}</p>
            </div>
          </div>

          <nav className="flex-1 px-2 overflow-y-auto">
            <ul className="space-y-0.5">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'nav-item-active' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }>
                    <item.icon size={17} className="flex-shrink-0" />
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-white/15 text-white rounded-md min-w-[18px] text-center">{item.badge}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3 border-t border-white/10 space-y-1">
            <NavLink to="/teqdimat" target="_blank"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-colors">
              <Sparkles size={14} /> Təqdimat Demo
            </NavLink>
            {currentRestaurant?.qrCode && (
              <NavLink to={`/book/${currentRestaurant.qrCode}`} target="_blank"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs">
                <QrCode size={14} /> QR Rezervasiya
              </NavLink>
            )}
            <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm">
              <LogOut size={16} /> Çıxış
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
