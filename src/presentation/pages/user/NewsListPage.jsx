import React, { useEffect, useState } from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { useNews } from '../../hooks/useNews';
import NewsCard from '../../components/ui/NewsCard';
import Pagination from '../../components/ui/Pagination';
import { motion } from 'framer-motion';

export default function NewsListPage() {
  const { newsList, meta, fetchNews, isLoading } = useNews();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Modern Header */}
        <div className="bg-white border-b border-stone-100 pt-16 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Newspaper size={12} />
              <span>Warta & Informasi</span>
            </motion.div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-stone-900 leading-tight mb-6">
              Kabar <span className="text-primary-600">Wongsorejo.</span>
            </h1>
            <p className="font-sans text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Ikuti perkembangan terbaru, cerita sukses UMKM, dan pengumuman penting dari seluruh desa di Kecamatan Wongsorejo.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 -mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-8 h-64 animate-pulse space-y-4">
                  <div className="h-32 bg-stone-50 rounded-2xl" />
                  <div className="h-4 bg-stone-50 rounded-full w-3/4" />
                  <div className="h-4 bg-stone-50 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : newsList.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper size={40} className="text-stone-200" />
              </div>
              <h3 className="font-display text-2xl font-black text-stone-900">Belum Ada Berita</h3>
              <p className="text-sm text-stone-500 font-sans mt-2">Nantikan informasi menarik seputar UMKM Wongsorejo segera.</p>
            </div>
          ) : (
            <>
              <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsList.map((news) => (
                  <StaggerItem key={news.id_news}>
                    <NewsCard news={news} />
                  </StaggerItem>
                ))}
              </StaggerList>
              <Pagination meta={meta} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </div>

        {/* Newsletter / CTA Section */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-6">Punya Informasi Menarik?</h2>
              <p className="text-stone-400 font-sans text-lg mb-10 max-w-xl mx-auto">Bagikan cerita sukses UMKM Anda atau ajukan peliputan berita desa kepada tim admin kami.</p>
              <a
                href={`https://wa.me/6287853847272?text=${encodeURIComponent('Halo admin, saya ingin mengajukan peliputan berita atau membagikan informasi kegiatan UMKM di Desa Wongsorejo.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-stone-900 font-sans font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-xl"
              >
                Hubungi Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
