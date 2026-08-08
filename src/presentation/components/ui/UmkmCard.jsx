import { motion } from 'framer-motion'
import { MapPin, Package, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function UmkmCard({ umkm }) {
  const isPendampingan = umkm.status_pendampingan === 'Sudah Pendampingan'

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="group"
    >
      <Link to={`/umkm/${umkm.id_umkm}`}>
        <div className="bg-white rounded-[2.5rem] shadow-card border border-stone-100 overflow-hidden transition-all duration-500 hover:shadow-premium">
          {/* Header: Dynamic Gradient */}
          <div className="relative h-32 overflow-hidden bg-stone-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 opacity-90 group-hover:scale-110 transition-transform duration-700" />
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/20 rounded-full -ml-12 -mb-12 blur-xl" />

            {/* Logo Overlay */}
            <div className="absolute inset-0 flex items-center px-6 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl transform group-hover:rotate-3 transition-transform duration-500">
                <div className="w-full h-full rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden">
                  {umkm.logo
                    ? <img 
                        src={umkm.logo} 
                        alt={`Logo UMKM ${umkm.nama_umkm}`} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        decoding="async"
                      />
                    : <span className="font-display text-2xl font-black text-primary-600">
                        {umkm.nama_umkm.charAt(0)}
                      </span>
                  }
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-black text-white truncate leading-tight mb-1">
                  {umkm.nama_umkm}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                    {umkm.kategori}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-stone-400">
                  <MapPin size={14} className="text-primary-500" />
                  <span className="font-sans text-xs font-medium">
                    {umkm.desa}
                  </span>
                </div>
                {isPendampingan && (
                  <div className="flex items-center gap-1.5 text-accent-600 mt-1">
                    <ShieldCheck size={14} />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Terverifikasi</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-stone-900">
                  <Package size={14} className="text-stone-300" />
                  <span className="font-sans text-sm font-black">{umkm.produk?.length ?? 0}</span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter">Produk</span>
              </div>
            </div>

            {umkm.deskripsi && (
              <p className="font-sans text-xs text-stone-500 line-clamp-2 mb-6 leading-relaxed">
                {umkm.deskripsi}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-50">
              <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                Kunjungi Profil
              </span>
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
