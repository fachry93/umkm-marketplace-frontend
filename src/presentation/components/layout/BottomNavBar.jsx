import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Store, ShoppingBag, Newspaper, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifikasi } from '../../hooks/useNotifikasi'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/',       icon: Home,        label: 'Beranda' },
  { to: '/umkm',   icon: Store,       label: 'UMKM' },
  { to: '/produk', icon: ShoppingBag, label: 'Produk' },
  { to: '/news',   icon: Newspaper,   label: 'Berita' },
  { to: '/profil', icon: User,        label: 'Profil' },
]

export function BottomNavBar() {
  const { user } = useAuth()
  const { unreadCount, fetchNotifikasi } = useNotifikasi()
  const { pathname } = useLocation()

  useEffect(() => {
    if (user) {
      fetchNotifikasi()
    }
  }, [user])

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 z-40 px-6 pointer-events-none">
      <nav className="max-w-md mx-auto bg-stone-900/90 backdrop-blur-xl rounded-[2rem] p-2 shadow-2xl border border-white/10 pointer-events-auto">
        <div className="flex items-center justify-around relative">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} className="relative py-2 px-3 group flex flex-col items-center">
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors duration-300 ${isActive ? 'text-primary-400' : 'text-stone-400'}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>
                  
                  {label === 'Profil' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full
                                     flex items-center justify-center text-white text-[9px] font-bold border-2 border-stone-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="font-sans text-[9px] font-bold text-primary-400 mt-1 uppercase tracking-wider"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-bg"
                    className="absolute inset-0 bg-white/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
