import type { Server, Socket } from 'socket.io';
import type { ChatMessageDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { verifyToken, type TokenPayload } from '../lib/jwt.ts';

export const CHAT_ROOMS = ['general', 'help', 'random', 'showcase'] as const;
export type ChatRoom = (typeof CHAT_ROOMS)[number];

const MAX_MESSAGE_LENGTH = 1000;

interface ChatSocket extends Socket {
  data: { auth?: TokenPayload; room?: string };
}

function isRoom(value: unknown): value is ChatRoom {
  return typeof value === 'string' && (CHAT_ROOMS as readonly string[]).includes(value);
}

function onlineCount(io: Server, room: string): number {
  return io.sockets.adapter.rooms.get(room)?.size ?? 0;
}

export function setupChat(io: Server) {
  io.use(async (socket: ChatSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') throw new Error('missing token');
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { bannedAt: true },
      });
      if (!user || user.bannedAt) throw new Error('banned');
      socket.data.auth = payload;
      next();
    } catch {
      next(new Error('Authentication required'));
    }
  });

  io.on('connection', (socket: ChatSocket) => {
    socket.on('chat:join', (room: unknown) => {
      if (!isRoom(room)) return;
      const previous = socket.data.room;
      if (previous) {
        socket.leave(previous);
        io.to(previous).emit('chat:presence', { room: previous, online: onlineCount(io, previous) });
      }
      socket.data.room = room;
      socket.join(room);
      io.to(room).emit('chat:presence', { room, online: onlineCount(io, room) });
      socket.emit('chat:presence', { room, online: onlineCount(io, room) });
    });

    socket.on('chat:send', async (payload: unknown, ack?: (r: { ok: boolean; error?: string }) => void) => {
      try {
        const { room, content } = (payload ?? {}) as { room?: unknown; content?: unknown };
        if (!isRoom(room)) throw new Error('Unknown room');
        const text = typeof content === 'string' ? content.trim() : '';
        if (!text) throw new Error('Message is empty');
        if (text.length > MAX_MESSAGE_LENGTH) throw new Error(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);

        // blocked users may keep reading, but their posts are rejected
        const sender = await prisma.user.findUnique({
          where: { id: socket.data.auth!.sub },
          select: { bannedAt: true, chatBlockedAt: true },
        });
        if (!sender || sender.bannedAt) throw new Error('Your account has been banned');
        if (sender.chatBlockedAt) {
          throw new Error('You are blocked from posting in chat, an admin can lift this');
        }

        const message = await prisma.chatMessage.create({
          data: { room, content: text, userId: socket.data.auth!.sub },
          include: { user: { select: { username: true, avatarUrl: true, role: true } } },
        });

        const dto: ChatMessageDto = {
          id: message.id,
          room: message.room,
          userId: message.userId,
          username: message.user.username,
          avatarUrl: message.user.avatarUrl,
          role: message.user.role,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        };
        io.to(room).emit('chat:message', dto);
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: err instanceof Error ? err.message : 'Failed to send' });
      }
    });

    socket.on('disconnect', () => {
      const room = socket.data.room;
      if (room) {
        io.to(room).emit('chat:presence', { room, online: onlineCount(io, room) });
      }
    });
  });
}
