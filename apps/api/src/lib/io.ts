import type { Server } from 'socket.io';

let ioInstance: Server | null = null;

export function setIo(io: Server) {
  ioInstance = io;
}

/** null until the http server has finished booting, routes that fire before then simply skip the push. */
export function getIo(): Server | null {
  return ioInstance;
}

export function userRoom(userId: string): string {
  return `user:${userId}`;
}
