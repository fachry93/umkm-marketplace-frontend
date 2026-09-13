import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Plus, Search, Edit, Trash2, MapPin, Tag, Phone, User } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { UmkmAPI } from '../../../data/repositories/UmkmAPI';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';

export default function UmkmAdminPage() {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    fetchUmkm(page);
  }, [page]);

  const fetchUmkm = async (p = 1) => {
    try {
      setLoading(true);
      const res = await UmkmAPI.getAll(p);
      if (res.meta) {
        setUmkmList(res.data || []);
        setMeta(res.meta);
      } else {
        setUmkmList(res.data || res || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data UMKM');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus UMKM "${name}"? Pastikan semua produk milik UMKM ini sudah tidak ada atau telah dihapus terlebih dahulu.`)) {
      try {
        const res = await UmkmAPI.delete(id);
        if (res.success) {
          toast.success(`UMKM "${name}" berhasil dihapus`);
          fetchUmkm(page);
        }
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.message || 'Gagal menghapus UMKM';
        toast.error(errMsg);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat data UMKM...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
              <Store size={24} className="text-primary-600" /> Kelola UMKM
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">Atur profil pelaku usaha dan mitra binaan desa.</p>
          </div>
          <Link to="/admin/umkm/tambah">
            <button className="w-full md:w-auto bg-primary-600 text-white font-sans font-semibold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Tambah UMKM
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-150">
            <h3 className="font-display font-bold text-stone-800 text-sm">{meta.total} Total Mitra</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                  <th className="px-6 py-3">UMKM & Pemilik</th>
                  <th className="px-6 py-3">Lokasi</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Kontak</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                {umkmList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                      <Store size={40} className="mx-auto mb-2 opacity-20" />
                      Belum ada data UMKM.
                    </td>
                  </tr>
                ) : (
                  umkmList.map((u) => (
                    <tr key={u.id_umkm} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                            <img
                              src={u.logo || `https://placehold.co/200x200/14532d/white?text=${encodeURIComponent(u.nama_umkm)}`}
                              alt={u.nama_umkm}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{u.nama_umkm}</span>
                            <span className="text-[10px] text-stone-400 flex items-center gap-1">
                              <User size={10} /> {u.pemilik || 'Pemilik tidak terdaftar'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 font-semibold text-stone-700">
                            <MapPin size={12} className="text-primary-600" /> {u.desa}
                          </span>
                          <span className="text-[10px] text-stone-400 ml-4">{u.dusun || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium border border-stone-200">
                          <Tag size={10} /> {u.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block font-bold text-[9px] px-2 py-0.5 rounded-full ${
                          u.status_pendampingan === 'Sudah Pendampingan'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-stone-50 text-stone-500 border border-stone-150'
                        }`}>
                          {u.status_pendampingan === 'Sudah Pendampingan' ? '🛡️ Terbina' : 'Mandiri'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-stone-400" /> {u.kontak || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-1">
                        <Link to={`/admin/umkm/${u.id_umkm}/edit`}>
                          <button className="p-1.5 rounded-lg hover:bg-stone-150 text-stone-500 hover:text-stone-700 transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(u.id_umkm, u.nama_umkm)}
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
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>
    </PageTransition>
  );
}
