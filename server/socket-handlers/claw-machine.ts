import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleClawMachine(io: SocketIOServer, socket: Socket) {
  socket.on('claw:move', (data: { sessionId: string; direction: string; duration: number }) => {
    // Broadcast claw movement to room (spectators)
    io.to(`game:${data.sessionId}`).emit('claw:moved', {
      direction: data.direction,
      duration: data.duration,
      playerId: socket.id,
    });
  });

  socket.on('claw:drop', (data: { sessionId: string }) => {
    io.to(`game:${data.sessionId}`).emit('claw:dropping', {
      playerId: socket.id,
    });
  });

  socket.on('claw:grab', (data: { sessionId: string }) => {
    io.to(`game:${data.sessionId}`).emit('claw:grabbing', {
      playerId: socket.id,
    });
  });
}
