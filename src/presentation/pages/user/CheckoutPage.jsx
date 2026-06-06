import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, CreditCard, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    nama: '',
    no_hp: '',
    alamat: ''
  });
  const [metodePembayaran, setMetodePembayaran] = useState('COD');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      return navigate('/login');
    }

    const storedItem = localStorage.getItem('checkout_item');
    if (!storedItem) {
      toast.error('Belum ada item belanja dipilih');
      return navigate('/produk');
    }

    try {
      const parsedItem = JSON.parse(storedItem);
      setCheckoutItem(parsedItem);
    } catch (e) {
      toast.error('Gagal memuat item belanja');
      return navigate('/produk');
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setShippingDetails({
          nama: user.nama || '',
          no_hp: user.no_hp || '',
          alamat: user.alamat || ''
        });
      } catch (e) {
        console.error('Failed to parse user details');
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setShippingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!shippingDetails.nama || !shippingDetails.no_hp || !shippingDetails.alamat) {
      return toast.error('Harap lengkapi semua data pengiriman');
    }

    const finalDetails = {
      ...checkoutItem,
      pembeli: shippingDetails,
      metodePembayaran
    };
    localStorage.setItem('checkout_details', JSON.stringify(finalDetails));
    navigate('/transaksi/konfirmasi');
  };

  if (!checkoutItem) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(checkoutItem.produk.harga);

  const formattedSubtotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(checkoutItem.totalHarga);

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Header Section */}
        <div className="bg-white border-b border-stone-100 pt-10 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Selesaikan Pesanan</span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
              Checkout <span className="text-primary-600">Produk.</span>
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-8">
              {/* Order Summary Section */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <ShoppingBag size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Detail Item</h3>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                    <img
                      src={checkoutItem.produk.gambar}
                      alt={checkoutItem.produk.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-sans font-black text-stone-900 text-base truncate mb-1">
                      {checkoutItem.produk.nama_produk}
                    </h4>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-4">
                      {checkoutItem.jumlah} Item &bull; {formattedPrice} / Unit
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Subtotal</span>
                      <span className="text-lg font-black text-primary-600">
                        {formattedSubtotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Alamat Pengiriman</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nama Penerima</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                      type="text"
                      value={shippingDetails.nama}
                      onChange={(e) => handleInputChange('nama', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                      type="tel"
                      value={shippingDetails.no_hp}
                      onChange={(e) => handleInputChange('no_hp', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-stone-400" size={18} />
                    <textarea
                      value={shippingDetails.alamat}
                      onChange={(e) => handleInputChange('alamat', e.target.value)}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Sticky CTA */}
            <div className="lg:col-span-5 space-y-8">
              {/* Payment Method Section */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-stone-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Metode Pembayaran</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', desc: 'Bayar tunai saat barang sampai di lokasi.' },
                    { id: 'QRIS', label: 'QRIS / Digital', desc: 'Scan kode QR untuk pembayaran instan.' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setMetodePembayaran(method.id)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                        metodePembayaran === method.id
                          ? 'border-primary-600 bg-primary-50/20'
                          : 'border-stone-100 bg-white hover:border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-sans font-black text-sm ${metodePembayaran === method.id ? 'text-primary-700' : 'text-stone-900'}`}>
                          {method.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          metodePembayaran === method.id ? 'border-primary-600 bg-primary-600' : 'border-stone-200'
                        }`}>
                          {metodePembayaran === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tight leading-relaxed">
                        {method.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-stone-50 flex items-start gap-4">
                  <ShieldCheck className="text-primary-600 shrink-0" size={20} />
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter leading-relaxed">
                    Data Anda aman. Kami menjamin keamanan transaksi dan kerahasiaan informasi pribadi Anda.
                  </p>
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-stone-900 rounded-[2.5rem] p-8 shadow-2xl text-white">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                    <span className="font-sans font-bold">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Biaya Admin</span>
                    <span className="font-sans font-bold">Rp 0</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-primary-400">Total Akhir</span>
                    <span className="text-2xl font-black">{formattedSubtotal}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-green-lg flex items-center justify-center gap-3 transition-all"
                >
                  Konfirmasi Pesanan <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}
