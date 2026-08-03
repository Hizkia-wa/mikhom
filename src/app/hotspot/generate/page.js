'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Ticket, Sparkles, Printer } from 'lucide-react';
import VoucherCard from '@/components/VoucherCard';

export default function GenerateVoucher({ onOpenMobileMenu }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedVouchers, setGeneratedVouchers] = useState([]);

  const [form, setForm] = useState({
    qty: 6,
    prefix: 'vc',
    length: 5,
    type: 'mix',
    profile: '1-JAM-5K',
    limitUptime: '1h',
    limitBytes: '',
    commentPrefix: 'gen'
  });

  useEffect(() => {
    fetch('/api/mikrotik/profiles')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProfiles(json.data);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/mikrotik/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedVouchers(json.vouchers);
      } else {
        alert('Gagal generate voucher: ' + json.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Generate Voucher Massal" onOpenMobileMenu={onOpenMobileMenu} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Buat Voucher Massal</h3>
                <p className="text-xs text-slate-400">Generate kode voucher otomatis</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Jumlah Voucher (Qty)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Prefix Kode</label>
                  <input
                    type="text"
                    value={form.prefix}
                    onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="misal: vc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Panjang Kode</label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={form.length}
                    onChange={(e) => setForm({ ...form, length: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kombinasi Karakter</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="mix">Campuran (Huruf & Angka)</option>
                  <option value="num">Angka Saja (0-9)</option>
                  <option value="alpha">Huruf Kecil Saja</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Profile Hotspot</label>
                <select
                  value={form.profile}
                  onChange={(e) => setForm({ ...form, profile: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  {profiles.map((p) => (
                    <option key={p['.id'] || p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Batas Waktu (Limit Uptime)</label>
                <input
                  type="text"
                  value={form.limitUptime}
                  onChange={(e) => setForm({ ...form, limitUptime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="misal: 1h, 3h, 1d"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate Voucher Sekarang'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Preview Voucher Terbuat</h3>
                <p className="text-xs text-slate-400">Total: {generatedVouchers.length} Voucher</p>
              </div>

              {generatedVouchers.length > 0 && (
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Print
                </button>
              )}
            </div>

            {generatedVouchers.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2 border-2 border-dashed border-slate-800 rounded-xl p-4 text-center">
                <Ticket className="w-12 h-12 stroke-[1.5]" />
                <p className="text-sm font-medium">Belum ada voucher yang dibuat pada sesi ini.</p>
                <p className="text-xs">Isi form di atas lalu klik "Generate".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-2 justify-items-center">
                {generatedVouchers.map((v, i) => (
                  <VoucherCard key={i} code={v.code} password={v.password} profile={v.profile} price="5000" />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
