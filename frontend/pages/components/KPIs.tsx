import React from 'react';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const KPIs = ({ totals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="relative overflow-hidden rounded-xl shadow-md border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-indigo-700">Total Investment</h2>
            <p className="text-3xl font-extrabold text-indigo-900 mt-1">{formatCurrency(totals.totalInvestment)}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-indigo-600 text-white grid place-items-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M11.25 3.104a.75.75 0 01.75 0l7.5 4.33a.75.75 0 01.375.649v6.834a.75.75 0 01-.375.649l-7.5 4.33a.75.75 0 01-.75 0l-7.5-4.33A.75.75 0 013 14.917V8.083a.75.75 0 01.375-.649l7.5-4.33z"/></svg>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl shadow-md border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-violet-700">Current Value</h2>
            <p className="text-3xl font-extrabold text-violet-900 mt-1">{formatCurrency(totals.totalPresentValue)}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-violet-600 text-white grid place-items-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM11.47 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06l-2.47-2.47V16.5a.75.75 0 01-1.5 0V10.06l-2.47 2.47a.75.75 0 11-1.06-1.06l3.75-3.75z" clipRule="evenodd"/></svg>
          </div>
        </div>
      </div>
      <div className={`relative overflow-hidden rounded-xl shadow-md border ${totals.totalGainLoss >= 0 ? 'border-emerald-100 from-emerald-50' : 'border-rose-100 from-rose-50'} bg-gradient-to-br to-white p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-sm font-medium ${totals.totalGainLoss >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Total Gain/Loss</h2>
            <p className={`text-3xl font-extrabold mt-1 ${totals.totalGainLoss >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
              {formatCurrency(totals.totalGainLoss)}
            </p>
          </div>
          <div className={`h-12 w-12 rounded-lg text-white grid place-items-center shadow ${totals.totalGainLoss >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {totals.totalGainLoss >= 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm3.53 7.72a.75.75 0 10-1.06-1.06L11.25 12.13 9.53 10.41a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm3.53 10.78a.75.75 0 10-1.06-1.06l-2.22 2.22-2.22-2.22a.75.75 0 00-1.06 1.06l2.22 2.22-2.22 2.22a.75.75 0 101.06 1.06l2.22-2.22 2.22 2.22a.75.75 0 001.06-1.06l-2.22-2.22 2.22-2.22z" clipRule="evenodd"/></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIs;



