import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Users, DollarSign, Receipt, Eye, RefreshCcw, TrendingUp, ArrowRight } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { UmkmAPI } from '../../../data/repositories/UmkmAPI';
import { ProdukAPI } from '../../../data/repositories/ProdukAPI';
import { TransaksiAPI } from '../../../data/repositories/TransaksiAPI';
import { AdminAPI } from '../../../data/repositories/AdminAPI';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUmkm: 0,
    totalProduk: 0,
    totalUsers: 0,
    totalTrx: 0,
    revenue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [umkmRes, produkRes, trxRes, usersRes] = await Promise.all([
        UmkmAPI.getAll(),
        ProdukAPI.getAll(),
        TransaksiAPI.getAll(),
        AdminAPI.getAllUsers()
      ]);

      const umkmList = umkmRes.data || umkmRes || [];
      const produkList = produkRes.data || produkRes || [];
      const trxList = trxRes.data || trxRes || [];
      const usersList = usersRes.data || usersRes || [];

      const completedTrx = trxList.filter(t => t.status === 'selesai');
      const totalRevenue = completedTrx.reduce((acc, curr) => acc + Number(curr.total_harga), 0);

      setStats({
        totalUmkm: umkmList.length,
        totalProduk: produkList.length,
        totalUsers: usersList.length,
        totalTrx: trxList.length,
        revenue: totalRevenue
      });

      setRecentTransactions(trxList.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-6">Initializing Nexus...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total UMKM', val: stats.totalUmkm, icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Katalog Produk', val: stats.totalProduk, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Basis Pengguna', val: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Pesanan', val: stats.totalTrx, icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <PageTransition>
      <div className="space-y-12">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-black text-stone-900 leading-tight">
              Dashboard <span className="text-primary-600">Overview.</span>
            </h1>
            <p className="text-sm text-stone-400 font-bold uppercase tracking-widest mt-2">Sistem Monitoring Terpadu UMKM Wongsorejo</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadDashboardData}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-stone-100 shadow-premium text-[10px] font-black uppercase tracking-widest text-stone-600 hover:text-primary-600 transition-all"
          >
            <RefreshCcw size={16} /> Segarkan Data
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-premium group hover:border-primary-200 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <card.icon size={22} />
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <h3 className="text-4xl font-display font-black text-stone-900 tracking-tight">{card.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* Revenue Banner */}
        <div className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600/5 rounded-full blur-[80px] -ml-32 -mb-32" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                <DollarSign size={12} /> Financial Analytics
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black leading-tight">
                Total Pendapatan <br /> <span className="text-primary-500">Selesai.</span>
              </h2>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 text-center md:text-right">
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-4">Current Balance</p>
              <h3 className="font-display font-black text-4xl md:text-5xl tracking-tight">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.revenue)}
              </h3>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
                <Receipt size={20} />
              </div>
              <h2 className="font-display text-3xl font-black text-stone-900">Aktivitas Terbaru.</h2>
            </div>
            <Link to="/admin/transaksi">
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] group"
              >
                Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <div className="bg-white rounded-[3rem] border border-stone-100 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] border-b border-stone-50">
                    <th className="px-10 py-6">ID Transaksi</th>
                    <th className="px-10 py-6">Pelanggan</th>
                    <th className="px-10 py-6">Tanggal</th>
                    <th className="px-10 py-6">Total Bayar</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 text-sm font-sans">
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-10 py-20 text-center text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                        Sistem belum mendeteksi aktivitas transaksi.
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((trx) => (
                      <tr key={trx.id_transaksi} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <span className="font-black text-stone-900">#{trx.id_transaksi}</span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-black text-[10px]">
                              {trx.user?.nama?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="font-bold text-stone-700">{trx.user?.nama || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-stone-500 font-medium">
                            {new Date(trx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="font-black text-primary-600">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(trx.total_harga)}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <StatusBadge status={trx.status} />
                        </td>
                        <td className="px-10 py-6 text-center">
                          <Link to={`/admin/transaksi/${trx.id_transaksi}`}>
                            <button className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                              <Eye size={18} />
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
