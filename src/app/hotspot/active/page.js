'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Activity, UserX } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export default function ActiveConnections({ onOpenMobileMenu }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActive = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mikrotik/active');
      const json = await res.json();
      if (json.success) setActiveUsers(json.data);
    } catch (err) {
      console.error('Error fetching active users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActive();
    const interval = setInterval(loadActive, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleKick = async (id, user) => {
    if (!confirm(`Putuskan koneksi (Kick) user ${user}?`)) return;
    try {
      const res = await fetch(`/api/mikrotik/active?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setActiveUsers(activeUsers.filter(a => a['.id'] !== id && a.user !== user));
      }
    } catch (err) {
      alert('Gagal disconnect user');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Pengguna Aktif" onRefresh={loadActive} onOpenMobileMenu={onOpenMobileMenu} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Live Connected Devices</h3>
              <p className="text-xs text-slate-400">Terhubung saat ini: <span className="font-bold text-emerald-400">{activeUsers.length} Devices</span></p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">MAC Address</th>
                  <th className="p-4">Uptime Sesi</th>
                  <th className="p-4">Download / Upload</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading && activeUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Memuat koneksi aktif...</td>
                  </tr>
                ) : activeUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Tidak ada koneksi aktif saat ini.</td>
                  </tr>
                ) : (
                  activeUsers.map((item) => (
                    <tr key={item['.id'] || item.user} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="truncate">{item.user}</span>
                      </td>
                      <td className="p-4 text-xs font-mono text-cyan-400">{item.address || '-'}</td>
                      <td className="p-4 text-xs font-mono text-slate-400">{item['mac-address'] || '-'}</td>
                      <td className="p-4 text-xs font-mono text-slate-300">{item.uptime || '0s'}</td>
                      <td className="p-4 text-xs font-mono">
                        <span className="text-emerald-400">{formatBytes(item['bytes-in'] || 0)}</span> / <span className="text-blue-400">{formatBytes(item['bytes-out'] || 0)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleKick(item['.id'] || item.user, item.user)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                          title="Disconnect User"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Kick
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
