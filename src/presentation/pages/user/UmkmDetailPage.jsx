import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, MapPin, Phone, ShieldCheck, User, Award, Package, MessageSquare } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { ProductCard } from '../../components/ui/ProductCard';
import { UmkmAPI } from '../../../data/repositories/UmkmAPI';
import toast from 'react-hot-toast';

export default function UmkmDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUmkmDetails();
  }, [id]);

  const fetchUmkmDetails = async () => {
    try {
      setLoading(true);
      const res = await UmkmAPI.getById(parseInt(id));
      if (res.success && res.data) {
        setUmkm(res.data);
      } else {
        toast.error('UMKM tidak ditemukan');
        navigate('/umkm');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat profil UMKM');
      navigate('/umkm');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="w-full bg-stone-50 min-h-screen flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Memuat Profil...</span>
        </div>
      </PageTransition>
    );
  }

  if (!umkm) return null;

  const handleContact = () => {
    if (umkm.kontak) {
      const cleaned = umkm.kontak.replace(/[^0-9]/g, '');
      const formatted = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned;
      window.open(`https://wa.me/${formatted}?text=Halo%20${encodeURIComponent(umkm.nama_umkm)},%20saya%20tertarik%20dengan%20produk%20Anda.`, '_blank');
    } else {
      toast.error('Nomor kontak tidak tersedia');
    }
  };

  return (
    <PageTransition>
      <div className="w-full bg-stone-50 min-h-screen pb-32">
        {/* Modern Header Section */}
        <div className="relative h-64 md:h-80 bg-stone-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-stone-900 to-accent-900 opacity-90" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-between py-8 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all self-start"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar Info */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[3rem] p-8 shadow-premium border border-stone-100 text-center lg:text-left">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl mx-auto lg:mx-0 -mt-24 mb-6">
                  <div className="w-full h-full rounded-[2.2rem] bg-stone-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={umkm.logo || `https://placehold.co/200x200/14532d/white?text=${encodeURIComponent(umkm.nama_umkm)}`}
                      alt={umkm.nama_umkm}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4">
                      <Store size={12} /> {umkm.kategori}
                    </span>
                    <h1 className="font-display text-3xl font-black text-stone-900 leading-tight">
                      {umkm.nama_umkm}
                    </h1>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-stone-50">
                    <div className="flex items-center gap-3 text-stone-600">
                      <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-primary-600 shrink-0">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-bold">{umkm.desa}{umkm.dusun ? `, Dusun ${umkm.dusun}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-3 text-stone-600">
                      <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-primary-600 shrink-0">
                        <User size={16} />
                      </div>
                      <span className="text-sm font-bold">{umkm.pemilik || 'Pemilik Rahasia'}</span>
                    </div>
                  </div>

                  {umkm.kontak && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContact}
                      className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white font-sans font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-green-lg transition-all"
                    >
                      <MessageSquare size={18} /> Hubungi WhatsApp
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Status Pendampingan Card */}
              <div className={`mt-6 rounded-[2.5rem] p-8 border ${
                umkm.status_pendampingan === 'Sudah Pendampingan'
                  ? 'bg-primary-50 border-primary-100 text-primary-900'
                  : 'bg-stone-100 border-stone-200 text-stone-600'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    umkm.status_pendampingan === 'Sudah Pendampingan' ? 'bg-primary-600 text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Award size={20} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Status Verifikasi</span>
                </div>
                <h4 className="font-sans font-black text-sm mb-2">
                  {umkm.status_pendampingan === 'Sudah Pendampingan' ? 'UMKM Terverifikasi' : 'Mitra Mandiri'}
                </h4>
                <p className="text-xs leading-relaxed opacity-70 font-medium">
                  {umkm.status_pendampingan === 'Sudah Pendampingan' 
                    ? 'Telah mendapatkan pendampingan formal dari Diskopumdag Kabupaten Banyuwangi.'
                    : 'Pelaku usaha lokal mandiri yang terus berkembang di Kecamatan Wongsorejo.'}
                </p>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* About Section */}
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-stone-100">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Profil Usaha</h3>
                <p className="font-sans text-stone-600 text-lg leading-relaxed whitespace-pre-line">
                  {umkm.deskripsi || 'Belum ada deskripsi profil untuk unit usaha ini.'}
                </p>
              </div>

              {/* Products Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
                      <Package size={20} />
                    </div>
                    <h2 className="font-display text-3xl font-black text-stone-900">Katalog Produk.</h2>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                    {umkm.produk ? umkm.produk.length : 0} Item
                  </span>
                </div>

                {!umkm.produk || umkm.produk.length === 0 ? (
                  <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package size={40} className="text-stone-200" />
                    </div>
                    <h3 className="font-display text-2xl font-black text-stone-900">Belum Ada Produk</h3>
                    <p className="text-sm text-stone-500 font-sans mt-2">Pelaku usaha ini belum menambahkan katalog produk.</p>
                  </div>
                ) : (
                  <StaggerList className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {umkm.produk.map(produk => (
                      <StaggerItem key={produk.id_produk}>
                        <ProductCard produk={produk} />
                      </StaggerItem>
                    ))}
                  </StaggerList>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
