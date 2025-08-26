// Renders the main portfolio table with sector grouping.

import React, { useState, useMemo } from 'react';
import SectorGroup from './SectorGroup';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type StockRow = {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  cmp: number | null;
  investment: number;
  presentValue: number | null;
  gainLoss: number | null;
  portfolioPercent: number | null;
  peRatio: number | null;
  earnings: number | null;
};

const PortfolioTable = ({ portfolio }) => {
  const [expandedSectors, setExpandedSectors] = useState(new Set<string>());
  const toggleExpand = (sector: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      next.has(sector) ? next.delete(sector) : next.add(sector);
      return next;
    });
  };

  const data: StockRow[] = useMemo(() => (portfolio ?? []) as StockRow[], [portfolio]);

  const columns = useMemo<ColumnDef<StockRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Stock' },
      { accessorKey: 'sector', header: 'Sector' },
      { accessorKey: 'investment', header: 'Investment', cell: (info) => (info.getValue<number>()).toLocaleString('en-IN') },
      { accessorKey: 'cmp', header: 'CMP' },
      { accessorKey: 'presentValue', header: 'Present Value' },
      { accessorKey: 'gainLoss', header: 'Gain/Loss' },
      { accessorKey: 'portfolioPercent', header: '% Allocation', cell: (info) => `${(info.getValue<number>() ?? 0).toFixed(2)}%` },
      { accessorKey: 'peRatio', header: 'P/E' },
      { accessorKey: 'earnings', header: 'Earnings' },
    ],
    []
  );

  // Create a table instance (for future sorting/filtering); we still custom-render grouped rows
  useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const groupedBySector = useMemo(() => {
    return (portfolio ?? []).reduce((acc: Record<string, StockRow[]>, stock: StockRow) => {
      (acc[stock.sector] = acc[stock.sector] || []).push(stock);
      return acc;
    }, {} as Record<string, StockRow[]>);
  }, [portfolio]);

  const sectorSummaries = useMemo(() => {
    const summaries: Record<string, { investment: number; presentValue: number; gainLoss: number }> = {};
    for (const stock of (portfolio ?? [])) {
      if (!summaries[stock.sector]) {
        summaries[stock.sector] = { investment: 0, presentValue: 0, gainLoss: 0 };
      }
      summaries[stock.sector].investment += stock.investment ?? 0;
      summaries[stock.sector].presentValue += stock.presentValue ?? 0;
      summaries[stock.sector].gainLoss += stock.gainLoss ?? 0;
    }
    return summaries;
  }, [portfolio]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detailed Holdings</h2>
      <div className="overflow-x-auto rounded-md">
        <div className="max-h-[480px] overflow-y-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {String(col.header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(groupedBySector).map((sector) => (
                <SectorGroup
                  key={sector}
                  sector={sector}
                  stocks={groupedBySector[sector]}
                  summary={sectorSummaries[sector]}
                  isExpanded={expandedSectors.has(sector)}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;