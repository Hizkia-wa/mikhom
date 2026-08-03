'use client';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { MobileMenuProvider } from '@/context/MobileMenuContext';

export default function AppLayoutClient({ children }) {
  return (
    <MobileMenuProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          {children}
        </div>

        <MobileNav />
      </div>
    </MobileMenuProvider>
  );
}
