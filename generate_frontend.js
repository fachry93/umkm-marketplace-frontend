import fs from 'fs';
import path from 'path';

const files = {
  'tailwind.config.js': `module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        stone: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          400: '#a8a29e',
          600: '#57534e',
          800: '#292524',
          900: '#1c1917',
        },
        success: '#16a34a',
        warning: '#d97706',
        error:   '#dc2626',
        info:    '#2563eb',
      },
      fontFamily: {
        display: ['"Lora"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':    '0 2px 8px rgba(28,25,23,0.08), 0 1px 2px rgba(28,25,23,0.06)',
        'card-lg': '0 8px 24px rgba(28,25,23,0.12), 0 2px 8px rgba(28,25,23,0.08)',
        'green':   '0 4px 14px rgba(22,163,74,0.3)',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease-out forwards',
        'fade-in':    'fadeIn 0.3s ease-out forwards',
        'slide-up':   'slideUp 0.35s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      },
    }
  },
  plugins: [],
}
`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

body {
  @apply bg-stone-50 text-stone-900 font-sans;
}
`,

  'src/App.jsx': `import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './presentation/router/AppRouter';

function App() {
  return <RouterProvider router={AppRouter} />;
}
export default App;
`,

  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import { ParallaxProvider } from 'react-scroll-parallax'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

import '@fontsource/lora/400.css'
import '@fontsource/lora/600.css'
import '@fontsource/lora/700.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ParallaxProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            background: '#1c1917',
            color: '#fafaf9',
            padding: '12px 16px'
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' }
          }
        }}
      />
    </ParallaxProvider>
  </React.StrictMode>
)
`,

  'src/data/api/axiosInstance.js': `import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
`,

  'src/presentation/components/animation/PageTransition.jsx': `import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.2 } }
}

export function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageVariants} initial="initial" animate="animate" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
`,

  'src/presentation/components/animation/StaggerList.jsx': `import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

export function StaggerList({ children, className }) {
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }) {
  return <motion.div className={className} variants={item}>{children}</motion.div>
}
`,

  'src/presentation/components/animation/ScrollReveal.jsx': `import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function ScrollReveal({ children, delay = 0, className }) {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
`,

  'src/presentation/components/ui/StatusBadge.jsx': `const statusConfig = {
  pending:    { label: 'Menunggu',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  diproses:   { label: 'Diproses', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  selesai:    { label: 'Selesai',  color: 'bg-green-100 text-green-700 border-green-200' },
  dibatalkan: { label: 'Batal',    color: 'bg-red-100 text-red-700 border-red-200' },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold border \${config.color}\`}>
      {config.label}
    </span>
  )
}
`,

  'src/presentation/components/ui/SkeletonCard.jsx': `export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-stone-100 animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-4 bg-stone-200 rounded-full w-1/2" />
        <div className="h-3 bg-stone-200 rounded-full w-1/3" />
        <div className="h-10 bg-stone-200 rounded-xl mt-2" />
      </div>
    </div>
  )
}
`,

  'src/presentation/components/ui/QrisModal.jsx': `import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function QrisModal({ isOpen, onClose, qrisUrl }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-lg mx-auto px-6 pt-5 pb-safe"
          >
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-stone-900">Scan QR untuk Bayar</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100"><X size={20} className="text-stone-500" /></button>
            </div>
            <p className="font-sans text-stone-500 text-sm mb-5">Scan QR code berikut dengan aplikasi m-Banking atau e-wallet kamu. Setelah transfer, hubungi penjual untuk konfirmasi.</p>
            <div className="flex justify-center mb-6">
              <div className="border-2 border-stone-200 rounded-2xl p-4 shadow-card">
                <img src={qrisUrl} alt="QR Code QRIS" className="w-52 h-52 object-contain" />
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full bg-primary-600 text-white font-sans font-semibold py-4 rounded-2xl text-base shadow-green"
            >Saya Sudah Transfer</motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
`,

  'src/presentation/components/ui/ProductCard.jsx': `import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ProductCard({ produk }) {
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(produk.harga)
  return (
    <motion.div whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }} className="bg-white rounded-2xl shadow-card overflow-hidden border border-stone-100">
      <Link to={\`/produk/\${produk.id_produk}\`}>
        <div className="aspect-square overflow-hidden bg-stone-100 relative">
          <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
          {produk.stok === 0 && (
            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
              <span className="text-white font-sans font-semibold text-sm bg-stone-800 px-3 py-1 rounded-full">Habis</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-sans font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mb-1">{produk.nama_produk}</h3>
          <p className="font-sans font-bold text-primary-600 text-base">{formattedPrice}</p>
          <p className="font-sans text-stone-400 text-xs mt-0.5">Stok: {produk.stok}</p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <motion.button whileTap={{ scale: 0.95 }} disabled={produk.stok === 0} className="w-full flex items-center justify-center gap-2 bg-primary-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-sans font-semibold text-sm py-2.5 rounded-xl transition-colors active:bg-primary-700">
          <ShoppingCart size={16} /> Beli Sekarang
        </motion.button>
      </div>
    </motion.div>
  )
}
`,

  'src/presentation/components/layout/BottomNavBar.jsx': `import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, Newspaper, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = [
  { to: '/',          icon: Home,       label: 'Beranda' },
  { to: '/produk',    icon: ShoppingBag, label: 'Produk'  },
  { to: '/news',      icon: Newspaper,  label: 'Berita'  },
  { to: '/notifikasi',icon: Bell,       label: 'Notif',  badge: true },
  { to: '/profil',    icon: User,       label: 'Profil'  },
]

export function BottomNavBar() {
  const unreadCount = 0; // Replace with useNotifikasi hook when implemented
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 pb-safe shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative">
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'text-primary-600' : 'text-stone-400'} />
                  {badge && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className={\`text-[10px] font-sans font-semibold \${isActive ? 'text-primary-600' : 'text-stone-400'}\`}>{label}</span>
                {isActive && <motion.div layoutId="tab-indicator" className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full" />}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content);
}
