import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketHandlers } from './socket-handlers';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(`[SERVER] Preparing Next.js app (dev=${dev}, hostname=${hostname}, port=${port})...`);

app.prepare().then(() => {
  console.log('[SERVER] Next.js app prepared successfully');

  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: dev ? '*' : process.env.NEXT_PUBLIC_URL,
      methods: ['GET', 'POST'],
    },
    path: '/socket',
  });

  console.log(`[SERVER] Socket.IO server created (cors origin=${dev ? '*' : process.env.NEXT_PUBLIC_URL}, path=/socket)`);

  io.on('connection', (socket) => {
    console.log(`[SERVER] Socket.IO connection established: ${socket.id} from ${socket.handshake.address}`);
  });

  io.on('disconnect', (socket) => {
    console.log(`[SERVER] Socket.IO disconnection: ${socket.id}`);
  });

  setupSocketHandlers(io);
  console.log('[SERVER] Socket handlers registered');

  httpServer.listen(port, () => {
    console.log(`[SERVER] HTTP server bound to port ${port}`);
    console.log(`> CrustyBets ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO ready on ws://${hostname}:${port}/socket`);
  });
});
