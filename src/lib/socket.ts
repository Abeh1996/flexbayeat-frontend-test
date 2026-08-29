// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://3.250.40.253:5000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.startsWith('http://')) {
    // If loaded over HTTPS, attempt HTTPS scheme for socket handshake to avoid browser Mixed Content block
    return envUrl.replace(/^http:/, 'https:');
  }
  return envUrl;
};

const SOCKET_URL = getSocketUrl();

/**
 * Get or create the singleton socket.io connection.
 * Automatically attaches the JWT from the global fb_session cookie.
 */
export function getSocket(): Socket {
  if (socket?.connected) return socket;

  const token =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((r) => r.startsWith('fb_session='))
          ?.split('=')[1]
      : undefined;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[socket] connected:', socket?.id);
    }
  });

  socket.on('connect_error', (err) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[socket] connect_error:', err.message);
    }
  });

  socket.on('disconnect', (reason) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[socket] disconnected:', reason);
    }
  });

  return socket;
}

/**
 * Disconnect and reset the singleton.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}