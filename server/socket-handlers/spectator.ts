import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleSpectator(io: SocketIOServer, socket: Socket) {
  socket.on('spectate:join', (data: { sessionId: string }) => {
    console.log(`[SPECTATOR] spectate:join from ${socket.id} for session ${data.sessionId}`);
    socket.join(`spectate:${data.sessionId}`);
    socket.emit('spectate:joined', { sessionId: data.sessionId });
    console.log(`[SPECTATOR] ${socket.id} joined spectator room spectate:${data.sessionId}`);
  });

  socket.on('spectate:leave', (data: { sessionId: string }) => {
    console.log(`[SPECTATOR] spectate:leave from ${socket.id} for session ${data.sessionId}`);
    socket.leave(`spectate:${data.sessionId}`);
  });
}
