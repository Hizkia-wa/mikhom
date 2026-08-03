'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Search, Plus, Trash2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export default function HotspotUsers({ onOpenMobileMenu }) {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    profile: '1-JAM-5K',
    limitUptime: '',
    comment: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, pRes] = await Promise.all([
        fetch('/api/mikrotik/users').then(r => r.json()),
        fetch('/api/mikrotik/profiles').then(r => r.json())
      ]);

      if (uRes.success) setUsers(uRes.data);
      if (pRes.success) setProfiles(pRes.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus user ${name}?`)) return;
    try {
      const res = await fetch(`/api/mikrotik/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setUsers(users.filter(u => u['.id'] !== id && u.name !== name));
      }
    } catch (err) {
      alert('Gagal menghapus user: ' + err.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mikrotik/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        setFormData({ name: '', password: '', profile: '1-JAM-5K', limitUptime: '', comment: '' });
        loadData();
      }
    } catch (err) {
      alert('Gagal menambah user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.comment?.toLowerCase().includes(search.toLowerCase());
    const matchProfile = selectedProfile === 'all' || u.profile === selectedProfile;
    return matchSearch && matchProfile;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Hotspot Users" onRefresh={loadData} onOpenMobileMenu={onOpenMobileMenu} />

      <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari user / voucher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Profile</option>
              {profiles.map((p) => (
                <option key={p['.id'] || p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">User / Kode Voucher</th>
                  <th className="p-4">Profile</th>
                  <th className="p-4">Uptime</th>
                  <th className="p-4">Download / Upload</th>
                  <th className="p-4">Komentar</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Memuat data user hotspot...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Tidak ada user ditemukan.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user['.id'] || user.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{user.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs">
                          {user.profile}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-400">{user.uptime || '0s'}</td>
                      <td className="p-4 text-xs font-mono">
                        <span className="text-emerald-400">{formatBytes(user['bytes-in'] || 0)}</span> / <span className="text-blue-400">{formatBytes(user['bytes-out'] || 0)}</span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">{user.comment || '-'}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(user['.id'] || user.name, user.name)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Tambah Hotspot User Baru</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Username / Kode Voucher</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="misal: user123"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="Kosongkan jika samakan dengan username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Profile</label>
                  <select
                    value={formData.profile}
                    onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {profiles.map((p) => (
                      <option key={p['.id'] || p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Komentar / Catatan</label>
                  <input
                    type="text"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="misal: pelanggan_a"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
