import { Server as SocketIOServer, Socket } from 'socket.io';

export function handleCrabRoulette(io: SocketIOServer, socket: Socket) {
  socket.on('roulette:bet', (data: { sessionId: string; bets: Array<{ type: string; value: string | number; amount: number }> }) => {
    console.log(`[CRAB-ROULETTE] roulette:bet from ${socket.id} in session ${data.sessionId} - ${data.bets.length} bet(s): ${JSON.stringify(data.bets)}`);
    // Broadcast bet placement to room
    io.to(`game:${data.sessionId}`).emit('roulette:betPlaced', {
      playerId: socket.id,
      bets: data.bets,
    });
  });

  socket.on('roulette:join', (data: { sessionId: string }) => {
    console.log(`[CRAB-ROULETTE] roulette:join from ${socket.id} in session ${data.sessionId}`);
    socket.join(`game:${data.sessionId}`);
    io.to(`game:${data.sessionId}`).emit('roulette:playerJoined', {
      playerId: socket.id,
    });
    console.log(`[CRAB-ROULETTE] ${socket.id} joined roulette room game:${data.sessionId}`);
  });

  socket.on('roulette:spin', (data: { sessionId: string }) => {
    console.log(`[CRAB-ROULETTE] roulette:spin triggered by ${socket.id} in session ${data.sessionId}`);
    // Only the round manager can trigger spin
    io.to(`game:${data.sessionId}`).emit('roulette:spinning', {
      sessionId: data.sessionId,
    });
  });
}
