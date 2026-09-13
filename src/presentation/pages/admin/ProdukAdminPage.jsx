import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { ProdukAPI } from '../../../data/repositories/ProdukAPI';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const loadProducts = async (p = 1) => {
    try {
      setLoading(true);
      const res = await ProdukAPI.getAll({ page: p });
      if (res.meta) {
        setProdukList(res.data || []);
        setMeta(res.meta);
      } else {
        setProdukList(res.data || res || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      const res = await ProdukAPI.delete(id);
      if (res.success) {
        toast.success('Produk berhasil dihapus');
        setProdukList(prev => prev.filter(p => p.id_produk !== id));
      } else {
        toast.error(res.message || 'Gagal menghapus produk');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Gagal menghapus produk';
      toast.error(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat data produk...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
              <ShoppingBag size={24} className="text-primary-600" /> Kelola Produk
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">Tambah, ubah, dan hapus katalog produk digital.</p>
          </div>
          <Link to="/admin/produk/tambah">
            <button className="bg-primary-600 text-white font-sans font-semibold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Tambah Produk
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-150">
            <h3 className="font-display font-bold text-stone-800 text-sm">{meta.total} Total Produk</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider border-b border-stone-150">
                  <th className="px-6 py-3">Produk</th>
                  <th className="px-6 py-3">UMKM Produsen</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Harga</th>
                  <th className="px-6 py-3">Stok</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-sans text-stone-600">
                {produkList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                      Belum ada produk terdaftar. Klik "Tambah Produk" untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  produkList.map((p) => (
                    <tr key={p.id_produk} className="hover:bg-stone-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                            <img src={p.gambar} alt={p.nama_produk} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{p.nama_produk}</span>
                            <span className="text-[10px] text-stone-400">ID #{p.id_produk}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{p.umkm?.nama_umkm || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                          {p.umkm?.kategori || 'Makanan Ringan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-stone-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.harga)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${p.stok === 0 ? 'text-red-500 font-bold' : 'text-stone-700'}`}>
                          {p.stok === 0 ? 'Habis' : p.stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-1">
                        <Link to={`/admin/produk/${p.id_produk}/edit`}>
                          <button className="p-1.5 rounded-lg hover:bg-stone-150 text-stone-500 hover:text-stone-700 transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id_produk)}
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
