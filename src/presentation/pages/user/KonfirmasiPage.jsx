import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Phone, User, CheckCircle2, QrCode, ArrowLeft, PackageCheck, AlertCircle, MessageCircle } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { TransaksiAPI } from '../../../data/repositories/TransaksiAPI';
import { QrisAPI } from '../../../data/repositories/QrisAPI';
import { QrisModal } from '../../components/ui/QrisModal';
import toast from 'react-hot-toast';

// WhatsApp Admin Configuration
const WHATSAPP_ADMIN_NUMBER = '6287853847272';
const WHATSAPP_MESSAGE = `Halo admin, saya baru saja melakukan pemesanan di Marketplace UMKM Wongsorejo. Saya ingin bertanya mengenai pesanan saya.`;
const getWhatsAppUrl = () => `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function KonfirmasiPage() {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrisUrl, setQrisUrl] = useState('');
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      return navigate('/login');
    }

    const storedDetails = localStorage.getItem('checkout_details');
    if (!storedDetails) {
      toast.error('Data checkout tidak lengkap');
      return navigate('/produk');
    }

    try {
      const parsedDetails = JSON.parse(storedDetails);
      setDetails(parsedDetails);
      if (parsedDetails.metodePembayaran === 'QRIS') {
        fetchQrisConfig();
      }
    } catch (e) {
      toast.error('Gagal memuat detail checkout');
      return navigate('/produk');
    }
  }, []);

  const fetchQrisConfig = async () => {
    try {
      const res = await QrisAPI.getQris();
      if (res.success && res.data) {
        setQrisUrl(res.data.gambar_url);
      } else {
        setQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
      }
    } catch (err) {
      console.error('Failed to load QRIS config', err);
      setQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
    }
  };

  const handleConfirmOrder = async () => {
    if (!details) return;
    setLoading(true);
    try {
      const payload = {
        total_harga: Number(details.totalHarga),
        metode_pembayaran: details.metodePembayaran,
        detail_transaksi: [
          {
            id_produk: Number(details.produk.id_produk),
            jumlah: Number(details.jumlah),
            subtotal: Number(details.totalHarga)
          }
        ]
      };

      const res = await TransaksiAPI.create(payload);
      if (res.success) {
        toast.success('Pesanan berhasil dibuat!');
        localStorage.removeItem('checkout_item');
        localStorage.removeItem('checkout_details');
        navigate('/riwayat');
      } else {
        toast.error(res.message || 'Gagal memproses pesanan');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal memproses pesanan';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!details) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(details.produk.harga);

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(details.totalHarga);

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
            <div>
              <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Langkah Terakhir</span>
              <h1 className="font-display text-3xl md:text-4xl font-black text-stone-900 leading-tight">
                Konfirmasi <span className="text-primary-600">Pesanan.</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
          {/* Warning Banner */}
          <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-400 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-display text-xl font-black mb-2">Tinjau Pesanan Anda</h4>
                <p className="text-stone-400 text-sm leading-relaxed font-medium">
                  Pastikan alamat pengiriman dan metode pembayaran sudah sesuai. Pesanan yang sudah dikonfirmasi akan segera diproses oleh admin UMKM.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Shipping Target */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Alamat Pengiriman</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Penerima</p>
                      <p className="font-sans font-black text-stone-900">{details.pembeli.nama}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">WhatsApp</p>
                      <p className="font-sans font-black text-stone-900">{details.pembeli.no_hp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Lokasi Tujuan</p>
                      <p className="font-sans font-bold text-stone-600 leading-relaxed">{details.pembeli.alamat}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <PackageCheck size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Rincian Produk</h3>
                </div>

                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                    <img
                      src={details.produk.gambar}
                      alt={details.produk.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-black text-stone-900 text-base truncate">
                      {details.produk.nama_produk}
                    </h4>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
                      {details.jumlah} Item &bull; {formattedPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Totals */}
            <div className="lg:col-span-5 space-y-8">
              {/* Payment Info */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Metode Pembayaran</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="font-sans font-black text-stone-900">{details.metodePembayaran}</span>
                  {details.metodePembayaran === 'QRIS' ? (
                    <button
                      type="button"
                      onClick={() => setIsQrisModalOpen(true)}
                      className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 hover:underline"
                    >
                      <QrCode size={14} /> Lihat QR
                    </button>
                  ) : (
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bayar di Tempat</span>
                  )}
                </div>
              </div>

              {/* Final Summary Card */}
              <div className="bg-primary-600 rounded-[2.5rem] p-8 shadow-green-lg text-white">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center opacity-70">
                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal Produk</span>
                    <span className="font-sans font-bold">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Pengiriman</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-200 bg-white/10 px-3 py-1 rounded-full">Gratis Ongkir</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest">Total Bayar</span>
                    <span className="text-3xl font-black">{formattedTotal}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="w-full bg-white text-primary-600 font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <CheckCircle2 size={18} /> Konfirmasi Sekarang
                    </>
                  )}
                </motion.button>

                {/* WhatsApp Contact Option */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-center text-primary-200 font-medium mb-4">
                    Butuh bantuan? Hubungi kami langsung via WhatsApp
                  </p>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-white font-sans font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-green-400/30"
                  >
                    <MessageCircle size={18} />
                    Hubungi Admin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QRIS Modal */}
        {details.metodePembayaran === 'QRIS' && (
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
