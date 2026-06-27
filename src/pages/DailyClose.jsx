import React from 'react';
import {
  DollarSign, Users, TrendingDown, Receipt, Download, Printer,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';
import { formatCurrency, downloadFile } from '../utils/helpers';
import toast from 'react-hot-toast';

const DailyClose = () => {
  const { dailyClose: z, restaurant, operationsBriefing, serverTips, staff } = useApp();

  const tipRows = Object.entries(serverTips || {}).map(([id, amount]) => ({
    id, amount, name: staff.find((s) => s.id === id)?.name || id,
  })).sort((a, b) => b.amount - a.amount);
  const totalTips = tipRows.reduce((sum, r) => sum + r.amount, 0);

  const handleExport = () => {
    const lines = [
      `Gün Sonu Hesabatı — ${restaurant.name}`,
      `Tarix: ${new Date().toLocaleDateString('az-AZ')}`,
      '',
      `Ümumi gəlir,${z.totalGross}`,
      `Rezervasiya gəliri,${z.reservationRevenue}`,
      `Masa sifarişləri,${z.tableOrderRevenue}`,
      `Walk-in,${z.walkInRevenue}`,
      `Depozitlər,${z.depositsToday}`,
      `Xidmət olunan cover,${z.coversServed}`,
      `Orta çek,${z.avgCheck}`,
      `No-show,${z.noShows}`,
      `No-show itirilmiş,${z.lostNoShow}`,
    ];
    downloadFile(new Blob([lines.join('\n')], { type: 'text/csv' }), `gun-sonu-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Hesabat yükləndi');
  };

  const handlePrint = () => {
    const html = `<html><head><title>Gün Sonu</title><style>body{font-family:system-ui;padding:24px;font-size:13px}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px;border-bottom:1px solid #eee}.total{font-weight:bold;font-size:16px}</style></head><body>
<h1>${restaurant.name}</h1><p>Gün sonu hesabatı · ${new Date().toLocaleDateString('az-AZ')}</p>
<table>
<tr><td>Ümumi gəlir</td><td class="total">${formatCurrency(z.totalGross)}</td></tr>
<tr><td>Rezervasiya gəliri</td><td>${formatCurrency(z.reservationRevenue)}</td></tr>
<tr><td>Masa sifarişləri (POS)</td><td>${formatCurrency(z.tableOrderRevenue)}</td></tr>
<tr><td>Walk-in təxmini</td><td>${formatCurrency(z.walkInRevenue)}</td></tr>
<tr><td>Depozitlər (tədbir)</td><td>${formatCurrency(z.depositsToday)}</td></tr>
<tr><td colspan="2"><hr/></td></tr>
<tr><td>Xidmət olunan cover</td><td>${z.coversServed}</td></tr>
<tr><td>Orta çek</td><td>${formatCurrency(z.avgCheck)}</td></tr>
<tr><td>Rezervasiya (cəmi/check-in/tamamlanan)</td><td>${z.reservationsTotal} / ${z.checkedIn} / ${z.completed}</td></tr>
<tr><td>No-show (${z.noShows})</td><td>-${formatCurrency(z.lostNoShow)}</td></tr>
<tr><td>Proqnoz fərqi</td><td>${formatCurrency(z.forecastDelta)}</td></tr>
<tr><td>Açıq masa</td><td>${z.openTables}</td></tr>
<tr><td>86 məhsul</td><td>${z.unavailableItems}</td></tr>
</table></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gün Sonu Z-Hesabat"
        subtitle="Kassir/menecer üçün günün maliyyə xülasəsi — dəqiq hesablanmış"
        action={
          <div className="flex gap-2">
            <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>CSV</Button>
            <Button variant="primary" icon={<Printer size={16} />} onClick={handlePrint}>Çap et</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-premium border-l-4 border-l-emerald-500">
          <p className="text-xs text-slate-500">Ümumi gəlir</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(z.totalGross)}</p>
          <p className="text-xs text-slate-400 mt-1">Proqnoz: {formatCurrency(operationsBriefing?.totalForecast || 0)}</p>
        </div>
        <div className="card-premium">
          <p className="text-xs text-slate-500">Cover xidmət</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{z.coversServed}</p>
          <p className="text-xs text-slate-400 mt-1">Orta çek {formatCurrency(z.avgCheck)}</p>
        </div>
        <div className="card-premium">
          <p className="text-xs text-slate-500">Masa sifarişləri</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(z.tableOrderRevenue)}</p>
          <p className="text-xs text-slate-400 mt-1">Canlı POS</p>
        </div>
        <div className="card-premium">
          <p className="text-xs text-slate-500">No-show itirilmiş</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">-{formatCurrency(z.lostNoShow)}</p>
          <p className="text-xs text-slate-400 mt-1">{z.noShows} no-show</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Gəlir strukturu" premium>
          <div className="space-y-3">
            {[
              { label: 'Rezervasiya gəliri', value: z.reservationRevenue, icon: Receipt, color: 'text-blue-600' },
              { label: 'Masa sifarişləri (POS)', value: z.tableOrderRevenue, icon: DollarSign, color: 'text-emerald-600' },
              { label: 'Walk-in təxmini', value: z.walkInRevenue, icon: Users, color: 'text-slate-600' },
              { label: 'Tədbir depozitləri', value: z.depositsToday, icon: DollarSign, color: 'text-indigo-600' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <row.icon size={16} className={row.color} />
                  <span className="text-sm text-slate-700">{row.label}</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(row.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-sm font-semibold text-emerald-800">CƏMİ</span>
              <span className="text-lg font-bold text-emerald-800">{formatCurrency(z.totalGross)}</span>
            </div>
          </div>
        </Card>

        <Card title="Operativ xülasə" premium>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Rezervasiya', value: z.reservationsTotal },
              { label: 'Check-in', value: z.checkedIn },
              { label: 'Tamamlanan', value: z.completed },
              { label: 'Ləğv', value: z.cancelled },
              { label: 'No-show', value: z.noShows },
              { label: 'Açıq masa', value: z.openTables },
              { label: '86 məhsul', value: z.unavailableItems },
              { label: 'Proqnoz Δ', value: formatCurrency(z.forecastDelta) },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-bold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
          {z.lostNoShow > 0 && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-xs text-rose-800">
              <TrendingDown size={16} className="flex-shrink-0 mt-0.5" />
              <span>No-show səbəbindən təxmini <strong>{formatCurrency(z.lostNoShow)}</strong> gəlir itirildi. Sabah üçün depozit tələbini artırmağı düşünün.</span>
            </div>
          )}
        </Card>

        <Card title="Ofisiant tip-ləri" subtitle="Bu günün paylanması" premium>
          <div className="space-y-2">
            {tipRows.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Hələ tip qeydə alınmayıb</p>
            ) : tipRows.map((row) => (
              <div key={row.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-700">{row.name}</span>
                <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span>
              </div>
            ))}
            {tipRows.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-sm font-semibold text-emerald-800">Cəmi tip</span>
                <span className="text-lg font-bold text-emerald-800">{formatCurrency(totalTips)}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyClose;
