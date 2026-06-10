import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const TopTablesChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">Masa {label}</p>
          <p className="text-sm text-primary">Rezervasiyalar: {payload[0].value}</p>
          <p className="text-sm text-green-600">Gəlir: {payload[1].value} AZN</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Ən Populyar Masalar" subtitle="Rezervasiya və gəlirə görə">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="tableNumber" stroke="#6B7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="reservations" fill="#4F46E5" radius={[8, 8, 0, 0]} name="Rezervasiyalar" />
          <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} name="Gəlir (AZN)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopTablesChart;
