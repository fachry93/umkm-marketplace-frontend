import { motion } from 'framer-motion'
import { ShoppingCart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ProductCard({ produk }) {
  const isHabis = produk.stok === 0

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="group"
    >
      <Link to={`/produk/${produk.id_produk}`}>
        <div className="bg-white rounded-[2rem] shadow-card border border-stone-100 overflow-hidden
                        transition-all duration-500 hover:shadow-premium relative">
          
          {/* Gambar produk */}
          <div className="aspect-[4/5] overflow-hidden relative bg-stone-50">
            {produk.gambar
              ? <img
                  src={produk.gambar}
                  alt={produk.nama_produk}
                  className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-110"
                  loading="lazy"
                />
              : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">🛍️</span>
                </div>
            }

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            {/* Badge stok habis */}
            {isHabis && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white text-stone-900 font-sans text-[10px] font-black uppercase tracking-widest
                                 px-4 py-2 rounded-full shadow-xl">
                  Stok Habis
                </span>
              </div>
            )}

            {/* Badge UMKM — Floating */}
            {produk.umkm && (
              <div className="absolute top-4 left-4 right-4">
                <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/20 max-w-full">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-stone-800 font-sans text-[10px] font-bold truncate">
                    {produk.umkm.nama_umkm}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info produk */}
          <div className="p-5">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-sans text-sm font-bold text-stone-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                {produk.nama_produk}
              </h3>
            </div>

            {/* Harga */}
            <div className="mb-4">
              <span className="font-display text-lg font-black text-primary-600">
                Rp {Number(produk.harga).toLocaleString('id-ID')}
              </span>
            </div>

            {/* Footer Card */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-stone-50">
              {produk.umkm && (
                <div className="flex items-center gap-1 text-stone-400">
                  <MapPin size={12} />
                  <span className="font-sans text-[10px] font-medium">{produk.umkm.desa}</span>
                </div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                  ${isHabis 
                    ? 'bg-stone-100 text-stone-400' 
                    : 'bg-primary-600 text-white shadow-green group-hover:bg-primary-500'}`}
              >
                <ShoppingCart size={16} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
