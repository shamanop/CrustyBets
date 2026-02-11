import { Server as SocketIOServer, Socket } from 'socket.io';
// Import individual game handlers
import { handleClawMachine } from './claw-machine';
import { handleShellShuffle } from './shell-shuffle';
import { handleCrabRoulette } from './crab-roulette';
import { handleSpectator } from './spectator';

export function setupSocketHandlers(io: SocketIOServer) {
  console.log('[SOCKET-HANDLERS] Setting up socket handlers');

  io.on('connection', (socket: Socket) => {
    console.log(`[SOCKET-HANDLERS] Client connected: ${socket.id}, address: ${socket.handshake.address}, transport: ${socket.handshake.query?.transport}`);

    // Auth middleware - check for apiKey or session token
    const apiKey = socket.handshake.auth?.apiKey;
    const sessionToken = socket.handshake.auth?.sessionToken;

    console.log(`[SOCKET-HANDLERS] Auth check for ${socket.id}: apiKey=${!!apiKey}, sessionToken=${!!sessionToken}`);

    if (!apiKey && !sessionToken) {
      // Allow anonymous spectating
      socket.data.role = 'spectator';
      console.log(`[SOCKET-HANDLERS] ${socket.id} assigned role: spectator (no credentials)`);
    } else {
      socket.data.role = 'player';
      socket.data.apiKey = apiKey;
      console.log(`[SOCKET-HANDLERS] ${socket.id} assigned role: player (auth: ${apiKey ? 'apiKey' : 'sessionToken'})`);
    }

    // Game handlers
    handleClawMachine(io, socket);
    handleShellShuffle(io, socket);
    handleCrabRoulette(io, socket);
    handleSpectator(io, socket);

    // Room management
    socket.on('game:join', async (data: { sessionId: string }) => {
      console.log(`[SOCKET-HANDLERS] ${socket.id} joining game room: game:${data.sessionId}`);
      socket.join(`game:${data.sessionId}`);
      socket.emit('game:joined', { sessionId: data.sessionId });
      console.log(`[SOCKET-HANDLERS] ${socket.id} joined game room: game:${data.sessionId}`);
    });

    socket.on('game:leave', (data: { sessionId: string }) => {
      console.log(`[SOCKET-HANDLERS] ${socket.id} leaving game room: game:${data.sessionId}`);
      socket.leave(`game:${data.sessionId}`);
    });

    socket.on('disconnect', (reason: string) => {
      console.log(`[SOCKET-HANDLERS] Client disconnected: ${socket.id}, reason: ${reason}, role: ${socket.data.role}`);
    });
  });
}
