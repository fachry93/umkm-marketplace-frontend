import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'

const navLinks = [
  { to: '/',        label: 'Beranda' },
  { to: '/umkm',    label: 'UMKM' },
  { to: '/produk',  label: 'Produk' },
  { to: '/news',    label: 'Berita' },
]

export function TopNavBar() {
  const { pathname } = useLocation()
  
  return (
    <header className="hidden lg:flex sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="max-w-7xl mx-auto w-full px-8 h-20 flex items-center justify-between">
        
        {/* Logo + Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img 
            whileHover={{ rotate: -10, scale: 1.1 }}
            src="/icons/icon-192.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-black text-stone-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors">
              Wongsorejo<span className="text-primary-600">.</span>
            </span>
            <span className="font-sans text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mt-0.5">
              Marketplace UMKM
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200/50">
          {navLinks.map(link => {
            const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to} className="relative px-5 py-2.5">
                {active && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-stone-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 font-sans text-sm font-bold transition-colors
                  ${active ? 'text-primary-700' : 'text-stone-500 hover:text-stone-900'}`}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Link to="/riwayat" className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 transition-all hover:text-primary-600">
            <ShoppingBag size={22} />
          </Link>

          <Link to="/notifikasi" className="relative p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 transition-all hover:text-primary-600">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>
          
          <div className="h-8 w-[1px] bg-stone-200 mx-1" />

          <Link to="/profil"
            className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
              <User size={18} />
            </div>
            <span className="font-sans text-sm font-bold text-stone-700">Profil</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default TopNavBar;
