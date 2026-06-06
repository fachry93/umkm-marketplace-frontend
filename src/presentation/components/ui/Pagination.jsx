import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total <= meta.limit) return null;

  const { total, page, limit } = meta;
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-10 pb-8">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:border-primary-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </motion.button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-10 text-center text-stone-400 text-sm font-sans">...</span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-sans font-bold transition-all ${
              p === page
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-primary-500'
            }`}
          >
            {p}
          </motion.button>
        )
      )}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:border-primary-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}
