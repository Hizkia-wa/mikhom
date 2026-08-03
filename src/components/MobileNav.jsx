'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Ticket, Activity, Settings } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const mobileTabs = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/hotspot/users', icon: Users },
    { name: 'Voucher', href: '/hotspot/generate', icon: Ticket },
    { name: 'Active', href: '/hotspot/active', icon: Activity },
    { name: 'Setting', href: '/settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-40 px-2 flex items-center justify-around">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full h-full py-1 text-[11px] font-semibold transition-all ${
              isActive
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
