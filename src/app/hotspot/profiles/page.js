'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { ShieldCheck, Gauge, Users, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function UserProfiles({ onOpenMobileMenu }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mikrotik/profiles');
      const json = await res.json();
      if (json.success) setProfiles(json.data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Hotspot User Profiles" onRefresh={loadProfiles} onOpenMobileMenu={onOpenMobileMenu} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-slate-500">Memuat profil hotspot...</div>
          ) : (
            profiles.map((p) => (
              <div key={p['.id'] || p.name} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base sm:text-lg">{p.name}</h4>
                      <span className="text-xs text-slate-400">Profile Hotspot</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
                    {formatCurrency(p.sellingPrice || p.price || 0)}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Gauge className="w-4 h-4 text-cyan-400" />
                      Rate Limit:
                    </span>
                    <span className="font-mono font-bold text-white">{p['rate-limit'] || 'Unlimited'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-4 h-4 text-blue-400" />
                      Shared Users:
                    </span>
                    <span className="font-mono font-bold text-white">{p['shared-users'] || '1'} Device</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Tag className="w-4 h-4 text-amber-400" />
                      Harga Modal:
                    </span>
                    <span className="font-mono font-bold text-slate-300">{formatCurrency(p.price || 0)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
