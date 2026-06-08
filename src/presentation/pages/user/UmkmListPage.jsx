import React, { useState, useEffect } from 'react';
import { Store, Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { CategoryFilter } from '../../components/ui/CategoryFilter';
import { UmkmCard } from '../../components/ui/UmkmCard';
import { UmkmSkeleton } from '../../components/ui/UmkmSkeleton';
import Pagination from '../../components/ui/Pagination';
import { useUmkm } from '../../hooks/useUmkm';
import { motion, AnimatePresence } from 'framer-motion';

export default function UmkmListPage() {
  const { umkmList, fetchUmkm, isLoading, meta } = useUmkm();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUmkm(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredList = () => {
    let temp = [...umkmList];
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(u => 
        u.nama_umkm.toLowerCase().includes(q) || 
        (u.pemilik && u.pemilik.toLowerCase().includes(q)) ||
        u.desa.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'Semua') {
      temp = temp.filter(u => u.kategori === selectedCategory);
    }
    return temp;
  };

  const list = filteredList();

  return (
    <PageTransition>
      <div className="w-full bg-stone-50 min-h-screen pb-32">
        {/* Modern Hero Section */}
        <div className="bg-stone-900 pt-20 pb-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-transparent to-accent-900/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-6"
                >
                  <Store size={12} />
                  <span>Direktori Mitra Desa</span>
                </motion.div>
                <h1 className="font-display text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                  Jelajahi <span className="text-primary-500">UMKM</span> <br /> 
                  Kecamatan Wongsorejo.
                </h1>
                <p className="font-sans text-stone-400 text-lg leading-relaxed">
                  Temukan lebih dari {meta.total} unit usaha lokal yang memproduksi barang berkualitas tinggi langsung dari jantung desa.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                  <input
                    type="text"
                    placeholder="Cari nama UMKM atau desa..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] pl-12 pr-4 py-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all backdrop-blur-md"
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 py-4 rounded-[1.5rem] border transition-all font-bold text-sm ${showFilters ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  <SlidersHorizontal size={18} />
                  {showFilters ? 'Tutup Filter' : 'Filter Kategori'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-12 pt-12 border-t border-white/5"
                >
                  <CategoryFilter active={selectedCategory} onChange={setSelectedCategory} dark={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <UmkmSkeleton key={i} />)}
            </div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store size={40} className="text-stone-200" />
              </div>
              <h3 className="font-display text-2xl font-black text-stone-900">Tidak Ada UMKM</h3>
              <p className="text-sm text-stone-500 font-sans mt-2">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
            </div>
          ) : (
            <>
              <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {list.map(umkm => (
                  <StaggerItem key={umkm.id_umkm}>
                    <UmkmCard umkm={umkm} />
                  </StaggerItem>
                ))}
              </StaggerList>
              <Pagination meta={meta} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
