import { useState } from 'react';
import { NotifikasiAPI } from '../../data/repositories/NotifikasiAPI';
import toast from 'react-hot-toast';

export function useNotifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifikasi = async () => {
    setIsLoading(true);
    try {
      const res = await NotifikasiAPI.getAll();
      const list = res.data || res || [];
      setNotifikasi(list);
      setUnreadCount(list.filter(n => !n.status_baca).length);
    } catch (error) {
      toast.error('Gagal mengambil notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await NotifikasiAPI.markRead(id);
      // Update local state without refetching
      setNotifikasi(prev =>
        prev.map(n => n.id_notifikasi === id ? { ...n, status_baca: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Gagal menandai notifikasi dibaca');
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotifikasiAPI.markAllRead();
      setNotifikasi(prev =>
        prev.map(n => ({ ...n, status_baca: true }))
      );
      setUnreadCount(0);
      toast.success('Semua notifikasi ditandai dibaca');
    } catch (error) {
      toast.error('Gagal menandai semua dibaca');
    }
  };

  return { notifikasi, unreadCount, isLoading, fetchNotifikasi, markAsRead, markAllAsRead };
}
