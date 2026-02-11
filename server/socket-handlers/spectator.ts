import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleSpectator(io: SocketIOServer, socket: Socket) {
  socket.on('spectate:join', (data: { sessionId: string }) => {
    socket.join(`spectate:${data.sessionId}`);
    socket.emit('spectate:joined', { sessionId: data.sessionId });
  });

  socket.on('spectate:leave', (data: { sessionId: string }) => {
    socket.leave(`spectate:${data.sessionId}`);
  });
}
