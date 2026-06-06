import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, LogOut, Save, ShoppingBag, ShieldCheck } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { api } from '../../../data/api/axiosInstance';
import toast from 'react-hot-toast';

export default function ProfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setFormData({
          nama: parsed.nama || '',
          email: parsed.email || '',
          no_hp: parsed.no_hp || '',
          alamat: parsed.alamat || ''
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Keluar berhasil');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await api.put(`/api/users/${user.id_user}`, formData);
      if (res.data.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profil berhasil diperbarui!');
      } else {
        toast.error(res.data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal memperbarui profil';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-stone-100 flex items-center justify-center text-stone-300 mb-6">
            <User size={40} />
          </div>
          <h3 className="font-display text-2xl font-black text-stone-900">Akses Terbatas</h3>
          <p className="text-sm text-stone-500 font-sans mt-2 max-w-xs mx-auto">Silakan masuk ke akun Anda untuk melihat dan mengelola profil pribadi.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="mt-8 bg-primary-600 text-white font-sans font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl shadow-green-lg"
          >
            Masuk Sekarang
          </motion.button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Profile Header */}
        <div className="bg-stone-900 pt-20 pb-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-transparent to-accent-900/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[3rem] bg-white p-1 shadow-2xl">
              <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-black font-display">
                {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="font-display text-4xl font-black text-white">{user.nama}</h1>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  <span>Verified User</span>
                </div>
              </div>
              <p className="font-sans text-stone-400 font-medium">{user.email}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/riwayat')}
                  className="bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-2xl flex items-center gap-2 shadow-green-lg transition-all"
                >
                  <ShoppingBag size={14} />
                  Riwayat Pembelian
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-20">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-stone-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Pengaturan Profil</h3>
              <div className="w-10 h-10 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
                <User size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email (Terkunci)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans text-stone-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="tel"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Alamat Pengiriman</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-stone-400" size={18} />
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-sans font-bold focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-green-lg flex items-center justify-center gap-3 transition-all"
                >
                  <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  type="button"
                  className="px-8 bg-white border border-red-100 text-red-500 font-sans font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-3"
                >
                  <LogOut size={18} /> Keluar
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
