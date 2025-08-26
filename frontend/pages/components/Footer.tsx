import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-base text-gray-700 dark:text-slate-300">© {new Date().getFullYear()} Dynamic Portfolio Dashboard</p>
        <p className="text-base text-gray-800 dark:text-slate-200 flex items-center gap-2">
          Made by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Aman Rathour</span>
          <span aria-hidden="true" className="text-rose-500">❤️</span>
        </p>
      </div>
    </footer>
  );
}
