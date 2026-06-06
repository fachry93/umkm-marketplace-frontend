import React, { useState, useEffect } from 'react';
import { Bell, Send, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { AdminAPI } from '../../../data/repositories/AdminAPI';
import { NotifikasiAPI } from '../../../data/repositories/NotifikasiAPI';
import toast from 'react-hot-toast';

export default function NotifikasiAdminPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    pesan: '',
    id_user: 'all' // 'all' or specific user ID
  });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await AdminAPI.getAllUsers();
      setUsers(res.data || res || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat daftar pengguna');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pesan.trim()) {
      return toast.error('Harap masukkan pesan notifikasi');
    }

    setLoading(true);
    try {
      if (formData.id_user === 'all') {
        if (users.length === 0) {
          toast.error('Tidak ada pengguna terdaftar untuk dikirimi broadcast');
          setLoading(false);
          return;
        }

        // Send to all users in parallel
        const promises = users.map(u =>
          NotifikasiAPI.send({
            id_user: Number(u.id_user),
            pesan: formData.pesan
          })
        );
        await Promise.all(promises);
        toast.success(`Berhasil menyiarkan notifikasi ke ${users.length} pengguna!`);
      } else {
        // Send to single user
        const res = await NotifikasiAPI.send({
          id_user: Number(formData.id_user),
          pesan: formData.pesan
        });
        if (res.success) {
          toast.success('Notifikasi berhasil dikirim!');
        } else {
          toast.error(res.message || 'Gagal mengirim notifikasi');
        }
      }

      setFormData(prev => ({ ...prev, pesan: '' }));
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengirim notifikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
            <Bell size={24} className="text-primary-600" /> Kirim Notifikasi
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">Kirim pesan pengumuman ke seluruh pembeli atau perorangan.</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Recipient Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Penerima Notifikasi
              </label>
              <select
                value={formData.id_user}
                onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
                disabled={loadingUsers}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">📢 Semua Pengguna (Siaran/Broadcast)</option>
                {users.map((u) => (
                  <option key={u.id_user} value={u.id_user}>
                    👤 {u.nama} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification message */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Isi Pesan Notifikasi
              </label>
              <textarea
                value={formData.pesan}
                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                placeholder="Tulis pesan pengumuman atau info penting di sini..."
                rows={5}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || loadingUsers}
                className="bg-primary-600 text-white font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} /> {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
              </motion.button>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}
