'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  payout: number;
  message: string;
  details?: string;
}

export default function GameResultModal({ isOpen, onClose, won, payout, message, details }: GameResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
            className="p-8 rounded-sm border-3 max-w-sm mx-4 text-center"
            style={{
              backgroundColor: '#f5f5f0',
              borderColor: won ? '#39ff14' : '#ff2d55',
              boxShadow: won ? '0 0 40px rgba(57,255,20,0.3)' : '0 0 40px rgba(255,45,85,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">
              {won ? '🎉' : '😤'}
            </div>
            <h2
              className="text-3xl mb-2"
              style={{
                fontFamily: 'Permanent Marker, cursive',
                color: won ? '#39ff14' : '#ff2d55',
              }}
            >
              {won ? 'WINNER!' : 'NOT THIS TIME'}
            </h2>
            <p className="text-lg mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0a0a0f' }}>
              {message}
            </p>
            {payout > 0 && (
              <p className="text-2xl mb-4" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
                +{payout} CrustyCoins 🪙
              </p>
            )}
            {details && (
              <p className="text-sm mb-4 opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0a0a0f' }}>
                {details}
              </p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-sm border-2 border-[#0a0a0f] font-bold transition-all hover:scale-105"
              style={{ fontFamily: 'Bangers, cursive', backgroundColor: '#cc2c18', color: '#f5f5f0' }}
            >
              {won ? 'NICE!' : 'TRY AGAIN'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
