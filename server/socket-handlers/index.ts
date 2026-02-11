import { Server as SocketIOServer, Socket } from 'socket.io';
// Import individual game handlers
import { handleClawMachine } from './claw-machine';
import { handleShellShuffle } from './shell-shuffle';
import { handleCrabRoulette } from './crab-roulette';
import { handleSpectator } from './spectator';

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Auth middleware - check for apiKey or session token
    const apiKey = socket.handshake.auth?.apiKey;
    const sessionToken = socket.handshake.auth?.sessionToken;

    if (!apiKey && !sessionToken) {
      // Allow anonymous spectating
      socket.data.role = 'spectator';
    } else {
      socket.data.role = 'player';
      socket.data.apiKey = apiKey;
    }

    // Game handlers
    handleClawMachine(io, socket);
    handleShellShuffle(io, socket);
    handleCrabRoulette(io, socket);
    handleSpectator(io, socket);

    // Room management
    socket.on('game:join', async (data: { sessionId: string }) => {
      socket.join(`game:${data.sessionId}`);
      socket.emit('game:joined', { sessionId: data.sessionId });
    });

    socket.on('game:leave', (data: { sessionId: string }) => {
      socket.leave(`game:${data.sessionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
