'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatBits } from '@/lib/utils';

export default function TrafficChart({ interfaceName = 'ether1-WAN' }) {
  const [data, setData] = useState([]);
  const [currentRx, setCurrentRx] = useState(0);
  const [currentTx, setCurrentTx] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/mikrotik/traffic?interface=${interfaceName}`);
        const json = await res.json();
        if (json.success && isMounted) {
          setCurrentRx(json.rx);
          setCurrentTx(json.tx);
          
          setData((prev) => {
            const nextData = [
              ...prev.slice(-14),
              {
                time: json.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                rx: json.rx,
                tx: json.tx,
              }
            ];
            return nextData;
          });
        }
      } catch (err) {
        console.error('Traffic fetch error:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [interfaceName]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Traffic Bandwidth Real-Time</h3>
            <p className="text-xs text-slate-400">Interface: <span className="text-cyan-400 font-medium">{interfaceName}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Rx:</span>
            <span className="font-bold text-emerald-400">{formatBits(currentRx)}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpRight className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Tx:</span>
            <span className="font-bold text-blue-400">{formatBits(currentTx)}</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => formatBits(val, 0)} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              formatter={(value) => [formatBits(value), 'Rate']}
            />
            <Area type="monotone" dataKey="rx" name="Download (Rx)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRx)" />
            <Area type="monotone" dataKey="tx" name="Upload (Tx)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
