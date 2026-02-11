'use client';
import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/realtime/socket';

export function useSocket(auth?: { apiKey?: string; sessionToken?: string }) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('[useSocket] attempting socket connection, auth:', auth ? 'provided' : 'none');
    socketRef.current = connectSocket(auth);

    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        console.log('[useSocket] socket connected successfully, id:', socketRef.current?.id);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('[useSocket] socket connection error:', err.message);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.warn('[useSocket] socket disconnected, reason:', reason);
      });

      socketRef.current.on('reconnect_attempt', (attempt) => {
        console.log('[useSocket] reconnection attempt #', attempt);
      });

      socketRef.current.on('reconnect', (attempt) => {
        console.log('[useSocket] reconnected after', attempt, 'attempts');
      });

      socketRef.current.on('reconnect_failed', () => {
        console.error('[useSocket] reconnection failed permanently');
      });
    } else {
      console.warn('[useSocket] connectSocket returned null/undefined');
    }

    return () => {
      // Don't disconnect on unmount - let the connection persist
      console.log('[useSocket] hook cleanup (connection persisted)');
    };
  }, [auth]);

  const emit = useCallback((event: string, data?: any) => {
    console.log('[useSocket] emitting event:', event, data ? JSON.stringify(data).substring(0, 200) : '');
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    console.log('[useSocket] subscribing to event:', event);
    socketRef.current?.on(event, callback);
    return () => {
      console.log('[useSocket] unsubscribing from event:', event);
      socketRef.current?.off(event, callback);
    };
  }, []);

  const joinGame = useCallback((sessionId: string) => {
    console.log('[useSocket] joining game session:', sessionId);
    socketRef.current?.emit('game:join', { sessionId });
  }, []);

  const leaveGame = useCallback((sessionId: string) => {
    console.log('[useSocket] leaving game session:', sessionId);
    socketRef.current?.emit('game:leave', { sessionId });
  }, []);

  const spectateGame = useCallback((sessionId: string) => {
    console.log('[useSocket] spectating game session:', sessionId);
    socketRef.current?.emit('spectate:join', { sessionId });
  }, []);

  return { socket: socketRef.current, emit, on, joinGame, leaveGame, spectateGame };
}
