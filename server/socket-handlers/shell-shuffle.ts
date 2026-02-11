import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleShellShuffle(io: SocketIOServer, socket: Socket) {
  socket.on('shell:guess', (data: { sessionId: string; shell: number }) => {
    io.to(`game:${data.sessionId}`).emit('shell:guessed', {
      playerId: socket.id,
      shell: data.shell,
    });
  });

  socket.on('shell:reveal', (data: { sessionId: string }) => {
    io.to(`game:${data.sessionId}`).emit('shell:revealing', {
      sessionId: data.sessionId,
    });
  });
}
