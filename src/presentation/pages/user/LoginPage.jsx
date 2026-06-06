import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShoppingBag } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { AuthAPI } from '../../../data/repositories/AuthAPI';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Harap isi semua kolom');
    }

    setLoading(true);
    try {
      const res = await AuthAPI.login(formData);
      if (res.success && res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Selamat datang, ${res.data.user?.nama || 'User'}!`);
        navigate('/');
      } else {
        toast.error(res.message || 'Email atau password salah');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login gagal, periksa koneksi Anda';
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
              className="w-20 h-20 object-contain mx-auto mb-6"
            />
            <h2 className="font-display font-black text-4xl text-stone-900 mb-3">
              Masuk Akun<span className="text-primary-600">.</span>
            </h2>
            <p className="text-sm text-stone-500 font-sans font-medium">
              Selamat datang kembali! Silakan masuk untuk melanjutkan belanja produk UMKM terbaik.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-premium">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-green-lg flex items-center justify-center gap-3 transition-all mt-8"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    <LogIn size={18} /> Masuk Sekarang
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center space-y-6">
              <p className="text-xs font-sans text-stone-500 font-bold">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:underline">
                  Daftar Baru
                </Link>
              </p>
              
              <div className="pt-6 border-t border-stone-50">
                <Link to="/admin/login" className="inline-flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-900 transition-colors">
                  Portal Admin <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
