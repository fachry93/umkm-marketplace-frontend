import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, UserPlus, ShoppingBag } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { AuthAPI } from '../../../data/repositories/AuthAPI';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    alamat: '',
    no_hp: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.password || !formData.alamat || !formData.no_hp) {
      return toast.error('Harap isi semua kolom');
    }

    setLoading(true);
    try {
      const res = await AuthAPI.register(formData);
      if (res.success) {
        toast.success('Pendaftaran berhasil! Silakan masuk.');
        navigate('/login');
      } else {
        toast.error(res.message || 'Pendaftaran gagal');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registrasi gagal, periksa email Anda';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <motion.img 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="/icons/icon-192.png"
              alt="Logo"
              className="w-16 h-16 object-contain mx-auto mb-6"
            />
            <h2 className="font-display font-black text-4xl text-stone-900 mb-3">
              Buat Akun<span className="text-primary-600">.</span>
            </h2>
            <p className="text-sm text-stone-500 font-sans font-medium">
              Daftar sekarang untuk mulai mendukung UMKM lokal dan menikmati produk terbaik desa.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-premium">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    placeholder="Budi Santoso"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    placeholder="budi@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  No. WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Alamat Lengkap
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-stone-400" size={18} />
                  <textarea
                    placeholder="Jl. Raya Banyuwangi No. 12..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    rows={2}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-green-lg flex items-center justify-center gap-3 transition-all mt-6"
              >
                {loading ? 'Processing...' : (
                  <>
                    <UserPlus size={18} /> Daftar Sekarang
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs font-sans text-stone-500 font-bold">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary-600 hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
