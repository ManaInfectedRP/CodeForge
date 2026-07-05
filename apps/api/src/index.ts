import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createApp } from './app.ts';
import { setupChat } from './chat/socket.ts';

const port = Number(process.env.PORT ?? 4000);

const httpServer = createServer(createApp());
const io = new Server(httpServer, { cors: { origin: true } });
setupChat(io);

httpServer.listen(port, () => {
  console.log(`Kodstigen API listening on http://localhost:${port}`);
});
