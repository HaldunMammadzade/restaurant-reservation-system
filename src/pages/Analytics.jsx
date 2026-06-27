import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users, Clock, DollarSign, Download, Star, Layers, UserCircle, PieChart, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/analytics/RevenueChart';
import TopTablesChart from '../components/analytics/TopTablesChart';
import PeakHoursChart from '../components/analytics/PeakHoursChart';
import { useApp } from '../context/AppContext';
import { formatCurrency, downloadFile } from '../utils/helpers';
import toast from 'react-hot-toast';

const insightIcons = {
  layers: Layers, dollar: DollarSign, clock: Clock, users: UserCircle, star: Star,
};
const impactColors = { 'Yüksək': 'bg-rose-50 text-rose-700 ring-rose-200', 'Orta': 'bg-amber-50 text-amber-700 ring-amber-200' };

const cardColors = { blue: 'border-l-blue-500 bg-blue-50/50', green: 'border-l-emerald-500 bg-emerald-50/50', purple: 'border-l-indigo-500 bg-indigo-50/50', amber: 'border-l-amber-500 bg-amber-50/50' };

const Analytics = () => {
  const { analytics, sourceAnalytics, branches } = useApp();
  const [chartType, setChartType] = useState('area');
  const [dateRange, setDateRange] = useState('7days');

  const chartData = useMemo(() => {
    const key = dateRange === '30days' ? 'monthly' : dateRange === '90days' || dateRange === 'year' ? 'yearly' : 'daily';
    return analytics.chartData[key] || analytics.chartData.daily;
  }, [analytics, dateRange]);

  const { stats, topTables, peakHours, operationalInsights } = analytics;
  const recommendations = operationalInsights || analytics.aiRecommendations || [];

  const handleExport = () => {
    const csv = ['Tarix,Rezervasiyalar,Gəlir', ...chartData.map((d) => `${d.date},${d.reservations},${d.revenue}`)].join('\n');
    downloadFile(new Blob([csv], { type: 'text/csv' }), `seatmind-hesabat-${dateRange}.csv`);
    toast.success('Hesabat yükləndi!');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Analitika" subtitle="Gəlir, doluluq və operativ göstəricilər"
        action={
          <div className="flex gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white">
              <option value="7days">Son 7 gün</option>
              <option value="30days">Son 30 gün</option>
              <option value="90days">Son 90 gün</option>
              <option value="year">Bu il</option>
            </select>
            <Button variant="primary" icon={<Download size={16} />} onClick={handleExport}>Hesabat Yüklə</Button>
          </div>
        } />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Ümumi Rezervasiyalar" value={stats.totalReservations} change="+12%" icon={Calendar} gradient="from-blue-500 to-blue-600" delay={0} />
        <StatCard title="Doluluq Dərəcəsi" value={`${stats.occupancyRate}%`} change="+8%" icon={Users} gradient="from-emerald-500 to-emerald-600" delay={0.08} />
        <StatCard title="Ümumi Gəlir" value={formatCurrency(stats.revenue)} change="+18%" icon={DollarSign} gradient="from-blue-500 to-blue-600" delay={0.16} />
        <StatCard title="Orta Xidmət Vaxtı" value={`${stats.avgServiceTime} dəq`} change="-8%" icon={Clock} gradient="from-amber-500 to-orange-600" delay={0.24} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex gap-2">
            {['line', 'area'].map((type) => (
              <button key={type} onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${chartType === type ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                {type === 'line' ? 'Xətt' : 'Sahə'}
              </button>
            ))}
          </div>
          <RevenueChart data={chartData} type={chartType} />
        </div>
        <Card title="Əsas Göstəricilər" subtitle="Bu ayın xülasəsi" premium delay={0.3}>
          <div className="space-y-3">
            {[
              { label: 'Orta Qonaq Sayı', value: stats.avgPartySize, icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
              { label: 'No-Show Dərəcəsi', value: `${stats.noShowRate}%`, icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { label: 'Təkrar Müştəri', value: `${stats.repeatCustomers}%`, icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
              { label: 'Məmnuniyyət', value: `${stats.satisfaction}/5`, icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-3.5 ${item.bg} rounded-xl`}>
                <div><p className="text-xs text-slate-500">{item.label}</p><p className="text-xl font-bold text-slate-800">{item.value}</p></div>
                <item.icon size={24} className={item.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TopTablesChart data={topTables} />
        <PeakHoursChart data={peakHours} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Rezervasiya mənbələri" subtitle="Kanal üzrə paylanma" premium>
          <div className="space-y-2">
            {sourceAnalytics.map((src) => {
              const pct = Math.round((src.count / (stats.totalReservations || 1)) * 100);
              return (
                <div key={src.source} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-800">{src.label}</span>
                    <span className="text-xs text-slate-500">{src.count} rez · {formatCurrency(src.estimatedRevenue)}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{pct}% · {src.vipCount} VIP</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Filial müqayisəsi" subtitle="Çox filial performansı" premium>
          <div className="space-y-2">
            {branches.map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.address} · {b.staff} işçi</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{formatCurrency(b.revenue)}</p>
                  <p className="text-[10px] text-slate-400">{b.occupancy}% doluluq · {b.reservations} rez</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Operativ qeydlər" subtitle="Doluluq və gəlir üzrə tövsiyələr" premium delay={0.4}
        headerAction={<span className="text-xs font-medium text-slate-500">{recommendations.length} qeyd</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => {
            const InsightIcon = insightIcons[rec.icon] || Layers;
            return (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
              className={`p-4 rounded-xl border-l-[3px] ${cardColors[rec.color]}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                    <InsightIcon size={16} className="text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">{rec.title}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ring-1 ${impactColors[rec.impact]}`}>{rec.impact}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
            </motion.div>
          );})}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
