import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleCrabRoulette(io: SocketIOServer, socket: Socket) {
  socket.on('roulette:bet', (data: { sessionId: string; bets: Array<{ type: string; value: string | number; amount: number }> }) => {
    // Broadcast bet placement to room
    io.to(`game:${data.sessionId}`).emit('roulette:betPlaced', {
      playerId: socket.id,
      bets: data.bets,
    });
  });

  socket.on('roulette:join', (data: { sessionId: string }) => {
    socket.join(`game:${data.sessionId}`);
    io.to(`game:${data.sessionId}`).emit('roulette:playerJoined', {
      playerId: socket.id,
    });
  });

  socket.on('roulette:spin', (data: { sessionId: string }) => {
    // Only the round manager can trigger spin
    io.to(`game:${data.sessionId}`).emit('roulette:spinning', {
      sessionId: data.sessionId,
    });
  });
}
