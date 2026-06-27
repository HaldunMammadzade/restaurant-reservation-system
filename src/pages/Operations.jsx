import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator, Users, DollarSign, Clock, AlertTriangle, Crown,
  Banknote, RefreshCw, UtensilsCrossed, ArrowRight, TrendingUp,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { RESERVATION_STATUS_LABELS } from '../utils/constants';
import { printTodayRunSheet } from '../utils/runSheet';
import toast from 'react-hot-toast';

const Operations = () => {
  const {
    operationsBriefing: b, restaurant, reservations, events, waitlist, tables,
    seatFromWaitlist, sendReservationReminder,
  } = useApp();

  const pacingChart = useMemo(() => b.pacing.map((p) => ({
    time: p.time,
    Qonaq: p.covers,
    limit: p.capacity,
  })), [b.pacing]);

  const handlePrint = () => {
    const ok = printTodayRunSheet({ restaurant, reservations, events, waitlist, tables });
    if (!ok) toast.error('Çap pəncərəsi bloklanıb');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operativ Mərkəz"
        subtitle="Bu gecə üçün dəqiq hesablamalar — gəlir, risk, personal və masa dövriyyəsi"
        badge="Canlı"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>Run sheet çap</Button>
            <Link to="/floor-plan"><Button variant="primary" icon={<ArrowRight size={16} />}>Masa planı</Button></Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gecə proqnozu', value: formatCurrency(b.totalForecast), sub: `${b.covers} rezerv · orta çek ${formatCurrency(b.avgCheckTonight)}`, icon: DollarSign, bg: 'bg-emerald-50 text-emerald-700' },
          { label: 'Canlı gəlir (masada)', value: formatCurrency(b.liveRevenue), sub: `${b.walkInCovers} walk-in qonaq`, icon: TrendingUp, bg: 'bg-blue-50 text-blue-700' },
          { label: 'No-show riski', value: formatCurrency(b.noShowExposure), sub: `${b.noShowAlerts.length} rezervasiya`, icon: AlertTriangle, bg: 'bg-amber-50 text-amber-700' },
          { label: 'Dövriyyə potensialı', value: formatCurrency(b.turnRecoveryPotential), sub: `${b.turnAlerts.filter((t) => t.overdue).length} masa gecikir`, icon: RefreshCw, bg: 'bg-rose-50 text-rose-700' },
        ].map((m) => (
          <div key={m.label} className="card-premium">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{m.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{m.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                <m.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card title="Cover pacing" subtitle="Saat üzrə doluluq vs kapasitet limiti" className="xl:col-span-2" premium>
          {pacingChart.length > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pacingChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(v) => [`${v} qonaq`, 'Covers']}
                  />
                  <ReferenceLine y={b.peakSlot?.capacity || 48} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Limit', fontSize: 10, fill: '#EF4444' }} />
                  <Bar dataKey="Qonaq" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">Bu gün rezervasiya yoxdur</p>
          )}
          {b.peakSlot && (
            <p className="text-xs text-slate-500 mt-2">
              Pik: <strong>{b.peakSlot.time}</strong> — {b.peakSlot.covers}/{b.peakSlot.capacity} qonaq ({b.peakSlot.utilization}%)
              {b.peakSlot.overbooked && <span className="text-rose-600 font-semibold ml-2">Overbook!</span>}
            </p>
          )}
        </Card>

        <Card title="Personal yüklənməsi" premium>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Növbədə ofisiant</span>
                <span className="font-bold">{b.onDutyStaff}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Dolu masa / ofisiant</span>
                <span className={`font-bold ${b.tablesPerServer > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>{b.tablesPerServer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tövsiyə olunan (1:4)</span>
                <span className="font-bold">{Math.ceil(b.turnAlerts.length / 4) || b.onDutyStaff}</span>
              </div>
            </div>
            {b.staffingGap > 0 ? (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800">
                <strong>+{b.staffingGap} ofisiant</strong> lazımdır — hazırda hər ofisiant {b.tablesPerServer} masaya xidmət edir.
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800">
                Personal yüklənməsi optimaldır.
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-600">Mərtəbə üzrə</p>
              {b.floorBreakdown.map((fb) => (
                <div key={fb.floor.id} className="flex justify-between text-xs">
                  <span className="text-slate-600">{fb.floor.shortName} · {fb.coversTonight} cover</span>
                  <span className="font-semibold">{fb.rate}% dolu</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="VIP gəlişlər" subtitle={`${b.vipArrivals.length} VIP bu gecə`} premium
          headerAction={<Crown size={16} className="text-amber-500" />}>
          <div className="space-y-2">
            {b.vipArrivals.length ? b.vipArrivals.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.customerName}</p>
                  <p className="text-xs text-slate-500">{r.time} · {r.partySize} nəfər · Masa {r.tableNumber || '—'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">VIP</span>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-6">VIP rezervasiya yoxdur</p>}
          </div>
        </Card>

        <Card title="No-show risk monitorinqi" subtitle="CRM tarixçəsinə əsasən" premium>
          <div className="space-y-2">
            {b.noShowAlerts.length ? b.noShowAlerts.slice(0, 6).map(({ reservation: r, risk, atRiskRevenue }) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold ${
                  risk >= 40 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <span>{risk}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{r.customerName}</p>
                  <p className="text-xs text-slate-500">{r.time} · risk: {formatCurrency(atRiskRevenue)}</p>
                </div>
                <button
                  onClick={() => { sendReservationReminder(r.id); toast.success('Xatırlatma SMS göndərildi'); }}
                  className="text-xs font-medium text-primary-600 hover:underline flex-shrink-0"
                >
                  SMS
                </button>
              </div>
            )) : <p className="text-sm text-emerald-600 text-center py-6">Yüksək riskli rezervasiya yoxdur</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Masa dövriyyəsi" subtitle="Gecikən masalar — əlavə gəlir itirilir" premium>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {b.turnAlerts.slice(0, 8).map(({ table, elapsed, remaining, urgent, overdue, nextTurnRevenue }) => (
              <div key={table.id} className={`flex items-center justify-between p-3 rounded-xl border ${overdue ? 'bg-rose-50 border-rose-100' : urgent ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <p className="text-sm font-semibold">Masa {table.number} · {table.guestName || 'Qonaq'}</p>
                  <p className="text-xs text-slate-500">{elapsed} dəq oturub · {remaining > 0 ? `${remaining} dəq qalıb` : 'vaxt bitib'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700">+{formatCurrency(nextTurnRevenue)}</p>
                  <p className="text-[10px] text-slate-400">növbəti turn</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/kitchen" className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 mt-3 hover:underline">
            Mətbəx panelinə keç <ArrowRight size={12} />
          </Link>
        </Card>

        <Card title="Gözləmə → optimal masa" subtitle="Avtomatik uyğunlaşdırma" premium>
          <div className="space-y-2">
            {b.waitlistMatches.length ? b.waitlistMatches.map(({ entry, table, floor }) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{entry.customerName} · {entry.partySize} nəfər</p>
                  <p className="text-xs text-slate-500">{entry.waitTime} dəq gözləyir → Masa {table.number} ({floor?.shortName})</p>
                </div>
                <Button size="small" variant="primary" onClick={() => { seatFromWaitlist(entry.id, table.id); toast.success('Oturdu'); }}>
                  Otur
                </Button>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-6">Gözləmə siyahısı boşdur</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Depozitlər" premium>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Alınıb</span><span className="font-bold text-emerald-600">{formatCurrency(b.eventDepositsCollected)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gözləyir</span><span className="font-bold text-rose-600">{formatCurrency(b.eventDepositsPending)}</span></div>
            {b.pendingDeposits.map((d, i) => (
              <div key={i} className="text-xs text-slate-500 pt-1 border-t border-slate-100">{d.name} · {formatCurrency(d.amount)}</div>
            ))}
          </div>
        </Card>
        <Card title="Tədbir gəliri" premium>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(b.eventProjected)}</p>
          <p className="text-xs text-slate-500 mt-1">Bu günkü tədbirlər üzrə proqnoz (paket + avg check)</p>
        </Card>
        <Card title="Menyu 86" premium headerAction={<UtensilsCrossed size={16} className="text-rose-500" />}>
          {b.menu86.length ? (
            <>
              <p className="text-sm font-semibold text-rose-700 mb-2">{b.menu86.length} məhsul satışdan çıxarılıb</p>
              <p className="text-xs text-slate-500">{b.menu86.map((m) => m.name).join(', ')}</p>
              <Link to="/menu" className="text-xs text-primary-600 mt-2 inline-block hover:underline">Menyuya keç</Link>
            </>
          ) : (
            <p className="text-sm text-emerald-600">Bütün məhsullar aktivdir</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Operations;
