'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VoucherCard from '@/components/VoucherCard';
import { Printer } from 'lucide-react';

export default function PrintVouchers({ onOpenMobileMenu }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mikrotik/users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="print:hidden">
        <Header title="Cetak Voucher Hotspot" onRefresh={loadData} onOpenMobileMenu={onOpenMobileMenu} />
      </div>

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Lembar Cetak Voucher</h3>
            <p className="text-xs text-slate-400">Total Voucher Siap Cetak: {users.length}</p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            Print ke Kertas / PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-2 justify-items-center">
          {loading ? (
            <div className="col-span-full text-center py-12 text-slate-500">Memuat voucher...</div>
          ) : (
            users.map((u) => (
              <VoucherCard
                key={u['.id'] || u.name}
                code={u.name}
                password={u.password || u.name}
                profile={u.profile}
                price="5000"
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
