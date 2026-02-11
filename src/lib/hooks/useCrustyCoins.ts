'use client';
import { useState, useEffect, useCallback } from 'react';

export function useCrustyCoins() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/economy/balance');
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const claimDaily = useCallback(async () => {
    try {
      const res = await fetch('/api/economy/claim-daily', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
        return { success: true, amount: data.data.amount };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const deduct = useCallback((amount: number) => {
    setBalance((prev) => prev - amount);
  }, []);

  const credit = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
  }, []);

  return { balance, loading, fetchBalance, claimDaily, deduct, credit };
}
