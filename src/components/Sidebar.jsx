'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Ticket, Activity, Settings, ShieldCheck, Wifi, FileText, X } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';

export const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Hotspot Users', href: '/hotspot/users', icon: Users },
  { name: 'Generate Voucher', href: '/hotspot/generate', icon: Ticket },
  { name: 'Active Connections', href: '/hotspot/active', icon: Activity },
  { name: 'User Profiles', href: '/hotspot/profiles', icon: ShieldCheck },
  { name: 'Cetak Voucher', href: '/hotspot/print', icon: FileText },
  { name: 'Router Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo & Close for Mobile */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                MIKHMON
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Mobile Ready</p>
            </div>
          </div>

          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-xs min-w-0">
            <p className="text-slate-300 font-semibold truncate">Demo Router API</p>
            <p className="text-slate-500 truncate">Connected (Mock Mode)</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl border-r border-slate-800 z-50 flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
