import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { TransaksiAPI } from '../../../data/repositories/TransaksiAPI';
import { StatusBadge } from '../../components/ui/StatusBadge';
import toast from 'react-hot-toast';

export default function TransaksiAdminPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Semua');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [statusFilter, transactions]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await TransaksiAPI.getAll();
      setTransactions(Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (statusFilter === 'Semua') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === statusFilter.toLowerCase()));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await TransaksiAPI.updateStatus(id, status);
      if (res.success) {
        toast.success(`Status transaksi #${id} diperbarui menjadi ${status}`);
        setTransactions(prev =>
          prev.map(t => t.id_transaksi === id ? { ...t, status } : t)
        );
      } else {
        toast.error(res.message || 'Gagal merubah status');
      }
    } catch (err) {
      toast.error('Gagal merubah status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat data transaksi...</span>
      </div>
    );
  }

  const filters = ['Semua', 'Pending', 'Diproses', 'Selesai', 'Dibatalkan'];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
            <Receipt size={24} className="text-primary-600" /> Kelola Transaksi
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">Pantau pesanan masuk dan atur alur pemrosesan.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all border ${
                  statusFilter === f
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={loadTransactions}
            className="flex items-center gap-1.5 text-xs font-sans font-bold text-stone-600 hover:text-stone-800 self-end sm:self-auto"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-150">
            <h3 className="font-display font-bold text-stone-800 text-sm">
              {filteredTransactions.length} Transaksi Ditemukan
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Metode</th>
                  <th className="px-6 py-3">Total Pembayaran</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Atur Status</th>
                  <th className="px-6 py-3 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-stone-400">
                      Tidak ada transaksi dengan status terpilih.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id_transaksi} className="hover:bg-stone-50/50">
                      <td className="px-6 py-4 font-semibold text-stone-900">#{trx.id_transaksi}</td>
                      <td className="px-6 py-4 font-bold">{trx.user?.nama || 'User'}</td>
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
                      <td className="px-6 py-4">
                        <select
                          value={trx.status}
                          onChange={(e) => handleUpdateStatus(trx.id_transaksi, e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none cursor-pointer text-stone-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="diproses">Diproses</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Batal</option>
                        </select>
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
    </PageTransition>
  );
}
