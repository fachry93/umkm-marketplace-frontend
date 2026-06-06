import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Plus, Trash2, Edit, Calendar, MapPin } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { NewsAPI } from '../../../data/repositories/NewsAPI';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';

export default function NewsAdminPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    loadNews(page);
  }, [page]);

  const loadNews = async (p = 1) => {
    try {
      setLoading(true);
      const res = await NewsAPI.getAll(p);
      if (res.meta) {
        setNewsList(res.data || []);
        setMeta(res.meta);
      } else {
        setNewsList(res.data || res || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    try {
      const res = await NewsAPI.delete(id);
      if (res.success) {
        toast.success('Berita berhasil dihapus');
        setNewsList(prev => prev.filter(n => n.id_news !== id));
      } else {
        toast.error(res.message || 'Gagal menghapus berita');
      }
    } catch (err) {
      toast.error('Gagal menghapus berita');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat data berita...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
              <Newspaper size={24} className="text-primary-600" /> Kelola Berita
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">Atur kabar desa dan pengumuman untuk pembeli.</p>
          </div>
          <Link to="/admin/news/tambah">
            <button className="bg-primary-600 text-white font-sans font-semibold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Tambah Berita
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-150">
            <h3 className="font-display font-bold text-stone-800 text-sm">{meta.total} Total Artikel</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                  <th className="px-6 py-3">Judul Berita</th>
                  <th className="px-6 py-3">Lokasi</th>
                  <th className="px-6 py-3">Tanggal Terbit</th>
                  <th className="px-6 py-3">Isi Singkat</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                {newsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-400">
                      Belum ada berita dipublikasikan. Klik "Tambah Berita" untuk memulainya.
                    </td>
                  </tr>
                ) : (
                  newsList.map((n) => (
                    <tr key={n.id_news} className="hover:bg-stone-50/50">
                      <td className="px-6 py-4 font-bold text-stone-900">{n.judul}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-primary-600" />
                          {n.lokasi || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-stone-400" />
                          {new Date(n.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">{n.isi}</td>
                      <td className="px-6 py-4 text-center space-x-1">
                        <Link to={`/admin/news/${n.id_news}/edit`}>
                          <button className="p-1.5 rounded-lg hover:bg-stone-150 text-stone-500 hover:text-stone-700 transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(n.id_news)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      </div>
    </PageTransition>
  );
}
