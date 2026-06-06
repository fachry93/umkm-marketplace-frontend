import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Award, Clock } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { TransaksiAPI } from '../../../data/repositories/TransaksiAPI';
import { StatusBadge } from '../../components/ui/StatusBadge';
import toast from 'react-hot-toast';

export default function TransaksiDetailPage() {
  const { id } = useParams();
  const [trx, setTrx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const res = await TransaksiAPI.getById(id);
      if (res.success && res.data) {
        setTrx(res.data);
      } else {
        toast.error('Transaksi tidak ditemukan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      const res = await TransaksiAPI.updateStatus(id, status);
      if (res.success) {
        toast.success(`Status transaksi diperbarui menjadi ${status}`);
        setTrx(prev => ({ ...prev, status }));
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
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat detail transaksi...</span>
      </div>
    );
  }

  if (!trx) {
    return (
      <div className="text-center p-8 bg-white border border-stone-200 rounded-2xl">
        <h3 className="font-display font-bold text-stone-850">Transaksi tidak ditemukan</h3>
        <Link to="/admin/transaksi" className="text-xs text-primary-600 font-sans font-bold mt-2 hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Kembali ke daftar
        </Link>
      </div>
    );
  }

  const dateStr = new Date(trx.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(trx.total_harga);

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl">
        
        {/* Back Link */}
        <div>
          <Link to="/admin/transaksi" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-sans font-bold">
            <ArrowLeft size={14} /> Kembali ke Kelola Transaksi
          </Link>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-850">Detail Transaksi #{trx.id_transaksi}</h2>
            <span className="text-xs text-stone-400 font-sans">Dipesan pada: {dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-stone-500">Status Saat Ini:</span>
            <StatusBadge status={trx.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Purchased Items & Price Summary */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Items Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
              <h3 className="text-xs font-sans font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-3">
                <ShoppingBag size={14} className="text-primary-600" /> Item Pembelian
              </h3>

              <div className="divide-y divide-stone-100">
                {trx.detail_transaksi?.map((item) => (
                  <div key={item.id_detail} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-150 flex-shrink-0">
                      <img src={item.produk?.gambar} alt={item.produk?.nama_produk} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans font-bold text-stone-900 text-xs truncate">{item.produk?.nama_produk}</h4>
                        {item.produk?.umkm && (
                          <span className="text-[10px] text-primary-600 font-sans font-semibold">🏪 {item.produk.umkm.nama_umkm}</span>
                        )}
                        <p className="text-[11px] text-stone-400 font-sans mt-0.5">
                          {item.jumlah} barang &bull; {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.produk?.harga)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-sans font-bold text-stone-750">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal Calculation */}
              <div className="border-t border-stone-150 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-stone-500 font-sans">
                  <span>Subtotal Belanja</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500 font-sans">
                  <span>Biaya Pengiriman</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
                <hr className="border-stone-100" />
                <div className="flex justify-between items-center text-sm font-sans font-bold text-stone-900 pt-1">
                  <span>Total Pembayaran</span>
                  <span className="text-primary-650 text-base">{formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Center & Customer Info Card */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Order Action Center */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-sans font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <Clock size={14} className="text-primary-600" /> Proses Transaksi
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleUpdateStatus('diproses')}
                  className="w-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors font-sans font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  Proses Transaksi
                </button>
                <button
                  onClick={() => handleUpdateStatus('selesai')}
                  className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors font-sans font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  Selesaikan Transaksi
                </button>
                <button
                  onClick={() => handleUpdateStatus('dibatalkan')}
                  className="w-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors font-sans font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  Batalkan Transaksi
                </button>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-sans font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <User size={14} className="text-primary-600" /> Kontak Pelanggan
              </h3>

              <div className="space-y-3 text-xs font-sans text-stone-600">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-stone-400" />
                  <span className="font-bold text-stone-850">{trx.user?.nama}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-stone-400" />
                  <span>{trx.user?.no_hp}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-stone-400 mt-0.5" />
                  <span className="leading-relaxed">{trx.user?.alamat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-stone-400" />
                  <span>Bayar: <strong>{trx.metode_pembayaran}</strong></span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}
