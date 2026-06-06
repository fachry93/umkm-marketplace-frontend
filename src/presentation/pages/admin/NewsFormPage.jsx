import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Newspaper } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { NewsAPI } from '../../../data/repositories/NewsAPI';
import toast from 'react-hot-toast';

export default function NewsFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    judul: '',
    lokasi: '',
    isi: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadNewsDetails();
    }
  }, [id]);

  const loadNewsDetails = async () => {
    try {
      setLoadingData(true);
      const res = await NewsAPI.getById(id);
      if (res.success && res.data) {
        setFormData({
          judul: res.data.judul || '',
          lokasi: res.data.lokasi || '',
          isi: res.data.isi || ''
        });
      } else {
        toast.error('Artikel berita tidak ditemukan');
        navigate('/admin/news');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat detail berita');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul || !formData.isi) {
      return toast.error('Harap isi judul dan isi berita');
    }

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await NewsAPI.update(id, formData);
      } else {
        res = await NewsAPI.create(formData);
      }

      if (res.success) {
        toast.success(isEditMode ? 'Berita berhasil diupdate' : 'Berita berhasil diterbitkan');
        navigate('/admin/news');
      } else {
        toast.error(res.message || 'Gagal menyimpan berita');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan berita');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat form data...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        {/* Back Link */}
        <div>
          <Link to="/admin/news" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-sans font-bold">
            <ArrowLeft size={14} /> Kembali ke Kelola Berita
          </Link>
        </div>

        {/* Title */}
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850">
            {isEditMode ? 'Edit Berita' : 'Tulis Berita Baru'}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {isEditMode ? 'Perbarui informasi artikel terpilih.' : 'Publikasikan informasi atau kabar desa terbaru.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* News Title */}
            <div className="space-y-1">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Marketplace UMKM Wongsorejo Resmi Dirilis"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* News Location */}
            <div className="space-y-1">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Lokasi Liputan / Berita
              </label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                placeholder="Contoh: Desa Bangsring, Wongsorejo"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            {/* Article Content Body */}
            <div className="space-y-1">
              <label className="text-xs font-sans font-semibold text-stone-600">
                Isi Lengkap Berita <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.isi}
                onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                placeholder="Tuliskan berita lengkap di sini..."
                rows={8}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Submit Toolbar */}
            <div className="border-t border-stone-100 pt-4 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> {loading ? 'Menyimpan...' : 'Terbitkan Berita'}
              </motion.button>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}
