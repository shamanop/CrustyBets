'use client';
import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/realtime/socket';

export function useSocket(auth?: { apiKey?: string; sessionToken?: string }) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = connectSocket(auth);

    return () => {
      // Don't disconnect on unmount - let the connection persist
    };
  }, [auth]);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  const joinGame = useCallback((sessionId: string) => {
    socketRef.current?.emit('game:join', { sessionId });
  }, []);

  const leaveGame = useCallback((sessionId: string) => {
    socketRef.current?.emit('game:leave', { sessionId });
  }, []);

  const spectateGame = useCallback((sessionId: string) => {
    socketRef.current?.emit('spectate:join', { sessionId });
  }, []);

  return { socket: socketRef.current, emit, on, joinGame, leaveGame, spectateGame };
}
