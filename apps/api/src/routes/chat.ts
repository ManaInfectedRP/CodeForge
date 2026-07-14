import { Router } from 'express';
import type { ChatMessageDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { imageUpload } from '../lib/upload.ts';
import { CHAT_ROOMS } from '../chat/socket.ts';

export const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.get(
  '/rooms',
  h(async (_req, res) => {
    res.json(CHAT_ROOMS);
  })
);

chatRouter.post(
  '/upload',
  imageUpload.single('image'),
  h(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No image file received');

    const sender = await prisma.user.findUniqueOrThrow({
      where: { id: req.auth!.sub },
      select: { bannedAt: true, chatBlockedAt: true },
    });
    if (sender.bannedAt) throw new HttpError(403, 'Your account has been banned');
    if (sender.chatBlockedAt) throw new HttpError(403, 'You are blocked from posting in chat, an admin can lift this');

    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  })
);

chatRouter.get(
  '/:room/messages',
  h(async (req, res) => {
    const room = req.params.room;
    if (!(CHAT_ROOMS as readonly string[]).includes(room)) throw new HttpError(404, 'Unknown room');

    const messages = await prisma.chatMessage.findMany({
      where: { room },
      include: { user: { select: { username: true, avatarUrl: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const body: ChatMessageDto[] = messages.reverse().map((m) => ({
      id: m.id,
      room: m.room,
      userId: m.userId,
      username: m.user.username,
      avatarUrl: m.user.avatarUrl,
      role: m.user.role,
      content: m.content,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt.toISOString(),
    }));
    res.json(body);
  })
);
