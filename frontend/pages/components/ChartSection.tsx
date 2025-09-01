// Renders the portfolio allocation and performance charts.

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#FACC15', '#A16207', '#EAB308', '#78350F', '#FDE047', '#D97706', '#FCD34D', '#CA8A04', '#FBBF24', '#B45309', '#F97316', '#F59E0B'];

const ChartSection = ({ portfolio }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const sectorSummaries = useMemo(() => {
    if (!portfolio) return {} as Record<string, { investment: number; presentValue: number; gainLoss: number }>;
    const summaries: Record<string, { investment: number; presentValue: number; gainLoss: number }> = {};
    for (const stock of portfolio) {
      if (!summaries[stock.sector]) {
        summaries[stock.sector] = { investment: 0, presentValue: 0, gainLoss: 0 };
      }
      summaries[stock.sector].investment += stock.investment ?? 0;
      summaries[stock.sector].presentValue += stock.presentValue ?? 0;
      summaries[stock.sector].gainLoss += stock.gainLoss ?? 0;
    }
    return summaries;
  }, [portfolio]);

  const pieData = useMemo(
    () => Object.entries(sectorSummaries).map(([sector, s]) => ({ name: sector, value: s.presentValue })),
    [sectorSummaries]
  );

  const barData = useMemo(
    () => Object.entries(sectorSummaries).map(([sector, s]) => ({ sector, gainLoss: s.gainLoss })),
    [sectorSummaries]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 force-black">Portfolio Allocation by Sector</h2>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <ReTooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 force-black">Sector Performance (Gain/Loss)</h2>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis />
              <ReTooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="gainLoss">
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={(entry.gainLoss ?? 0) >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
