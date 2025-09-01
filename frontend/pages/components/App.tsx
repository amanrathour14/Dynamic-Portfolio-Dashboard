// The top-level component that renders the dashboard.

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioTable from './PortfolioTable';
// Recharts is not SSR-friendly; load ChartSection only on client
const ChartSection = dynamic(() => import('./ChartSection'), { ssr: false });
import KPIs from './KPIs';
import usePortfolioPolling from '../../hooks/usePortfolioPolling';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBanner from './ErrorBanner';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  const { portfolio, loading, error, refresh } = usePortfolioPolling();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = saved ? saved === 'dark' : prefersDark;
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    } catch {}
    // Mark mounted after theme sync, ensuring SSR and first client paint match
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next);
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
      }
      return next;
    });
  };

  const totals = useMemo(() => {
    if (!portfolio) return { totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 };
    return portfolio.reduce((acc, stock) => ({
      totalInvestment: acc.totalInvestment + stock.investment,
      totalPresentValue: acc.totalPresentValue + stock.presentValue,
      totalGainLoss: acc.totalGainLoss + stock.gainLoss
    }), { totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 });
  }, [portfolio]);

  // On SSR we render LoadingSkeleton; ensure first client render matches until mounted
  if (!mounted || (loading && !portfolio)) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <Header onRefresh={refresh} loading={!!loading} isDark={isDark} onToggleTheme={toggleTheme} />
        <main className="p-8">
          <div className="container mx-auto">
            <ErrorBanner title="Failed to fetch data" message={String(error)} onRetry={refresh} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 font-sans">
      <Header onRefresh={refresh} loading={!!loading} isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="p-8">
        <div className="container mx-auto">
          <KPIs
            totals={totals}
            loading={!!loading}
            onRefresh={refresh}
            onAction={() => {
              // Open the backend data source and refresh values
              if (typeof window !== 'undefined') {
                try { window.open('/api/portfolio', '_blank'); } catch {}
              }
              refresh();
            }}
          />
          <ChartSection portfolio={portfolio} />
          <PortfolioTable portfolio={portfolio} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
