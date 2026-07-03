import { io, type Socket } from 'socket.io-client';
import { getToken } from './api';

let socket: Socket | null = null;

/** Shared chat socket — connects lazily with the current JWT, reused across pages. */
export function getChatSocket(): Socket {
  if (!socket) {
    socket = io({ auth: { token: getToken() }, autoConnect: true });
  }
  return socket;
}

export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}
