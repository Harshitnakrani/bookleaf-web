'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/events';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance && typeof window !== 'undefined') {
    socketInstance = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance!;
}

export function useRealtime(
  onEvent?: (event: string, data: any) => void,
  room?: string,
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      if (room) {
        socket.emit('join:room', { room });
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
      if (room) {
        socket.emit('join:room', { room });
      }
    }

    const eventNames = [
      'ticket:created',
      'ticket:triaged',
      'ticket:message',
      'ticket:updated',
    ];

    const listeners = eventNames.map((evt) => {
      const listener = (payload: any) => {
        if (onEvent) {
          onEvent(evt, payload);
        }
      };
      socket.on(evt, listener);
      return { evt, listener };
    });

    // Also support fallback Server-Sent Events stream
    let eventSource: EventSource | null = null;
    try {
      const sseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/realtime/stream`;
      eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && onEvent) {
            onEvent(parsed.event, parsed.data);
          }
        } catch {}
      };
    } catch {}

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      listeners.forEach(({ evt, listener }) => socket.off(evt, listener));
      if (eventSource) eventSource.close();
    };
  }, [onEvent, room]);

  return { isConnected };
}
