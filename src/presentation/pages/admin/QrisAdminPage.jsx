import React, { useState, useEffect } from 'react';
import { QrCode, Upload, Save, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { QrisAPI } from '../../../data/repositories/QrisAPI';
import toast from 'react-hot-toast';

export default function QrisAdminPage() {
  const [activeQrisUrl, setActiveQrisUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    loadQris();
  }, []);

  const loadQris = async () => {
    try {
      setLoadingConfig(true);
      const res = await QrisAPI.getQris();
      if (res.success && res.data) {
        setActiveQrisUrl(res.data.gambar_url);
      } else {
        setActiveQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
      }
    } catch (err) {
      console.error(err);
      setActiveQrisUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UMKM-WONGSOREJO-DEFAULT');
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      return toast.error('Harap pilih gambar QRIS baru terlebih dahulu');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('qr_image', selectedFile);

      const res = await QrisAPI.uploadQris(data);
      if (res.success) {
        toast.success('QRIS Code berhasil diperbarui!');
        setActiveQrisUrl(res.data.gambar_url || previewUrl);
        setSelectedFile(null);
        setPreviewUrl('');
      } else {
        toast.error(res.message || 'Gagal memperbarui QRIS');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengupload QRIS baru');
    } finally {
      setLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-sans mt-3">Memuat konfigurasi QRIS...</span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-850 flex items-center gap-2">
            <QrCode size={24} className="text-primary-600" /> Konfigurasi QRIS
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">Upload kode QRIS merchant bersama untuk pembayaran non-tunai.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active QRIS Preview */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            <h3 className="text-xs font-sans font-bold text-stone-400 uppercase tracking-wider">
              QRIS Aktif Saat Ini
            </h3>
            
            <div className="border-2 border-stone-100 rounded-2xl p-4 shadow-sm max-w-[240px] bg-white">
              <img
                src={activeQrisUrl}
                alt="QRIS Code Aktif"
                className="w-48 h-48 object-contain"
              />
            </div>
            
            <p className="text-[11px] text-stone-500 font-sans max-w-xs leading-relaxed">
              Ini adalah QRIS merchant bersama yang akan ditampilkan kepada pembeli pada halaman konfirmasi checkout saat memilih metode QRIS.
            </p>
          </div>

          {/* Upload New QRIS Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-sans font-bold text-stone-400 uppercase tracking-wider">
              Upload QRIS Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-stone-50/50 min-h-[220px]">
                {previewUrl ? (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-stone-250 relative group bg-white p-2">
                      <img src={previewUrl} alt="Preview QRIS Baru" className="w-full h-full object-contain" />
                    </div>
                    <label className="cursor-pointer text-xs font-sans font-bold text-primary-600 hover:underline">
                      Ganti File
                      <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-white border border-stone-200 text-stone-400">
                      <Upload size={24} />
                    </div>
                    <span className="text-xs text-stone-500 font-sans">
                      Format PNG/JPG, maksimal 2MB. <br />
                      <strong className="text-primary-600">Klik untuk pilih gambar QR</strong>
                    </span>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="bg-primary-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> {loading ? 'Mengupload...' : 'Perbarui QRIS'}
                </motion.button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
