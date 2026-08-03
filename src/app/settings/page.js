'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Settings, Server, Key, Save, CheckCircle2 } from 'lucide-react';

export default function RouterSettings({ onOpenMobileMenu }) {
  const [config, setConfig] = useState({
    host: '192.168.88.1',
    port: '8728',
    username: 'admin',
    password: '',
    hotspotName: 'My Hotspot',
    currency: 'Rp',
    mode: 'mock'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Pengaturan Router & Koneksi" onOpenMobileMenu={onOpenMobileMenu} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto max-w-4xl">
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Koneksi MikroTik RouterOS</h3>
                <p className="text-xs text-slate-400">Atur parameter koneksi API RouterOS</p>
              </div>
            </div>

            {saved && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                Tersimpan!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Mode Koneksi</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, mode: 'mock' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    config.mode === 'mock'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  Mock Demo Mode (Offline)
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, mode: 'real' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    config.mode === 'real'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  Router MikroTik Fisik (Live API)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">IP Router / Hostname</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="192.168.88.1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Port API RouterOS</label>
                <input
                  type="text"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="8728"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Username Router</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password Router</label>
                <input
                  type="password"
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
              >
                <Save className="w-4 h-4" />
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
