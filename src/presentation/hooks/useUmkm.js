import { useState } from 'react';
import { UmkmAPI } from '../../data/repositories/UmkmAPI';
import toast from 'react-hot-toast';

export function useUmkm() {
  const [umkmList, setUmkmList] = useState([]);
  const [umkmDetail, setUmkmDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  const fetchUmkm = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await UmkmAPI.getAll(page);
      if (res.meta) {
        setUmkmList(res.data || []);
        setMeta(res.meta);
      } else {
        setUmkmList(res.data || res || []);
        setMeta({ total: (res.data || res || []).length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error('Gagal mengambil data UMKM');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUmkmById = async (id) => {
    setIsLoading(true);
    try {
      const res = await UmkmAPI.getById(id);
      setUmkmDetail(res.data || res);
      return res.data || res;
    } catch (error) {
      toast.error('Gagal mengambil detail UMKM');
    } finally {
      setIsLoading(false);
    }
  };

  return { umkmList, umkmDetail, isLoading, meta, fetchUmkm, fetchNews: fetchUmkm, fetchUmkmById };
}
