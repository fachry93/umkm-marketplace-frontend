import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Newspaper, Share2, Bookmark, User } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { useNews } from '../../hooks/useNews';
import { motion } from 'framer-motion';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsDetail, fetchNewsById, isLoading } = useNews();

  useEffect(() => {
    fetchNewsById(id);
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-4">Memuat Berita...</span>
      </div>
    );
  }

   if (!isLoading && !newsDetail) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-display text-2xl font-black text-stone-900">Berita Tidak Ditemukan</h3>
        <Link to="/news" className="mt-6 text-primary-600 font-black text-xs uppercase tracking-widest hover:underline">
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  const dateStr = new Date(newsDetail.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Modern Article Header */}
        <div className="bg-stone-900 pt-10 pb-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-stone-900 to-accent-900 opacity-90" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Bookmark size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest border border-primary-500/30">
                <Newspaper size={12} /> Warta Desa
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                {newsDetail.judul}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <Calendar size={16} className="text-primary-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">{dateStr}</span>
                </div>
                {newsDetail.lokasi && (
                  <div className="flex items-center gap-2 text-stone-400">
                    <MapPin size={16} className="text-primary-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">{newsDetail.lokasi}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
          <article className="bg-white rounded-[3rem] p-8 md:p-16 shadow-premium border border-stone-100">
            {/* Stylized Lead / First Paragraph if any */}
            <div className="font-sans text-stone-700 text-lg leading-relaxed space-y-8 whitespace-pre-wrap">
              {newsDetail.isi}
            </div>

            {/* Bottom Meta */}
            <div className="mt-16 pt-10 border-t border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Penulis</p>
                  <p className="font-sans font-black text-stone-900">Admin Desa Wongsorejo</p>
                </div>
              </div>
              
              <Link to="/news">
                <motion.button
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Kembali ke Daftar
                </motion.button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </PageTransition>
  );
}
