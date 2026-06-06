import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Store, Plus, Minus, ShieldCheck, MapPin, ArrowLeft, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { ProdukAPI } from '../../../data/repositories/ProdukAPI';
import toast from 'react-hot-toast';

function ProductImageZoom({ src, alt }) {
  const [zoomed, setZoomed] = useState(false)
  return (
    <>
      <motion.img
        src={src} alt={alt}
        whileTap={{ scale: 0.97 }}
        onClick={() => setZoomed(true)}
        className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-700"
      />
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[100] bg-stone-950/95 flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <motion.img
              src={src} alt={alt}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-full max-h-full rounded-[2rem] object-contain shadow-2xl"
            />
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              Tutup Gambar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ProdukDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);

  useEffect(() => {
    loadProduk();
  }, [id]);

  const loadProduk = async () => {
    try {
      setLoading(true);
      const res = await ProdukAPI.getById(id);
      if (res.success) {
        setProduk(res.data);
      } else {
        toast.error('Produk tidak ditemukan');
      }
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    if (produk && jumlah < produk.stok) {
      setJumlah(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (jumlah > 1) {
      setJumlah(prev => prev - 1);
    }
  };

  const handleBuyNow = () => {
    if (!produk || produk.stok <= 0) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Silakan login terlebih dahulu untuk berbelanja');
      return navigate('/login');
    }
    const checkoutItem = {
      produk,
      jumlah,
      totalHarga: Number(produk.harga) * jumlah
    };
    localStorage.setItem('checkout_item', JSON.stringify(checkoutItem));
    navigate('/transaksi/baru');
  };

  if (loading) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-4">Memuat Produk...</span>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-display text-2xl font-black text-stone-900">Produk Tidak Ditemukan</h3>
        <Link to="/produk" className="mt-6 text-primary-600 font-black text-xs uppercase tracking-widest hover:underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(produk.harga);

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Modern Layout Container */}
        <div className="max-w-7xl mx-auto lg:px-6 lg:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Image Column */}
            <div className="lg:col-span-7">
              <div className="relative aspect-square lg:aspect-[4/5] bg-white lg:rounded-[3rem] overflow-hidden shadow-premium border border-stone-100 group">
                <ProductImageZoom src={produk.gambar} alt={produk.nama_produk} />
                
                {/* Floating Actions */}
                <div className="absolute top-6 left-6 flex gap-3">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-900 shadow-xl border border-white/20 hover:bg-white transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>

                <div className="absolute top-6 right-6">
                  <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-900 shadow-xl border border-white/20 hover:bg-white transition-all">
                    <Share2 size={20} />
                  </button>
                </div>

                {produk.stok === 0 && (
                  <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-sans font-black uppercase tracking-[0.2em] text-sm bg-stone-900/80 px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                      Habis Terjual
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 px-6 lg:px-0">
              <div className="sticky top-28 space-y-8">
                {/* Product Title & Price */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest">Produk Unggulan</span>
                    {produk.stok <= 5 && produk.stok > 0 && (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest">Stok Terbatas</span>
                    )}
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                    {produk.nama_produk}
                  </h1>
                  <p className="font-display text-3xl font-black text-primary-600">
                    {formattedPrice}
                  </p>
                </div>

                {/* UMKM Card */}
                {produk.umkm && (
                  <Link to={`/umkm/${produk.umkm.id_umkm}`}>
                    <div className="p-6 bg-white rounded-[2rem] border border-stone-100 shadow-premium flex items-center justify-between group hover:border-primary-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 p-1 group-hover:rotate-3 transition-transform">
                          <img
                            src={produk.umkm.logo || `https://placehold.co/200x200/14532d/white?text=${encodeURIComponent(produk.umkm.nama_umkm)}`}
                            alt={produk.umkm.nama_umkm}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div>
                          <h4 className="font-sans font-black text-stone-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">
                            {produk.umkm.nama_umkm}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                            <MapPin size={12} className="text-primary-500" />
                            <span>Desa {produk.umkm.desa}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-primary-600 group-hover:text-white transition-all">
                        <Store size={18} />
                      </div>
                    </div>
                  </Link>
                )}

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Deskripsi Produk</h3>
                  <p className="font-sans text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                    {produk.deskripsi || 'Tidak ada deskripsi untuk produk ini.'}
                  </p>
                </div>

                {/* Quantity & Buy */}
                <div className="pt-8 border-t border-stone-100 space-y-6">
                  {produk.stok > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Jumlah Pembelian</span>
                      <div className="flex items-center bg-stone-100 rounded-2xl p-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleDecrement}
                          disabled={jumlah <= 1}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-stone-900 shadow-sm disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="w-12 text-center font-display font-black text-stone-900">
                          {jumlah}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleIncrement}
                          disabled={jumlah >= produk.stok}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-stone-900 shadow-sm disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Trust Badge */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary-50/50 border border-primary-100">
                    <ShieldCheck className="text-primary-600 shrink-0" size={20} />
                    <p className="text-[10px] text-primary-700 font-bold uppercase tracking-tighter leading-relaxed">
                      Jaminan produk asli desa Wongsorejo. Dukungan penuh admin & pengiriman kurir lokal terpercaya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Buy Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-stone-100 p-4 lg:p-6 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="hidden md:block flex-1">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
              <p className="text-2xl font-black text-stone-900">
                Rp {(Number(produk.harga) * jumlah).toLocaleString('id-ID')}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={produk.stok === 0}
              className="flex-1 lg:flex-none lg:w-80 bg-primary-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 shadow-green-lg transition-all"
            >
              <ShoppingCart size={18} /> Beli Sekarang
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
