import { useState } from 'react';
import { TransaksiAPI } from '../../data/repositories/TransaksiAPI';
import toast from 'react-hot-toast';

export function useTransaksi() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [transaksiDetail, setTransaksiDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  const fetchMyTransactions = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await TransaksiAPI.getMine(page);
      if (res.meta) {
        setTransaksiList(res.data || []);
        setMeta(res.meta);
      } else {
        setTransaksiList(res.data || res || []);
        setMeta({ total: (res.data || res || []).length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error('Gagal mengambil riwayat transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllTransactions = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await TransaksiAPI.getAll(page);
      if (res.meta) {
        setTransaksiList(res.data || []);
        setMeta(res.meta);
      } else {
        setTransaksiList(res.data || res || []);
        setMeta({ total: (res.data || res || []).length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error('Gagal mengambil semua transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionById = async (id) => {
    setIsLoading(true);
    try {
      const res = await TransaksiAPI.getById(id);
      setTransaksiDetail(res.data || res);
      return res.data || res;
    } catch (error) {
      toast.error('Gagal mengambil detail transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (data) => {
    setIsLoading(true);
    try {
      const res = await TransaksiAPI.create(data);
      toast.success('Transaksi berhasil dibuat');
      return res.data || res;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal membuat transaksi';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setIsLoading(true);
    try {
      const res = await TransaksiAPI.updateStatus(id, status);
      toast.success('Status transaksi berhasil diperbarui');
      return res.data || res;
    } catch (error) {
      toast.error('Gagal memperbarui status transaksi');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transaksiList,
    transaksiDetail,
    isLoading,
    meta,
    fetchMyTransactions,
    fetchAllTransactions,
    fetchTransactionById,
    createTransaction,
    updateStatus
  };
}
