import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TopBar({ title, showBack = false, showNotif = true }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path === '/') return 'Wongsorejo.';
    if (path.startsWith('/produk/')) return 'Detail Produk';
    if (path === '/produk') return 'Katalog Produk';
    if (path === '/umkm') return 'Daftar UMKM';
    if (path.startsWith('/umkm/')) return 'Profil UMKM';
    if (path === '/news') return 'Berita Desa';
    if (path.startsWith('/news/')) return 'Detail Berita';
    if (path === '/profil') return 'Profil Saya';
    if (path === '/notifikasi') return 'Notifikasi';
    if (path === '/riwayat') return 'Riwayat Transaksi';
    if (path.startsWith('/riwayat/')) return 'Detail Transaksi';
    if (path === '/transaksi/baru') return 'Checkout';
    if (path === '/transaksi/konfirmasi') return 'Konfirmasi';
    return 'Wongsorejo.';
  };

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-stone-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between h-16 max-w-lg mx-auto px-6">
        <div className="flex items-center gap-3">
          {showBack ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-900 border border-stone-100 shadow-sm"
            >
              <ChevronLeft size={20} />
            </motion.button>
          ) : isHome && (
            <img src="/icons/icon-192.png" alt="Logo" className="w-9 h-9 object-contain" />
          )}
          
          <h1 className={`font-display font-black tracking-tight ${isHome ? 'text-xl text-primary-600' : 'text-base text-stone-900'}`}>
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Riwayat Transaksi Button */}
          {showNotif && (
            <Link to="/riwayat">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-500 border border-stone-100 shadow-sm"
              >
                <ShoppingBag size={18} />
              </motion.button>
            </Link>
          )}

          {/* Notifikasi Bell */}
          {showNotif && (
            <Link to="/notifikasi">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-500 border border-stone-100 relative shadow-sm"
              >
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
