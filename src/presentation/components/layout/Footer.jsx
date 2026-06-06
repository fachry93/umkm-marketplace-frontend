import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ShoppingBag, Instagram, Facebook, Globe, MessageCircle } from 'lucide-react'

const WHATSAPP_ADMIN_NUMBER = '6287853847272';
const WHATSAPP_MESSAGE = `Halo admin, saya ingin bertanya tentang produk di Marketplace UMKM Wongsorejo.`;
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-32 w-full relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/icons/icon-192.png" alt="Logo" className="w-12 h-12 object-contain group-hover:rotate-6 transition-transform" />
              <div className="flex flex-col">
                <span className="font-display font-black text-white text-2xl tracking-tight">
                  Wongsorejo<span className="text-primary-500">.</span>
                </span>
                <span className="font-sans text-[10px] font-black text-stone-500 uppercase tracking-[0.3em]">Marketplace UMKM</span>
              </div>
            </Link>
            
            <p className="font-sans text-base text-stone-400 leading-relaxed max-w-sm">
              Platform digital terintegrasi untuk memberdayakan ekonomi kreatif dan produk unggulan desa di Kecamatan Wongsorejo.
            </p>

            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-primary-600 hover:text-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="font-sans font-black text-white text-xs uppercase tracking-[0.2em]">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { label: 'Beranda', to: '/' },
                { label: 'Daftar UMKM', to: '/umkm' },
                { label: 'Katalog Produk', to: '/produk' },
                { label: 'Warta Desa', to: '/news' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-sans text-sm hover:text-primary-500 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-primary-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="font-sans font-black text-white text-xs uppercase tracking-[0.2em]">Lokasi Kami</h4>
            <div className="p-6 rounded-[2rem] bg-stone-800/50 border border-white/5 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-sans text-sm text-white font-bold mb-1">Kecamatan Wongsorejo</p>
                  <p className="font-sans text-xs text-stone-500 leading-relaxed">
                    Kabupaten Banyuwangi, Jawa Timur<br />
                    Indonesia, 68453
                  </p>
                </div>
              </div>
              
              {/* WhatsApp Contact */}
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="font-sans text-sm text-white font-bold mb-0.5">Hubungi Kami</p>
                  <p className="font-sans text-xs text-stone-500">Via WhatsApp</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-stone-600">
            © 2026 Wongsorejo Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/50 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-sans text-[10px] font-black text-stone-400 uppercase tracking-tighter">Sistem Berjalan Normal</span>
          </div>
        </div>
        
        {/* Mobile Spacer for Bottom Nav */}
        <div className="h-24 lg:hidden" />
      </div>
    </footer>
  )
}

export default Footer;
