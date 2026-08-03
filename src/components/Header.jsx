'use client';

import { useState } from 'react';
import { Menu, Router, RefreshCw } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';

export default function Header({ title = 'Dashboard', onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { openMobileMenu } = useMobileMenu();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={openMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Router Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Router className="w-4 h-4 text-emerald-400" />
          <span>hEX S (RB760iGS)</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0">
            M
          </div>
          <span className="text-sm font-semibold text-slate-200 hidden md:block">mikhmon</span>
        </div>
      </div>
    </header>
  );
}
