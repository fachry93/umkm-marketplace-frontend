import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function QrisModal({ isOpen, onClose, qrisUrl }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-lg mx-auto px-6 pt-5 pb-safe"
          >
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-stone-900">Scan QR untuk Bayar</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100"><X size={20} className="text-stone-500" /></button>
            </div>
            <p className="font-sans text-stone-500 text-sm mb-5">Scan QR code berikut dengan aplikasi m-Banking atau e-wallet kamu. Setelah transfer, hubungi penjual untuk konfirmasi.</p>
            <div className="flex justify-center mb-6">
              <div className="border-2 border-stone-200 rounded-2xl p-4 shadow-card">
                <img src={qrisUrl} alt="QR Code QRIS" className="w-52 h-52 object-contain" />
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full bg-primary-600 text-white font-sans font-semibold py-4 rounded-2xl text-base shadow-green"
            >Saya Sudah Transfer</motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
