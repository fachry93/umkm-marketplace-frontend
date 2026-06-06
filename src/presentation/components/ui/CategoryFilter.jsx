import { motion } from 'framer-motion'

const KATEGORI = ['Semua', 'Makanan Ringan', 'Kue & Roti', 'Makanan Olahan', 'Minuman', 'Kelompok Usaha']

export function CategoryFilter({ active, onChange, dark = false }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
      {KATEGORI.map(cat => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-6 py-2.5 rounded-xl font-sans text-xs font-black uppercase tracking-widest
                      transition-all duration-300 border
                      ${active === cat
                        ? 'bg-primary-600 border-primary-600 text-white shadow-green'
                        : dark 
                          ? 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white'
                          : 'bg-white border-stone-200 text-stone-500 hover:border-primary-500 hover:text-primary-600'
                      }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  )
}
