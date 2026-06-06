import { Calendar, CreditCard, ArrowRight, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatusBadge } from './StatusBadge';

export default function TransaksiItem({ transaksi }) {
  const dateStr = new Date(transaksi.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(transaksi.total_harga);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-[2rem] border border-stone-100 p-6 shadow-card hover:shadow-premium transition-all duration-300"
    >
      <Link to={`/riwayat/${transaksi.id_transaksi}`} className="block group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
              <Hash size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Order ID</p>
              <p className="font-sans font-black text-stone-900 text-sm">#{transaksi.id_transaksi}</p>
            </div>
          </div>
          <StatusBadge status={transaksi.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 border-y border-stone-50">
          <div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Tanggal</p>
            <div className="flex items-center gap-2 text-stone-600">
              <Calendar size={14} className="text-primary-500" />
              <span className="text-xs font-bold">{dateStr}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Metode</p>
            <div className="flex items-center gap-2 text-stone-600">
              <CreditCard size={14} className="text-primary-500" />
              <span className="text-xs font-bold">{transaksi.metode_pembayaran}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Total Pembayaran</p>
            <p className="text-lg font-black text-primary-600">{formattedPrice}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-primary-600 group-hover:text-white transition-all">
            <ArrowRight size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
