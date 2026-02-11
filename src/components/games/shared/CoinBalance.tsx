'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinBalanceProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoinBalance({ balance, size = 'md' }: CoinBalanceProps) {
  const sizes = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-sm border-2 ${sizes[size]}`}
      style={{
        borderColor: '#ea9e2b',
        backgroundColor: 'rgba(234,158,43,0.1)',
        boxShadow: '0 0 10px rgba(234,158,43,0.15)',
      }}
    >
      <span className="text-base">🪙</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={balance}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}
        >
          {balance.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
