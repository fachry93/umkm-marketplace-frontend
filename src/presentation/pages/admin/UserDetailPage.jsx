import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingBag, Eye } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { AdminAPI } from '../../../data/repositories/AdminAPI';
import { TransaksiAPI } from '../../../data/repositories/TransaksiAPI';
import { StatusBadge } from '../../components/ui/StatusBadge';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const [userRes, trxRes] = await Promise.all([
        AdminAPI.getUserById(id),
        TransaksiAPI.getAll()
      ]);

      if (userRes.success) {
        setUserData(userRes.data);
      } else {
        toast.error('Pengguna tidak ditemukan');
      }

      // Filter transactions matching this user
      const allTrx = trxRes.data || trxRes || [];
      const filtered = allTrx.filter(t => t.id_user === parseInt(id));
      setUserTransactions(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat detail pengguna');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat detail pengguna...</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-8 bg-white border border-stone-200 rounded-2xl">
        <h3 className="font-display font-bold text-stone-850">Pengguna tidak ditemukan</h3>
        <Link to="/admin/users" className="text-xs text-primary-600 font-sans font-bold mt-2 hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Kembali ke daftar
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-sans font-bold">
            <ArrowLeft size={14} /> Kembali ke Daftar Pengguna
          </Link>
        </div>

        {/* User Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-stone-100">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold font-display border border-primary-200">
                {userData.nama ? userData.nama.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-display font-bold text-stone-900 leading-tight">{userData.nama}</h3>
                <span className="text-[10px] text-stone-400 font-sans block mt-1">ID Pelanggan #{userData.id_user}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs font-sans text-stone-600">
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-stone-400" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-stone-400" />
                <span>{userData.no_hp || 'No HP belum diisi'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-stone-400 mt-0.5" />
                <span className="leading-relaxed">{userData.alamat || 'Alamat belum diisi'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar size={14} className="text-stone-400" />
                <span>Terdaftar: {new Date(userData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Transactions History Table */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden h-fit">
            <div className="p-5 border-b border-stone-150 flex items-center justify-between">
              <h3 className="font-display font-bold text-stone-800 text-sm">Riwayat Pembelian ({userTransactions.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Metode</th>
                    <th className="px-6 py-3">Total Belanja</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                  {userTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                        Belum ada pembelian dari pengguna ini.
                      </td>
                    </tr>
                  ) : (
                    userTransactions.map((trx) => (
                      <tr key={trx.id_transaksi} className="hover:bg-stone-50/50">
                        <td className="px-6 py-4 font-semibold text-stone-900">#{trx.id_transaksi}</td>
                        <td className="px-6 py-4">
                          {new Date(trx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">{trx.metode_pembayaran}</td>
                        <td className="px-6 py-4 font-bold text-primary-700">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(trx.total_harga)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={trx.status} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/admin/transaksi/${trx.id_transaksi}`}>
                            <button className="p-1.5 rounded-lg hover:bg-stone-150 text-stone-500 hover:text-stone-700 transition-colors">
                              <Eye size={16} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
