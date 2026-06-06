import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Store, User, MapPin, Tag, Phone, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { UmkmAPI } from '../../../data/repositories/UmkmAPI';
import toast from 'react-hot-toast';

const VILLAGES = [
  'Wongsorejo',
  'Alasbuluh',
  'Alasrejo',
  'Bajulmati',
  'Bangsring',
  'Bengkak',
  'Sidodadi Utara'
];

const CATEGORIES = [
  'Makanan Ringan',
  'Kue & Roti',
  'Makanan Olahan',
  'Minuman',
  'Kelompok Usaha'
];

export default function UmkmFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nama_umkm: '',
    pemilik: '',
    desa: 'Wongsorejo',
    dusun: '',
    kecamatan: 'Wongsorejo',
    kategori: 'Makanan Ringan',
    status_pendampingan: 'Belum Pendampingan',
    kontak: '',
    deskripsi: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchExistingUmkm();
    }
  }, [id]);

  const fetchExistingUmkm = async () => {
    try {
      setFetching(true);
      const res = await UmkmAPI.getById(parseInt(id));
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          nama_umkm: d.nama_umkm || '',
          pemilik: d.pemilik || '',
          desa: d.desa || 'Wongsorejo',
          dusun: d.dusun || '',
          kecamatan: d.kecamatan || 'Wongsorejo',
          kategori: d.kategori || 'Makanan Ringan',
          status_pendampingan: d.status_pendampingan || 'Belum Pendampingan',
          kontak: d.kontak || '',
          deskripsi: d.deskripsi || ''
        });
        if (d.logo) {
          setLogoPreview(d.logo);
        }
      } else {
        toast.error('UMKM tidak ditemukan');
        navigate('/admin/umkm');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data UMKM');
      navigate('/admin/umkm');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran logo tidak boleh melebihi 2MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_umkm.trim()) {
      toast.error('Nama UMKM wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      if (logoFile) {
        data.append('logo', logoFile);
      }

      let res;
      if (isEditMode) {
        res = await UmkmAPI.update(parseInt(id), data);
      } else {
        res = await UmkmAPI.create(data);
      }

      if (res.success) {
        toast.success(isEditMode ? 'UMKM berhasil diperbarui' : 'UMKM berhasil ditambahkan');
        navigate('/admin/umkm');
      } else {
        toast.error(res.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan data UMKM');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Mengambil data UMKM...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/umkm" className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-primary-600 hover:border-primary-200 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-850">
              {isEditMode ? 'Edit Profil UMKM' : 'Tambah UMKM Baru'}
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">Lengkapi informasi detail mengenai pelaku usaha mikro.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Image Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="text-sm font-sans font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Upload size={16} className="text-primary-600" /> Logo / Foto UMKM
              </h3>
              
              <div className="relative group">
                <div className="w-full aspect-square rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Store className="mx-auto text-stone-300 mb-2" size={48} />
                      <p className="text-[10px] font-sans text-stone-400">Belum ada logo dipilih</p>
                    </div>
                  )}
                </div>
                
                <label className="mt-4 w-full flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-sans font-bold py-3 rounded-xl border border-stone-200 cursor-pointer transition-all">
                  <Upload size={14} /> {logoPreview ? 'Ubah Logo' : 'Unggah Logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <p className="text-[10px] text-stone-400 font-sans mt-3 text-center">Rekomendasi: Persegi 1:1, Maks. 2MB.</p>
            </div>

            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
              <h4 className="text-xs font-sans font-bold text-primary-800 mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> Tips Pendaftaran
              </h4>
              <ul className="text-[10px] font-sans text-primary-700 space-y-2 list-disc pl-4">
                <li>Pastikan nama UMKM sesuai dengan merk dagang.</li>
                <li>Gunakan nomor WhatsApp aktif untuk memudahkan koordinasi.</li>
                <li>Deskripsi yang detail membantu pembeli mengenal produk lebih baik.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama UMKM */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <Store size={14} /> Nama UMKM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_umkm"
                    value={formData.nama_umkm}
                    onChange={handleInputChange}
                    placeholder="Contoh: Keripik Singkong Barokah"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                {/* Pemilik */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <User size={14} /> Nama Pemilik
                  </label>
                  <input
                    type="text"
                    name="pemilik"
                    value={formData.pemilik}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap pemilik usaha"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <Tag size={14} /> Kategori Usaha
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Status Pendampingan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Status Pembinaan
                  </label>
                  <select
                    name="status_pendampingan"
                    value={formData.status_pendampingan}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="Belum Pendampingan">Mandiri (Belum Terbina)</option>
                    <option value="Sudah Pendampingan">Terbina (Sudah Pendampingan)</option>
                  </select>
                </div>

                {/* Desa */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <MapPin size={14} /> Desa Asal
                  </label>
                  <select
                    name="desa"
                    value={formData.desa}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all appearance-none"
                  >
                    {VILLAGES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Dusun */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <MapPin size={14} /> Dusun / Lingkungan
                  </label>
                  <input
                    type="text"
                    name="dusun"
                    value={formData.dusun}
                    onChange={handleInputChange}
                    placeholder="Contoh: Dusun Krajan"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Kontak */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                    <Phone size={14} /> WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Kecamatan (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-stone-600">Kecamatan</label>
                  <input
                    type="text"
                    value="Wongsorejo"
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-sans text-stone-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-stone-600 flex items-center gap-1.5">
                  <FileText size={14} /> Deskripsi Usaha
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Tuliskan detail usaha, sejarah singkat, atau keunggulan produk..."
                  rows="5"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-primary-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <Link to="/admin/umkm">
                  <button type="button" className="px-6 py-3 text-sm font-sans font-bold text-stone-500 hover:text-stone-700 transition-colors">
                    Batal
                  </button>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white font-sans font-bold text-sm px-8 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isEditMode ? 'Simpan Perubahan' : 'Daftarkan UMKM'}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
