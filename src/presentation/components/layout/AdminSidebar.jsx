import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Receipt,
  Bell,
  Newspaper,
  QrCode,
  User,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Admin logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/umkm', icon: Store, label: 'Kelola UMKM' },
    { to: '/admin/produk', icon: ShoppingBag, label: 'Kelola Produk' },
    { to: '/admin/transaksi', icon: Receipt, label: 'Transaksi' },
    { to: '/admin/notifikasi/kirim', icon: Bell, label: 'Kirim Notifikasi' },
    { to: '/admin/news', icon: Newspaper, label: 'Kelola Berita' },
    { to: '/admin/qris', icon: QrCode, label: 'Konfigurasi QRIS' },
    { to: '/admin/profil', icon: User, label: 'Profil Admin' },
  ];

  return (
    <aside className="w-80 bg-stone-950 text-stone-100 flex flex-col h-full border-r border-stone-900 shadow-2xl">
      {/* Sidebar Header */}
      <div className="px-8 py-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-green-lg">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                Nexus<span className="text-primary-600">Admin</span>
              </h2>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 lg:hidden transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <p className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] ml-13">
          Wongsorejo Marketplace
        </p>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-black text-stone-700 uppercase tracking-[0.3em]">Main Menu</span>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin/dashboard'}
            className={({ isActive }) =>
              `group flex items-center justify-between px-5 py-4 rounded-[1.5rem] text-sm font-sans font-black transition-all duration-300 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-green-lg'
                  : 'text-stone-500 hover:bg-white/5 hover:text-white'
              }`
            }
            onClick={onClose}
          >
            <div className="flex items-center gap-4">
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut size={18} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}

function Shield({ size }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
