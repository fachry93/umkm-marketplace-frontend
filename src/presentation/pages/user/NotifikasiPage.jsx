import React, { useEffect } from 'react';
import { Bell, CheckCheck, Inbox, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animation/PageTransition';
import { StaggerList, StaggerItem } from '../../components/animation/StaggerList';
import { useNotifikasi } from '../../hooks/useNotifikasi';
import { Link, useNavigate } from 'react-router-dom';

export default function NotifikasiPage() {
  const { notifikasi, unreadCount, isLoading, fetchNotifikasi, markAsRead, markAllAsRead } = useNotifikasi();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifikasi();
    }
  }, []);

  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <PageTransition>
        <div className="bg-stone-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-stone-100 flex items-center justify-center text-stone-300 mb-6">
            <Bell size={40} />
          </div>
          <h3 className="font-display text-2xl font-black text-stone-900">Akses Terbatas</h3>
          <p className="text-sm text-stone-500 font-sans mt-2 max-w-xs mx-auto">Silakan masuk ke akun Anda untuk menerima dan melihat notifikasi terbaru.</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Pusat Informasi</span>
                <h1 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-tight">
                  Notifikasi <span className="text-primary-600">Saya.</span>
                </h1>
              </div>
              
              {notifikasi.length > 0 && unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-50 text-primary-600 font-sans font-black uppercase tracking-widest text-[10px] border border-primary-100 transition-all"
                >
                  <CheckCheck size={16} /> Tandai Semua Dibaca
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-6 h-24 animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 bg-stone-50 rounded-full w-3/4" />
                    <div className="h-3 bg-stone-50 rounded-full w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifikasi.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-stone-100 p-20 text-center shadow-premium">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox size={40} className="text-stone-200" />
              </div>
              <h3 className="font-display text-2xl font-black text-stone-900">Kotak Masuk Kosong</h3>
              <p className="text-sm text-stone-500 font-sans mt-2">Belum ada notifikasi baru untuk akun Anda saat ini.</p>
            </div>
          ) : (
            <StaggerList className="space-y-4">
              {notifikasi.map((notif) => {
                const dateStr = new Date(notif.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <StaggerItem key={notif.id_notifikasi}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        if (!notif.status_baca) {
                          markAsRead(notif.id_notifikasi);
                        }
                      }}
                      className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex gap-5 items-start relative overflow-hidden ${
                        notif.status_baca
                          ? 'bg-white border-stone-100 shadow-sm opacity-70'
                          : 'bg-white border-primary-100 shadow-premium'
                      }`}
                    >
                      {!notif.status_baca && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600" />
                      )}

                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        notif.status_baca ? 'bg-stone-50 text-stone-300' : 'bg-primary-50 text-primary-600'
                      }`}>
                        <Bell size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-sans text-sm leading-relaxed mb-2 ${
                          notif.status_baca ? 'text-stone-500' : 'text-stone-900 font-bold'
                        }`}>
                          {notif.pesan}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                            {dateStr}
                          </span>
                          {!notif.status_baca && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-stone-200" />
                              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Baru</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerList>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
