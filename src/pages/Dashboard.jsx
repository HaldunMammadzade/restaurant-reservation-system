import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Grid3x3,
  BarChart3,
  ArrowRight,
  MessageSquare,
  PartyPopper,
  ChefHat,
  Printer,
  ClipboardList,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TodayBanner from '../components/dashboard/TodayBanner';
import Badge from '../components/common/Badge';
import { formatCurrency } from '../utils/helpers';
import { mockAnalytics } from '../utils/mockData';
import { useApp } from '../context/AppContext';
import { printTodayRunSheet } from '../utils/runSheet';
import toast from 'react-hot-toast';
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS } from '../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { todayReservations, tables, occupancyRate, upcomingEvents, automations, smsLogs, reservations, events, waitlist, restaurant } = useApp();
  const stats = mockAnalytics.stats;
  const chartData = mockAnalytics.chartData.daily;

  const statsCards = [
    {
      title: 'Bugünkü Rezervasiyalar',
      value: todayReservations.length,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Doluluq Dərəcəsi',
      value: `${occupancyRate}%`,
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+5%',
    },
    {
      title: 'Gəlir (Bu Ay)',
      value: formatCurrency(stats.revenue),
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-600',
      change: '+18%',
    },
    {
      title: 'Orta Xidmət Vaxtı',
      value: `${stats.avgServiceTime} dəq`,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      change: '-8%',
    },
  ];

  const quickActions = [
    { label: 'Yeni Rezervasiya', icon: Calendar, color: 'bg-blue-100 text-blue-600', path: '/reservations' },
    { label: 'Tədbir Planla', icon: PartyPopper, color: 'bg-pink-100 text-pink-600', path: '/events' },
    { label: 'Masa Planı', icon: Grid3x3, color: 'bg-emerald-100 text-emerald-600', path: '/floor-plan' },
    { label: 'Operativ Mərkəz', icon: ClipboardList, color: 'bg-indigo-100 text-indigo-600', path: '/operations' },
    { label: 'Mətbəx', icon: ChefHat, color: 'bg-orange-100 text-orange-600', path: '/kitchen' },
    { label: 'Mesajlar', icon: MessageSquare, color: 'bg-slate-100 text-slate-600', path: '/communications' },
  ];

  const handlePrintRunSheet = () => {
    const ok = printTodayRunSheet({ restaurant, reservations, events, waitlist, tables });
    if (!ok) toast.error('Çap pəncərəsi bloklanıb — brauzer icazəsi verin');
  };

  const tableStatus = {
    available: { label: 'Boş', color: 'bg-emerald-500', count: tables.filter(t => t.status === 'available').length },
    occupied: { label: 'Dolu', color: 'bg-rose-500', count: tables.filter(t => t.status === 'occupied').length },
    reserved: { label: 'Rezerv', color: 'bg-amber-500', count: tables.filter(t => t.status === 'reserved').length },
    cleaning: { label: 'Təmizlənir', color: 'bg-slate-400', count: tables.filter(t => t.status === 'cleaning').length },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Restoranınızın real-time statistikası"
        badge="Canlı"
        action={
          <button onClick={handlePrintRunSheet} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Printer size={16} /> Günün run sheet
          </button>
        }
      />

      <TodayBanner />

      <Card title="Avtomatik tapşırıqlar" subtitle="Planlaşdırılmış və real-time işlər" premium delay={0.05}
        headerAction={<span className="text-xs font-medium text-slate-500">{automations.filter((a) => a.status === 'active').length} aktiv</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {automations.map((auto) => (
            <div key={auto.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${auto.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{auto.label}</p>
                <p className="text-[10px] text-slate-400">{auto.time} · {auto.count} element</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${auto.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {auto.status === 'active' ? 'Aktiv' : 'Planlanır'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {statsCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.08} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card 
          title="Bugünkü Rezervasiyalar" 
          className="lg:col-span-2"
          premium
          delay={0.3}
          headerAction={
            <button onClick={() => navigate('/reservations')} className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              Hamısı <ArrowRight size={14} />
            </button>
          }
        >
          <div className="space-y-2">
            {todayReservations.length > 0 ? (
              todayReservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer group"
                  onClick={() => navigate('/reservations')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{reservation.tableNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm">{reservation.customerName}</h4>
                        {reservation.vip && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">VIP</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {reservation.partySize} nəfər • {reservation.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={RESERVATION_STATUS_COLORS[reservation.status]}>
                      {RESERVATION_STATUS_LABELS[reservation.status]}
                    </Badge>
                    {reservation.status === 'confirmed' ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-500" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Bugün rezervasiya yoxdur</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Masa Statusu" premium delay={0.35}>
          <div className="space-y-3">
            {Object.entries(tableStatus).map(([key, status]) => (
              <div key={key} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${status.color} rounded-full`} />
                  <span className="text-sm text-slate-600 font-medium">{status.label}</span>
                </div>
                <span className="text-xl font-bold text-slate-800">{status.count}</span>
              </div>
            ))}
            <div className="pt-3 mt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-semibold">Cəmi Masa</span>
                <span className="text-xl font-bold text-primary-600">{tables.length}</span>
              </div>
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Gəlir Trendi" subtitle="Son 7 gün" className="lg:col-span-2" premium delay={0.4}>
          <div className="h-[220px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(d) => new Date(d).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' })}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [formatCurrency(value), 'Gəlir']}
                  labelFormatter={(d) => new Date(d).toLocaleDateString('az-AZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Canlı Aktivlik" subtitle="Son əməliyyatlar" premium delay={0.45}>
          <ActivityFeed limit={5} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Yaxınlaşan Tədbirlər" premium delay={0.48}
          headerAction={<button onClick={() => navigate('/events')} className="text-sm text-primary-600 font-semibold flex items-center gap-1">Hamısı <ArrowRight size={14} /></button>}>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 4).map((ev) => (
              <div key={ev.id} onClick={() => navigate('/events')} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.partySize} nəfər · {ev.startTime}</p>
                </div>
                <span className="text-xs font-bold text-primary-600">{Math.round((ev.checklist?.filter(c => c.done).length / ev.checklist?.length) * 100) || 0}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Son SMS / Bildirişlər" premium delay={0.5}
          headerAction={<MessageSquare size={16} className="text-primary-500" />}>
          <div className="space-y-2">
            {smsLogs.slice(0, 4).map((sms) => (
              <div key={sms.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{sms.to}</span>
                  <span className="text-emerald-600">{sms.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{sms.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Tez Əməliyyatlar" premium delay={0.52}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-3 p-5 bg-slate-50 hover:bg-white rounded-2xl transition-all duration-300 hover:shadow-premium border border-transparent hover:border-slate-200 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center group-hover:text-slate-800">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
