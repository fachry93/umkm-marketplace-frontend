import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Parallax } from 'react-scroll-parallax'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Store, Zap, ShieldCheck, Truck } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

import { PageTransition } from '../../components/animation/PageTransition'
import { ScrollReveal } from '../../components/animation/ScrollReveal'
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList'
import { CountUp } from '../../components/animation/CountUp'
import { SectionHeading } from '../../components/animation/SectionHeading'
import WaveText from '../../components/animation/WaveText'
import { useProduk } from '../../hooks/useProduk'
import { useNews } from '../../hooks/useNews'
import { useUmkm } from '../../hooks/useUmkm'
import { ProductCard } from '../../components/ui/ProductCard'
import { UmkmCard } from '../../components/ui/UmkmCard'
import { UmkmSkeleton } from '../../components/ui/UmkmSkeleton'
import { SkeletonCard } from '../../components/ui/SkeletonCard'
import NewsCard from '../../components/ui/NewsCard'

function HeroSection() {
  return (
    <div className="relative overflow-hidden min-h-[90vh] lg:min-h-[85vh] w-full flex items-center">
      {/* Background with Parallax */}
      <Parallax speed={-15} className="absolute inset-0 w-full h-full scale-110">
        <img
          src="/hero-bg.jpg"
          alt="Produk UMKM Wongsorejo"
          className="w-full h-full object-cover"
        />
      </Parallax>

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/60 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-50" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Platform Digital UMKM Wongsorejo</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6">
            <WaveText text="Karya Lokal" /> <br />
            <WaveText text="Kualitas Global." gradient="linear-gradient(to right, #4ade80, #bbf7d0)" />
          </h1>

          <p className="font-sans text-stone-300 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            Mendukung pertumbuhan ekonomi desa melalui digitalisasi produk unggulan dari 12 desa di Kecamatan Wongsorejo.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/produk">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 hover:bg-primary-500 text-white font-sans font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-green-lg transition-all"
              >
                Mulai Belanja
              </motion.button>
            </Link>
            <Link to="/umkm">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-sans font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all"
              >
                Jelajahi UMKM
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </div>
  )
}

function FeatureStrip() {
  const features = [
    { icon: Zap, title: "Cepat", desc: "Transaksi instan & mudah" },
    { icon: ShieldCheck, title: "Terpercaya", desc: "Produk asli dari desa" },
    { icon: Truck, title: "Lokal", desc: "Dukungan kurir lokal" },
  ]

  return (
    <section className="relative z-20 -mt-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-premium border border-stone-100 flex items-center gap-4 group hover:border-primary-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
              <f.icon size={24} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-stone-900 text-sm">{f.title}</h3>
              <p className="font-sans text-stone-400 text-xs">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { produkList, fetchProduk, isLoading: loadingProduk } = useProduk()
  const { newsList, fetchNews, isLoading: loadingNews } = useNews()
  const { umkmList, fetchUmkm, isLoading: loadingUmkm } = useUmkm()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    fetchProduk()
    fetchNews()
    fetchUmkm()

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const produkUnggulan = produkList.slice(0, 8)
  const latestNews = newsList.slice(0, 3)

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32 w-full overflow-x-hidden">
        <HeroSection />
        
        <FeatureStrip />

        {/* Categories Grid */}
        <section className="mt-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Kategori Produk</span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                Cari Berdasarkan <span className="text-primary-600">Kebutuhan.</span>
              </h2>
            </div>
            <Link to="/produk" className="group flex items-center gap-2 text-stone-400 hover:text-primary-600 transition-colors font-bold text-sm">
              Lihat Semua Kategori <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Camilan', icon: ShoppingBag, color: 'from-orange-500 to-orange-600', category: 'Makanan Ringan' },
              { label: 'Kue & Roti', icon: Store, color: 'from-amber-500 to-amber-600', category: 'Kue & Roti' },
              { label: 'Olahan', icon: Zap, color: 'from-emerald-500 to-emerald-600', category: 'Makanan Olahan' },
              { label: 'Minuman', icon: Truck, color: 'from-sky-500 to-sky-600', category: 'Minuman' }
            ].map((cat, idx) => (
              <Link to={`/produk?category=${encodeURIComponent(cat.category)}`} key={idx}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative h-40 rounded-[2rem] overflow-hidden group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                    <cat.icon size={32} className="mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                    <span className="font-sans font-black uppercase tracking-widest text-xs">{cat.label}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* UMKM Highlight */}
        <section className="mt-32 bg-stone-900 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-accent-600/5 blur-[100px]" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-xl">
                <span className="text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Mitra Terpilih</span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                  UMKM <span className="text-primary-400">Unggulan</span> Desa.
                </h2>
              </div>
              <Link to="/umkm" className="group flex items-center gap-2 text-stone-500 hover:text-primary-400 transition-colors font-bold text-sm">
                Lihat Semua Mitra <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loadingUmkm ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => <UmkmSkeleton key={i} />)}
              </div>
            ) : (
              <Swiper 
                spaceBetween={30} 
                slidesPerView={isDesktop ? 3 : 1.2}
                grabCursor={true}
                className="!overflow-visible"
              >
                {umkmList.slice(0, 6).map(u => (
                  <SwiperSlide key={u.id_umkm}>
                    <UmkmCard umkm={u} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="mt-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Katalog Produk</span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                Produk <span className="text-primary-600">Terbaik</span> Hari Ini.
              </h2>
            </div>
            <Link to="/produk" className="group flex items-center gap-2 text-stone-400 hover:text-primary-600 transition-colors font-bold text-sm">
              Lihat Katalog Lengkap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProduk ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {produkUnggulan.map((p, i) => (
                <ScrollReveal key={p.id_produk} delay={i * 0.05}>
                  <ProductCard produk={p} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        {/* News Section */}
        <section className="mt-32 max-w-7xl mx-auto px-6">
          <div className="bg-primary-50 rounded-[3rem] p-8 md:p-16 border border-primary-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/30 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-xl">
                  <span className="text-primary-700 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Berita & Artikel</span>
                  <h2 className="font-display text-4xl font-black text-stone-900">Warta <span className="text-primary-600">Wongsorejo.</span></h2>
                </div>
                <Link to="/news" className="group flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors font-bold text-sm">
                  Baca Semua Berita <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {loadingNews ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white/50 rounded-3xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestNews.map((news, index) => (
                    <NewsCard key={news.id_news} news={news} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
