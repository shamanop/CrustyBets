import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleShellShuffle(io: SocketIOServer, socket: Socket) {
  socket.on('shell:guess', (data: { sessionId: string; shell: number }) => {
    console.log(`[SHELL-SHUFFLE] shell:guess from ${socket.id} in session ${data.sessionId} - shell=${data.shell}`);
    io.to(`game:${data.sessionId}`).emit('shell:guessed', {
      playerId: socket.id,
      shell: data.shell,
    });
  });

  socket.on('shell:reveal', (data: { sessionId: string }) => {
    console.log(`[SHELL-SHUFFLE] shell:reveal from ${socket.id} in session ${data.sessionId}`);
    io.to(`game:${data.sessionId}`).emit('shell:revealing', {
      sessionId: data.sessionId,
    });
  });
}
