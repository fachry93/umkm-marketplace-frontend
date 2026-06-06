import { useState } from 'react';
import { NewsAPI } from '../../data/repositories/NewsAPI';
import toast from 'react-hot-toast';

export function useNews() {
  const [newsList, setNewsList] = useState([]);
  const [newsDetail, setNewsDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  const fetchNews = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await NewsAPI.getAll(page);
      if (res.meta) {
        setNewsList(res.data || []);
        setMeta(res.meta);
      } else {
        setNewsList(res.data || res || []);
        setMeta({ total: (res.data || res || []).length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error('Gagal mengambil berita');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewsById = async (id) => {
    setIsLoading(true);
    try {
      const res = await NewsAPI.getById(id);
      setNewsDetail(res.data || res);
    } catch (error) {
      toast.error('Gagal mengambil detail berita');
    } finally {
      setIsLoading(false);
    }
  };

  return { newsList, newsDetail, isLoading, meta, fetchNews, fetchNewsById };
}
