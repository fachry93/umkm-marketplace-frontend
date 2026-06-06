import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { useTransaksi } from '../../hooks/useTransaksi';
import TransaksiItem from '../../components/ui/TransaksiItem';
import Pagination from '../../components/ui/Pagination';
import { Link, useNavigate } from 'react-router-dom';

export default function RiwayatPage() {
  const { transaksiList, meta, fetchMyTransactions, isLoading } = useTransaksi();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMyTransactions(page);
    }
  }, [page]);

  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <PageTransition>
        <div className="bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-stone-100 flex items-center justify-center text-stone-300 mb-6">
            <ShoppingBag size={40} />
          </div>
          <h3 className="font-display text-2xl font-black text-stone-900">Akses Terbatas</h3>
          <p className="text-sm text-stone-500 font-sans mt-2 max-w-xs mx-auto">Silakan masuk ke akun Anda untuk melihat riwayat belanja produk UMKM.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="mt-8 bg-primary-600 text-white font-sans font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl shadow-green-lg"
          >
            Masuk Sekarang
          </motion.button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-stone-50 min-h-screen pb-32">
        {/* Header Section */}
        <div className="bg-white border-b border-stone-100 pt-10 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Aktivitas Belanja</span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
              Riwayat <span className="text-primary-600">Pesanan.</span>
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-8 h-48 animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-stone-50 rounded-full w-1/4" />
                    <div className="h-8 bg-stone-50 rounded-xl w-24" />
                  </div>
                  <div className="h-1 bg-stone-50 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-stone-50 rounded-xl" />
                    <div className="h-10 bg-stone-50 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : transaksiList.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <History size={40} className="text-stone-200" />
              </div>
              <h3 className="font-display text-2xl font-black text-stone-900">Belum Ada Transaksi</h3>
              <p className="text-sm text-stone-500 font-sans mt-2 mb-10">Anda belum pernah melakukan pemesanan produk UMKM.</p>
              <Link to="/produk">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white font-sans font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl shadow-green-lg"
                >
                  Mulai Belanja
                </motion.button>
              </Link>
            </div>
          ) : (
            <>
              <StaggerList className="space-y-6">
                {transaksiList.map((trx) => (
                  <StaggerItem key={trx.id_transaksi}>
                    <TransaksiItem transaksi={trx} />
                  </StaggerItem>
                ))}
              </StaggerList>
              <Pagination meta={meta} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
