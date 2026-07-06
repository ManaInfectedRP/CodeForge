import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

/** Shared chat socket, authenticates via the httpOnly auth cookie, reused across pages. */
export function getChatSocket(): Socket {
  if (!socket) {
    socket = io({ withCredentials: true, autoConnect: true });
  }
  return socket;
}

export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}
