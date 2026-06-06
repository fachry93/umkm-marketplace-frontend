import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trash2, Eye, Calendar } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { AdminAPI } from '../../../data/repositories/AdminAPI';
import toast from 'react-hot-toast';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.getAllUsers();
      setUsers(res.data || res || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat daftar pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Semua transaksi terkait juga mungkin akan terhapus.')) {
      return;
    }

    try {
      const res = await AdminAPI.deleteUser(id);
      if (res.success) {
        toast.success('Pengguna berhasil dihapus');
        setUsers(prev => prev.filter(u => u.id_user !== id));
      } else {
        toast.error(res.message || 'Gagal menghapus pengguna');
      }
    } catch (err) {
      toast.error('Gagal menghapus pengguna');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat daftar pengguna...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
            <Users size={24} className="text-primary-600" /> Kelola Pengguna
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">Lihat dan hapus akun pembeli di sistem.</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-150">
            <h3 className="font-display font-bold text-stone-800 text-sm">{users.length} Total Pengguna</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">No. WhatsApp</th>
                  <th className="px-6 py-3">Alamat</th>
                  <th className="px-6 py-3">Terdaftar</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                      Belum ada pengguna terdaftar.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id_user} className="hover:bg-stone-50/50">
                      <td className="px-6 py-4 font-bold text-stone-900">{u.nama}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{u.no_hp || '-'}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{u.alamat || '-'}</td>
                      <td className="px-6 py-4 flex items-center gap-1 mt-1 border-none">
                        <Calendar size={12} className="text-stone-400" />
                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-center space-x-1">
                        <Link to={`/admin/users/${u.id_user}`}>
                          <button className="p-1.5 rounded-lg hover:bg-stone-150 text-stone-500 hover:text-stone-700 transition-colors">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(u.id_user)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
