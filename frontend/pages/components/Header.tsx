import React from 'react';

export default function Header({
  onRefresh,
  loading,
  isDark,
  onToggleTheme,
}: {
  onRefresh: () => void;
  loading: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Dynamic Portfolio Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="px-3 py-2 rounded-md bg-white/20 text-white hover:bg-white/25 transition shadow border border-white/20"
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3A.75.75 0 0112 2.25zm0 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.72 4.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L4.72 5.78a.75.75 0 010-1.06zm12.44 12.44a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM2.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H3A.75.75 0 012.25 12zm15 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zM4.72 19.28a.75.75 0 000-1.06l1.06-1.06a.75.75 0 111.06 1.06L5.78 19.28a.75.75 0 01-1.06 0zm12.44-12.44a.75.75 0 000-1.06l1.06-1.06a.75.75 0 111.06 1.06L18.22 6.84a.75.75 0 01-1.06 0z" clipRule="evenodd"/>
              </svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M21.752 15.002A9.718 9.718 0 0112 21.75C6.615 21.75 2.25 17.385 2.25 12c0-4.421 3.11-8.1 7.252-9.002a.75.75 0 01.832 1.02A8.25 8.25 0 0012 20.25a8.25 8.25 0 008.232-7.666.75.75 0 011.02-.832 9.67 9.67 0 01.5 3.25z" />
              </svg>
            )}
          </button>

          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-md bg-white text-indigo-700 font-medium shadow hover:bg-indigo-50 transition dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
}
