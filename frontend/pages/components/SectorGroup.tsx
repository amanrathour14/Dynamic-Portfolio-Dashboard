// Renders an expandable sector group row.

import React from 'react';
import PortfolioRow from './PortfolioRow';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const SectorGroup = ({ sector, stocks, summary, isExpanded, onToggleExpand }) => {
  return (
    <React.Fragment>
      <tr className="bg-gray-100/80 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => onToggleExpand(sector)}>
        <td colSpan={9} className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className={`h-4 w-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6a1 1 0 011.707-.707l4 4a1 1 0 010 1.414l-4 4A1 1 0 016 13.586L9.586 10 6 6.414A1 1 0 016 6z" clipRule="evenodd" />
              </svg>
              <span>{sector}</span>
            </div>
            <span className="text-xs text-gray-500">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
          </div>
        </td>
      </tr>
      {isExpanded && stocks.map(stock => (
        <PortfolioRow key={stock.symbol} stock={stock} />
      ))}
      <tr className="bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">Total for {sector}</td>
        <td colSpan={2} className="px-6 py-4 text-right whitespace-nowrap text-sm font-semibold text-gray-800">{formatCurrency(summary.investment)}</td>
        <td colSpan={2} className="px-6 py-4 text-right whitespace-nowrap text-sm font-semibold text-gray-800">{formatCurrency(summary.presentValue)}</td>
        <td colSpan={4} className={`px-6 py-4 text-right whitespace-nowrap text-sm font-semibold ${summary.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(summary.gainLoss)}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SectorGroup;