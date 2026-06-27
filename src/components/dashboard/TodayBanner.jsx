import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, PartyPopper, ArrowRight, Calculator, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

const TodayBanner = () => {
  const { todayReservations, upcomingEvents, occupancyRate, waitlist, operationsBriefing: b } = useApp();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bu gecə — hesablanmış proqnoz</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">
            {formatCurrency(b.totalForecast)} gəlir · {b.covers} cover · {occupancyRate}% doluluq
          </p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            {b.noShowAlerts.length > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <AlertTriangle size={12} /> {b.noShowAlerts.length} no-show riski
              </span>
            )}
            {b.staffingGap > 0 && (
              <span className="text-rose-600">+{b.staffingGap} ofisiant lazım</span>
            )}
            {waitlist.length > 0 && (
              <span>{waitlist.length} gözləyən</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/operations" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
            <Calculator size={14} /> Operativ mərkəz
          </Link>
          <Link to="/reservations" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            <Calendar size={14} /> {todayReservations.length} rezerv
          </Link>
          {upcomingEvents.length > 0 && (
            <Link to="/events" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <PartyPopper size={14} /> {upcomingEvents.length} tədbir
            </Link>
          )}
          <Link to="/floor-plan" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            Masa planı <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TodayBanner;
