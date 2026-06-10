import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users, Clock, DollarSign, Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/analytics/RevenueChart';
import TopTablesChart from '../components/analytics/TopTablesChart';
import PeakHoursChart from '../components/analytics/PeakHoursChart';
import { mockAnalytics } from '../utils/mockData';
import { formatCurrency, downloadFile } from '../utils/helpers';
import toast from 'react-hot-toast';

const impactColors = {
  Yüksək: 'bg-rose-50 text-rose-700 ring-rose-200',
  Orta: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const cardColors = {
  blue: 'border-l-blue-500 bg-blue-50/50',
  green: 'border-l-emerald-500 bg-emerald-50/50',
  purple: 'border-l-violet-500 bg-violet-50/50',
  amber: 'border-l-amber-500 bg-amber-50/50',
};

const Analytics = () => {
  const [chartType, setChartType] = useState('area');
  const [dateRange, setDateRange] = useState('7days');

  const stats = mockAnalytics.stats;
  const chartData = useMemo(() => {
    switch (dateRange) {
      case '30days': return mockAnalytics.chartData.monthly;
      case '90days':
      case 'year': return mockAnalytics.chartData.yearly;
      default: return mockAnalytics.chartData.daily;
    }
  }, [dateRange]);

  const handleExport = () => {
    const csv = [
      'Tarix,Rezervasiyalar,Gəlir',
      ...chartData.map(d => `${d.date},${d.reservations},${d.revenue}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, `seatmind-hesabat-${dateRange}.csv`);
    toast.success('Hesabat yükləndi!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analitika"
        subtitle="Restoranınızın detallı statistikası və AI tövsiyələri"
        badge="AI Aktiv"
        action={
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="7days">Son 7 gün</option>
              <option value="30days">Son 30 gün</option>
              <option value="90days">Son 90 gün</option>
              <option value="year">Bu il</option>
            </select>
            <Button variant="primary" icon={<Download size={16} />} onClick={handleExport}>
              Hesabat Yüklə
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Ümumi Rezervasiyalar" value={stats.totalReservations} change="+12%" icon={Calendar} gradient="from-blue-500 to-blue-600" delay={0} />
        <StatCard title="Doluluq Dərəcəsi" value={`${stats.occupancyRate}%`} change="+8%" icon={Users} gradient="from-emerald-500 to-emerald-600" delay={0.08} />
        <StatCard title="Ümumi Gəlir" value={formatCurrency(stats.revenue)} change="+18%" icon={DollarSign} gradient="from-violet-500 to-purple-600" delay={0.16} />
        <StatCard title="Orta Xidmət Vaxtı" value={`${stats.avgServiceTime} dəq`} change="-8%" icon={Clock} gradient="from-amber-500 to-orange-600" delay={0.24} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <div className="flex gap-2 mb-3">
            {['line', 'area'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  chartType === type ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type === 'line' ? 'Xətt Qrafiki' : 'Sahə Qrafiki'}
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
              { label: 'Təkrar Müştəri', value: `${stats.repeatCustomers}%`, icon: Users, bg: 'bg-violet-50', color: 'text-violet-600' },
              { label: 'Məmnuniyyət', value: `${stats.satisfaction}/5`, icon: Sparkles, bg: 'bg-amber-50', color: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-3.5 ${item.bg} rounded-xl`}>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-xl font-bold text-slate-800">{item.value}</p>
                </div>
                <item.icon size={24} className={item.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TopTablesChart data={mockAnalytics.topTables} />
        <PeakHoursChart data={mockAnalytics.peakHours} />
      </div>

      <Card title="AI Tövsiyələri" subtitle="SeatMind AI tərəfindən generasiya edilib" premium delay={0.4}
        headerAction={
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-violet-50 text-violet-700 rounded-full">
            <Sparkles size={12} /> 4 tövsiyə
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAnalytics.aiRecommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`p-4 rounded-xl border-l-[3px] ${cardColors[rec.color]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{rec.icon}</span>
                  <h4 className="font-semibold text-slate-800 text-sm">{rec.title}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ring-1 ${impactColors[rec.impact]}`}>
                  {rec.impact}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
