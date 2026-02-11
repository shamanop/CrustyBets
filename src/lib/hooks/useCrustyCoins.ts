'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface ClaimResult {
  success: boolean;
  amount?: number;
  error?: string;
  nextClaimAt?: number;
  remainingSeconds?: number;
}

export function useCrustyCoins() {
  const { data: session, status, update: updateSession } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync from session when available
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setIsAuthenticated(true);
      // Use session balance as initial / fallback
      if (balance === null && session.user.crustyCoins !== undefined) {
        setBalance(session.user.crustyCoins);
      }
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setIsAuthenticated(false);
      setBalance(null);
      setLoading(false);
    }
  }, [status, session]);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/session/balance', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        // Fall back to session balance if the balance API isn't set up
        if (session?.user?.crustyCoins !== undefined) {
          setBalance(session.user.crustyCoins);
          setIsAuthenticated(true);
        } else {
          setBalance(null);
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.error('[useCrustyCoins] failed to fetch balance:', err);
      // Fall back to session balance on error
      if (session?.user?.crustyCoins !== undefined) {
        setBalance(session.user.crustyCoins);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const claimDaily = useCallback(async (): Promise<ClaimResult> => {
    try {
      const res = await fetch('/api/session/claim-daily', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
        // Refresh the NextAuth session to sync crustyCoins
        await updateSession();
        return { success: true, amount: data.data.amount };
      }
      return {
        success: false,
        error: data.error,
        nextClaimAt: data.data?.nextClaimAt,
        remainingSeconds: data.data?.remainingSeconds,
      };
    } catch (err) {
      console.error('[useCrustyCoins] daily claim network error:', err);
      return { success: false, error: 'Network error' };
    }
  }, [updateSession]);

  const deduct = useCallback((amount: number) => {
    setBalance((prev) => (prev !== null ? prev - amount : prev));
  }, []);

  const credit = useCallback((amount: number) => {
    setBalance((prev) => (prev !== null ? prev + amount : prev));
  }, []);

  return { balance, loading, isAuthenticated, fetchBalance, claimDaily, deduct, credit };
}
