import { useState } from 'react';
import { api } from '../../data/api/axiosInstance';
import toast from 'react-hot-toast';

export function useProduk() {
  const [produkList, setProdukList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  const fetchProduk = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/produk?page=${page}`);
      const body = res.data;
      if (body.meta) {
        setProdukList(body.data || []);
        setMeta(body.meta);
      } else {
        setProdukList(body.data || body || []);
        setMeta({ total: (body.data || body || []).length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error('Gagal mengambil data produk');
    } finally {
      setIsLoading(false);
    }
  };

  return { produkList, isLoading, meta, fetchProduk };
}
