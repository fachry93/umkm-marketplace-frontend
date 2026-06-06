import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { AdminAPI } from '../../../data/repositories/AdminAPI';
import toast from 'react-hot-toast';

export default function AdminProfilPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await AdminAPI.getProfile();
      if (res.success && res.data) {
        setFormData({
          nama: res.data.nama || '',
          email: res.data.email || '',
          password: '' // Keep password empty initially
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat profil admin');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email) {
      return toast.error('Nama dan email wajib diisi');
    }

    setLoading(true);
    try {
      // Build data payload (omit password if empty)
      const payload = {
        nama: formData.nama,
        email: formData.email
      };
      if (formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      const res = await AdminAPI.updateProfile(payload);
      if (res.success) {
        toast.success('Profil admin berhasil diperbarui!');
        // Update stored user if relevant
        const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
        localStorage.setItem('user', JSON.stringify({ ...storedUser, nama: formData.nama, email: formData.email }));
        
        // Reset password field
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        toast.error(res.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui profil admin');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat profil admin...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
            <User size={24} className="text-primary-600" /> Profil Administrator
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">Ubah nama, email, dan password kredensial masuk.</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama Lengkap Admin"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@domain.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Kata Sandi Baru (Kosongkan jika tidak diubah)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </motion.button>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}
