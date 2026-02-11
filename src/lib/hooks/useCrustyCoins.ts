'use client';
import { useState, useEffect, useCallback } from 'react';

export function useCrustyCoins() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    console.log('[useCrustyCoins] fetching balance...');
    try {
      const res = await fetch('/api/economy/balance');
      const data = await res.json();
      if (data.success) {
        console.log('[useCrustyCoins] balance fetched successfully:', data.data.balance);
        setBalance(data.data.balance);
      } else {
        console.warn('[useCrustyCoins] balance fetch returned unsuccessful response:', data);
      }
    } catch (err) {
      console.error('[useCrustyCoins] failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const claimDaily = useCallback(async () => {
    console.log('[useCrustyCoins] claiming daily reward...');
    try {
      const res = await fetch('/api/economy/claim-daily', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        console.log('[useCrustyCoins] daily reward claimed, amount:', data.data.amount, 'new balance:', data.data.balance);
        setBalance(data.data.balance);
        return { success: true, amount: data.data.amount };
      }
      console.warn('[useCrustyCoins] daily claim failed:', data.error);
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[useCrustyCoins] daily claim network error:', err);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const deduct = useCallback((amount: number) => {
    console.log('[useCrustyCoins] deducting:', amount);
    setBalance((prev) => {
      console.log('[useCrustyCoins] balance after deduct:', prev - amount);
      return prev - amount;
    });
  }, []);

  const credit = useCallback((amount: number) => {
    console.log('[useCrustyCoins] crediting:', amount);
    setBalance((prev) => {
      console.log('[useCrustyCoins] balance after credit:', prev + amount);
      return prev + amount;
    });
  }, []);

  return { balance, loading, fetchBalance, claimDaily, deduct, credit };
}
