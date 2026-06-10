import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

const RevenueChart = ({ data, type = 'area' }) => {
  const formatDate = (d) => new Date(d).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });

  return (
    <Card title="Gəlir Dinamikası" subtitle={`${data.length} günlük statistika`} premium>
      <ResponsiveContainer width="100%" height={320}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Gəlir' : 'Rezervasiya']}
              labelFormatter={formatDate}
            />
            <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4, strokeWidth: 0 }} name="revenue" />
            <Line type="monotone" dataKey="reservations" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }} name="reservations" />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value) => [formatCurrency(value), 'Gəlir']}
              labelFormatter={formatDate}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#colorRevenue)" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
