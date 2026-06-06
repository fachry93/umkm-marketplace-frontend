import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, ShoppingBag } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { ProdukAPI } from '../../../data/repositories/ProdukAPI';
import { UmkmAPI } from '../../../data/repositories/UmkmAPI';
import toast from 'react-hot-toast';

export default function ProdukFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [umkmList, setUmkmList] = useState([]);
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    stok: '',
    id_umkm: ''
  });
  const [gambarFile, setGambarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    loadInitData();
  }, [id]);

  const loadInitData = async () => {
    try {
      setLoadingData(true);
      // Fetch UMKM list first to select who owns the product
      const umkmRes = await UmkmAPI.getAll();
      const uList = umkmRes.data || umkmRes || [];
      setUmkmList(uList);

      if (isEditMode) {
        const prodRes = await ProdukAPI.getById(id);
        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            nama_produk: p.nama_produk || '',
            deskripsi: p.deskripsi || '',
            harga: p.harga || '',
            stok: p.stok || '',
            id_umkm: p.id_umkm || ''
          });
          setPreviewUrl(p.gambar || '');
        } else {
          toast.error('Produk tidak ditemukan');
          navigate('/admin/produk');
        }
      } else {
        // Prefill with first UMKM if list exists
        if (uList.length > 0) {
          setFormData(prev => ({ ...prev, id_umkm: uList[0].id_umkm.toString() }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data awal');
    } finally {
      setLoadingData(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_produk || !formData.harga || !formData.stok || !formData.id_umkm) {
      return toast.error('Harap isi semua kolom wajib');
    }

    if (!isEditMode && !gambarFile) {
      return toast.error('Harap upload gambar produk');
    }

    setLoading(true);
    try {
      // Build FormData for multipart upload
      const data = new FormData();
      data.append('nama_produk', formData.nama_produk);
      data.append('deskripsi', formData.deskripsi);
      data.append('harga', formData.harga);
      data.append('stok', formData.stok);
      data.append('id_umkm', formData.id_umkm);
      
      if (gambarFile) {
        data.append('gambar', gambarFile);
      }

      let res;
      if (isEditMode) {
        res = await ProdukAPI.update(id, data);
      } else {
        res = await ProdukAPI.create(data);
      }

      if (res.success) {
        toast.success(isEditMode ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
        navigate('/admin/produk');
      } else {
        toast.error(res.message || 'Gagal menyimpan produk');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Gagal menyimpan produk';
      toast.error(errMsg);
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
        {/* Back navigation link */}
        <div>
          <Link to="/admin/produk" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-sans font-bold">
            <ArrowLeft size={14} /> Kembali ke Kelola Produk
          </Link>
        </div>

        {/* Header Title */}
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850">
            {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            {isEditMode ? 'Ubah informasi produk terpilih.' : 'Masukkan produk baru ke dalam katalog.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column Forms */}
              <div className="space-y-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-semibold text-stone-600">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama_produk}
                    onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                    placeholder="Contoh: Kripik Singkong Balado"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                {/* Associate UMKM dropdown selection */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-semibold text-stone-600">
                    Produsen UMKM <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.id_umkm}
                    onChange={(e) => setFormData({ ...formData, id_umkm: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all cursor-pointer"
                    required
                  >
                    <option value="" disabled>Pilih UMKM asal...</option>
                    {umkmList.map((umkm) => (
                      <option key={umkm.id_umkm} value={umkm.id_umkm}>
                        {umkm.nama_umkm} (Desa {umkm.desa})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing & Stock Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-sans font-semibold text-stone-600">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.harga}
                      onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                      placeholder="Contoh: 15000"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-sans font-semibold text-stone-600">
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                      placeholder="Contoh: 50"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-semibold text-stone-600">
                    Deskripsi Produk
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Tuliskan info produk lengkap..."
                    rows={4}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Column image uploader preview */}
              <div className="space-y-3 flex flex-col justify-center items-center border-2 border-dashed border-stone-200 rounded-2xl p-4 bg-stone-50/50">
                <span className="text-xs font-sans font-semibold text-stone-650 block">Gambar Produk</span>
                
                {previewUrl ? (
                  <div className="w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border border-stone-200 relative group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className="cursor-pointer text-white text-xs font-sans font-semibold bg-stone-850 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Upload size={14} /> Ganti Foto
                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 p-6 hover:bg-stone-100/50 rounded-xl transition-colors">
                    <div className="p-3 rounded-full bg-white border border-stone-200 text-stone-400">
                      <Upload size={24} />
                    </div>
                    <span className="text-xs text-stone-500 font-sans text-center">
                      Format JPG/PNG, maksimal 2MB. <br />
                      <strong className="text-primary-600">Klik untuk upload</strong>
                    </span>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-stone-100 pt-4 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
