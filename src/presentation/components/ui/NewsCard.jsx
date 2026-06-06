import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NewsCard({ news }) {
  const dateStr = new Date(news.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-card hover:shadow-premium transition-all duration-500 flex flex-col h-full"
    >
      <Link to={`/news/${news.id_news}`} className="relative h-48 overflow-hidden group">
        {/* Stylized Thumbnail */}
        <div className="absolute inset-0 bg-stone-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-80 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <span className="text-white font-display font-black text-lg leading-tight group-hover:scale-105 transition-transform duration-500">
            {news.judul}
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
            Warta Desa
          </div>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-[10px] text-stone-400 font-black uppercase tracking-widest mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-primary-500" />
            {dateStr}
          </span>
          {news.lokasi && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-primary-500" />
              {news.lokasi}
            </span>
          )}
        </div>
        
        <Link to={`/news/${news.id_news}`} className="group/title">
          <h3 className="font-sans font-black text-stone-900 text-base leading-tight group-hover/title:text-primary-600 transition-colors line-clamp-2 mb-3">
            {news.judul}
          </h3>
        </Link>
        
        <p className="font-sans text-stone-500 text-sm line-clamp-3 mb-6 leading-relaxed">
          {news.isi}
        </p>

        <div className="mt-auto pt-6 border-t border-stone-50">
          <Link
            to={`/news/${news.id_news}`}
            className="group flex items-center justify-between text-xs text-stone-900 font-black uppercase tracking-widest hover:text-primary-600 transition-colors"
          >
            <span>Selengkapnya</span>
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
