// Renders a single row for a stock holding.

import React from 'react';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
const isNumber = (v: any): v is number => typeof v === 'number' && !Number.isNaN(v);

const PortfolioRow = ({ stock }) => {
  return (
    <tr className="odd:bg-gray-50 hover:bg-gray-100 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.name || stock.symbol}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.sector}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{isNumber(stock.investment) ? formatCurrency(stock.investment) : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{isNumber(stock.cmp) ? formatCurrency(stock.cmp) : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{isNumber(stock.presentValue) ? formatCurrency(stock.presentValue) : 'N/A'}</td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${isNumber(stock.gainLoss) && stock.gainLoss < 0 ? 'text-red-600' : 'text-green-600'}`}>{isNumber(stock.gainLoss) ? formatCurrency(stock.gainLoss) : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{isNumber(stock.portfolioPercent) ? `${stock.portfolioPercent.toFixed(2)}%` : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
        {isNumber(stock.pe) ? stock.pe.toFixed(2) : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
        {isNumber(stock.earnings) ? formatCurrency(stock.earnings) : 'N/A'}
      </td>
    </tr>
  );
};

export default PortfolioRow;
