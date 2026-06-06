import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, User, Phone, MapPin, QrCode, ShoppingBag, ArrowLeft, Hash, Receipt, Truck, MessageCircle } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { useTransaksi } from '../../hooks/useTransaksi';
import { QrisAPI } from '../../../data/repositories/QrisAPI';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { QrisModal } from '../../components/ui/QrisModal';
import { motion } from 'framer-motion';

// WhatsApp Admin Configuration
const WHATSAPP_ADMIN_NUMBER = '6287853847272';
const getWhatsAppUrl = (trx) => {
  const message = trx 
    ? `Halo admin, saya ingin bertanya tentang pesanan #${trx.id_transaksi} (Status: ${trx.status}). Mohon informasi lebih lanjut.`
    : `Halo admin, saya membutuhkan bantuan terkait produk Marketplace UMKM Wongsorejo.`;
  return `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function RiwayatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTransactionById, isLoading } = useTransaksi();
  const [trx, setTrx] = useState(null);
  const [qrisUrl, setQrisUrl] = useState('');
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    const data = await fetchTransactionById(id);
    if (data) {
      setTrx(data);
      if (data.metode_pembayaran === 'QRIS') {
        fetchQrisConfig();
      }
    }
  };

  const fetchQrisConfig = async () => {
    try {
      const res = await QrisAPI.getQris();
      if (res.success && res.data) {
        setQrisUrl(res.data.gambar_url);
      } else {
        setQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
      }
    } catch (err) {
      setQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-4">Memuat Detail...</span>
      </div>
    );
  }

  if (!trx) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-display text-2xl font-black text-stone-900">Transaksi Tidak Ditemukan</h3>
        <Link to="/riwayat" className="mt-6 text-primary-600 font-black text-xs uppercase tracking-widest hover:underline">
          Kembali ke Riwayat
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
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Header Section */}
        <div className="bg-white border-b border-stone-100 pt-10 pb-12 px-6">
          <div className="max-w-4xl mx-auto flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Detail Pesanan</span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="font-display text-3xl md:text-4xl font-black text-stone-900 leading-tight">
                  #{trx.id_transaksi}
                </h1>
                <StatusBadge status={trx.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
          {/* Status Timeline */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-8">Status Pesanan</h3>
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -translate-y-1/2 rounded-full z-0" />
              {/* Progress Line Active */}
              <div 
                className={`absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 rounded-full z-0 transition-all duration-500 ${
                  trx.status === 'diproses' ? 'w-1/2' : 
                  trx.status === 'selesai' ? 'w-full' : 'w-0'
                }`} 
              />
              
              {/* Pending Step */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  trx.status === 'pending' ? 'bg-yellow-400 border-yellow-400' : 
                  trx.status !== 'pending' ? 'bg-primary-600 border-primary-600' : 'bg-white border-stone-200'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${trx.status === 'pending' ? 'text-yellow-600' : 'text-stone-400'}`}>Menunggu</span>
              </div>

              {/* Processed Step */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  trx.status === 'diproses' ? 'bg-blue-500 border-blue-500' : 
                  trx.status === 'selesai' ? 'bg-primary-600 border-primary-600' : 'bg-white border-stone-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${trx.status !== 'pending' ? 'bg-white' : 'bg-stone-200'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${trx.status === 'diproses' ? 'text-blue-600' : 'text-stone-400'}`}>Diproses</span>
              </div>

              {/* Completed Step */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  trx.status === 'selesai' ? 'bg-green-500 border-green-500' : 
                  trx.status === 'dibatalkan' ? 'bg-red-500 border-red-500' : 'bg-white border-stone-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${trx.status === 'selesai' || trx.status === 'dibatalkan' ? 'bg-white' : 'bg-stone-200'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${trx.status === 'selesai' ? 'text-green-600' : 'text-stone-400'}`}>Selesai</span>
              </div>
            </div>
            
            {trx.status === 'dibatalkan' && (
              <p className="text-center text-red-500 text-xs font-bold mt-4">Pesanan ini telah dibatalkan</p>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-premium flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Waktu Transaksi</p>
                <p className="font-sans font-black text-stone-900 text-sm">{dateStr}</p>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-premium flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Metode Pembayaran</p>
                <p className="font-sans font-black text-stone-900 text-sm">{trx.metode_pembayaran}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Items List */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <ShoppingBag size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Item Pesanan</h3>
                </div>

                <div className="space-y-6">
                  {trx.detail_transaksi?.map((item) => (
                    <div key={item.id_detail} className="flex gap-6 items-center group">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                        <img
                          src={item.produk?.gambar}
                          alt={item.produk?.nama_produk}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-black text-stone-900 text-sm truncate">
                          {item.produk?.nama_produk}
                        </h4>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
                          {item.jumlah} Unit &bull; {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.produk?.harga)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-stone-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Informasi Pengiriman</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Penerima</p>
                      <p className="font-sans font-black text-stone-900">{trx.user?.nama || 'Penerima'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Alamat Lengkap</p>
                      <p className="font-sans font-bold text-stone-600 text-sm leading-relaxed">{trx.user?.alamat || 'Alamat tidak tersedia'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-8">
              {/* QRIS Action */}
              {trx.status === 'pending' && trx.metode_pembayaran === 'QRIS' && (
                <div className="bg-stone-900 rounded-[2.5rem] p-8 shadow-2xl text-white text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-primary-400 mx-auto mb-6">
                    <QrCode size={32} />
                  </div>
                  <h4 className="font-display text-xl font-black mb-2">Menunggu Pembayaran</h4>
                  <p className="text-stone-400 text-xs font-medium leading-relaxed mb-8">
                    Silakan selesaikan pembayaran melalui QRIS untuk memproses pesanan Anda.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsQrisModalOpen(true)}
                    className="w-full bg-primary-600 text-white font-sans font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-green-lg transition-all"
                  >
                    Tampilkan Kode QRIS
                  </motion.button>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <Receipt size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ringkasan Biaya</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Subtotal</span>
                    <span className="font-sans font-bold text-stone-900">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Pengiriman</span>
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">Gratis</span>
                  </div>
                  <div className="pt-6 border-t border-stone-50 flex justify-between items-center">
                    <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Total Bayar</span>
                    <span className="text-2xl font-black text-primary-600">{formattedTotal}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Button */}
              <motion.a
                href={getWhatsAppUrl(trx)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-500 text-white font-sans font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-all"
              >
                <MessageCircle size={20} />
                Hubungi Admin via WhatsApp
              </motion.a>
            </div>
          </div>
        </div>

        {/* QRIS Modal */}
        {trx.status === 'pending' && trx.metode_pembayaran === 'QRIS' && (
          <QrisModal
            isOpen={isQrisModalOpen}
            onClose={() => setIsQrisModalOpen(false)}
            qrisUrl={qrisUrl}
          />
        )}
      </div>
    </PageTransition>
  );
}
