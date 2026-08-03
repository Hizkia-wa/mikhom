'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import TrafficChart from '@/components/TrafficChart';
import { Users, Activity, Ticket, Cpu, HardDrive, Server, ShieldCheck, Plus } from 'lucide-react';
import { formatBytes, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [resource, setResource] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [profileCount, setProfileCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [resRes, usersRes, activeRes, profilesRes] = await Promise.all([
        fetch('/api/mikrotik/resource').then(r => r.json()),
        fetch('/api/mikrotik/users').then(r => r.json()),
        fetch('/api/mikrotik/active').then(r => r.json()),
        fetch('/api/mikrotik/profiles').then(r => r.json()),
      ]);

      if (resRes.success) setResource(resRes.data);
      if (usersRes.success) setUserCount(usersRes.data.length);
      if (activeRes.success) setActiveCount(activeRes.data.length);
      if (profilesRes.success) setProfileCount(profilesRes.data.length);
    } catch (err) {
      console.error('Failed loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Dashboard Monitor" onRefresh={loadDashboardData} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30">
                MikroTik Hotspot Manager
              </span>
              <span className="text-xs text-slate-400">RouterOS v7.12.1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Selamat Datang di Mikhmon</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">Kelola voucher, pantau pengguna aktif, dan lihat grafik bandwidth secara real-time dari HP maupun Laptop.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/hotspot/generate"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Generate Voucher
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pengguna Aktif"
            value={loading ? '...' : activeCount}
            subtext="Terkoneksi saat ini"
            icon={Activity}
            color="emerald"
          />
          <StatCard
            title="Total Hotspot Users"
            value={loading ? '...' : userCount}
            subtext="User terdaftar di router"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="User Profiles"
            value={loading ? '...' : profileCount}
            subtext="Paket & Limit Kecepatan"
            icon={ShieldCheck}
            color="purple"
          />
          <StatCard
            title="Estimasi Omset"
            value={formatCurrency(userCount * 5000)}
            subtext="Estimasi pendapatan voucher"
            icon={Ticket}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">CPU Load</p>
              <p className="text-base sm:text-lg font-bold text-white">{resource ? `${resource.cpuLoad}%` : '...'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Free Memory</p>
              <p className="text-base sm:text-lg font-bold text-white">{resource ? formatBytes(resource.freeMemory) : '...'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Uptime</p>
              <p className="text-base sm:text-lg font-bold text-white">{resource ? resource.uptime : '...'}</p>
            </div>
          </div>
        </div>

        <TrafficChart interfaceName="ether1-WAN" />
      </main>
    </div>
  );
}
