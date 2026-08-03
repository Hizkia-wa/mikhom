'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export default function AppWrapper({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Sidebar (Responsive Desktop & Mobile Drawer) */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Pass mobile toggle handler to children/Header via context or props if needed */}
        {children({ onOpenMobileMenu: () => setIsMobileMenuOpen(true) })}
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
