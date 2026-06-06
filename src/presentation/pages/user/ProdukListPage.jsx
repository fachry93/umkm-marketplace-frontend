import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ShoppingBag, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { useProduk } from '../../hooks/useProduk';
import { ProductCard } from '../../components/ui/ProductCard';
import Pagination from '../../components/ui/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProdukListPage() {
  const { produkList, fetchProduk, isLoading, meta } = useProduk();
  const location = useLocation();
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
    fetchProduk(page);
  }, [location.search, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['Semua', ...new Set(produkList.map(p => p.umkm?.kategori || 'Lainnya'))];

  const filteredAndSortedProducts = () => {
    let result = [...produkList];
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nama_produk.toLowerCase().includes(q) ||
        (p.deskripsi && p.deskripsi.toLowerCase().includes(q)) ||
        (p.umkm && p.umkm.nama_umkm.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'Semua') {
      result = result.filter(p => (p.umkm?.kategori || 'Lainnya') === selectedCategory);
    }
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.harga) - Number(b.harga));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.harga) - Number(a.harga));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.nama_produk.localeCompare(b.nama_produk));
    }
    return result;
  };

  const list = filteredAndSortedProducts();

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Header Section */}
        <div className="bg-white border-b border-stone-100 pt-10 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Eksplorasi</span>
                <h1 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                  Katalog <span className="text-primary-600">Produk.</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari produk impian Anda..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-stone-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${showFilters ? 'bg-primary-600 border-primary-600 text-white shadow-green' : 'bg-white border-stone-200 text-stone-600 hover:border-primary-500'}`}
                >
                  <SlidersHorizontal size={20} />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kategori</span>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-bold transition-all border ${
                              selectedCategory === cat
                                ? 'bg-primary-600 border-primary-600 text-white shadow-green'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-primary-500'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Urutkan</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'name_asc', label: 'Nama (A-Z)' },
                          { id: 'price_asc', label: 'Harga Terendah' },
                          { id: 'price_desc', label: 'Harga Tertinggi' }
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSortBy(s.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-bold transition-all border ${
                              sortBy === s.id
                                ? 'bg-stone-900 border-stone-900 text-white shadow-xl'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-primary-500'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-5 animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-stone-100 rounded-[1.5rem]" />
                  <div className="h-4 bg-stone-100 rounded-full w-3/4" />
                  <div className="h-6 bg-stone-100 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-stone-200" />
              </div>
              <h3 className="font-display text-2xl font-black text-stone-900">Produk Tidak Ditemukan</h3>
              <p className="text-sm text-stone-500 font-sans mt-2 max-w-xs mx-auto">Coba cari kata kunci lain atau ubah filter kategori Anda.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('Semua');}}
                className="mt-8 text-primary-600 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {list.map((produk) => (
                <StaggerItem key={produk.id_produk}>
                  <ProductCard produk={produk} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>
    </PageTransition>
  );
}
