import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowLeft, Shield } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { AuthAPI } from '../../../data/repositories/AuthAPI';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
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
      const res = await AuthAPI.loginAdmin(formData);
      if (res.success && res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user || res.data));
        toast.success(`Selamat datang, Administrator!`);
        navigate('/admin/dashboard');
      } else {
        toast.error(res.message || 'Kredensial admin salah');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login admin gagal, periksa email & password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-[2rem] bg-stone-900 text-white flex items-center justify-center mx-auto shadow-2xl mb-6"
            >
              <ShieldCheck size={32} className="text-primary-500" />
            </motion.div>
            <h2 className="font-display font-black text-4xl text-stone-900 mb-3">
              Nexus <span className="text-primary-600">Admin.</span>
            </h2>
            <p className="text-sm text-stone-400 font-bold uppercase tracking-widest">
              Sistem Manajemen Terpadu
            </p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-premium border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    placeholder="admin@umkm-wongsorejo.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-900/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-900/5 transition-all"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all mt-8"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    <Shield size={18} /> Masuk Portal Admin
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-stone-50">
              <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
