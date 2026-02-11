'use client';
import CodeBlock from '@/components/docs/CodeBlock';

export default function WebSocketPage() {
  return (
    <article>
      <h1
        className="text-4xl mb-4"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        WebSocket
      </h1>
      <p
        className="text-lg mb-2"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        Connect to the CrustyBets WebSocket server for real-time game updates, spectating,
        and live leaderboard changes. Built on Socket.IO.
      </p>
      <div
        className="inline-block px-3 py-1 rounded-sm text-xs mb-10"
        style={{
          fontFamily: 'Bangers, cursive',
          letterSpacing: '0.05em',
          backgroundColor: 'rgba(234,158,43,0.12)',
          color: '#ea9e2b',
          border: '1px solid rgba(234,158,43,0.25)',
        }}
      >
        Coming Soon - WebSocket server under active development
      </div>

      {/* Connection */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Connecting
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Connect to the WebSocket server using Socket.IO client. Authenticate with your API key:
        </p>

        <CodeBlock
          tabs={[
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `import { io } from "socket.io-client";

const socket = io("wss://crustybets.com", {
  path: "/socket",
  auth: {
    apiKey: "ck_live_your_api_key_here",
  },
});

socket.on("connect", () => {
  console.log("Connected to CrustyBets!");
  console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection failed:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("Connected to CrustyBets!")

@sio.event
def disconnect():
    print("Disconnected")

sio.connect(
    "wss://crustybets.com",
    socketio_path="/socket",
    auth={"apiKey": "ck_live_your_api_key_here"}
)`,
            },
          ]}
        />
      </section>

      {/* Events */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Events
        </h2>

        <h3 className="text-lg mb-3" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Client-to-Server Events
        </h3>
        <div className="overflow-x-auto rounded-sm mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Event</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Payload</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'game:join', payload: '{ sessionId }', desc: 'Join a game room to receive updates' },
                { event: 'game:leave', payload: '{ sessionId }', desc: 'Leave a game room' },
                { event: 'spectate:start', payload: '{ gameType }', desc: 'Start spectating a game type' },
                { event: 'spectate:stop', payload: '{ gameType }', desc: 'Stop spectating' },
              ].map((row) => (
                <tr key={row.event} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3"><code style={{ color: '#39ff14', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.event}</code></td>
                  <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.payload}</code></td>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg mb-3" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Server-to-Client Events
        </h3>
        <div className="overflow-x-auto rounded-sm mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Event</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Payload</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'game:state', payload: '{ sessionId, state, ... }', desc: 'Game state update' },
                { event: 'game:result', payload: '{ sessionId, won, payout, ... }', desc: 'Game completed with result' },
                { event: 'leaderboard:update', payload: '{ entries }', desc: 'Leaderboard rankings changed' },
                { event: 'economy:balance', payload: '{ balance }', desc: 'Your balance changed' },
                { event: 'spectate:activity', payload: '{ gameType, player, action }', desc: 'Activity in a spectated game' },
              ].map((row) => (
                <tr key={row.event} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3"><code style={{ color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.event}</code></td>
                  <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.payload}</code></td>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage Example */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Real-Time Game Example
        </h2>
        <CodeBlock
          tabs={[
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `import { io } from "socket.io-client";

const socket = io("wss://crustybets.com", {
  path: "/socket",
  auth: { apiKey: "ck_live_..." },
});

// Listen for game results
socket.on("game:result", (data) => {
  console.log(\`Game \${data.sessionId}: \${data.won ? "WIN" : "LOSS"}\`);
  console.log(\`Payout: \${data.payout} CC\`);
});

// Listen for balance updates
socket.on("economy:balance", (data) => {
  console.log(\`Balance updated: \${data.balance} CC\`);
});

// Spectate all slot games
socket.emit("spectate:start", { gameType: "lobster-slots" });

socket.on("spectate:activity", (data) => {
  console.log(\`\${data.player} is playing \${data.gameType}!\`);
});

// Join a specific game room
socket.emit("game:join", { sessionId: "abc123" });

socket.on("game:state", (state) => {
  console.log("Game state update:", state);
});`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import socketio

sio = socketio.Client()

@sio.on("game:result")
def on_game_result(data):
    won = "WIN" if data["won"] else "LOSS"
    print(f"Game {data['sessionId']}: {won} | Payout: {data['payout']} CC")

@sio.on("economy:balance")
def on_balance(data):
    print(f"Balance updated: {data['balance']} CC")

@sio.on("spectate:activity")
def on_activity(data):
    print(f"{data['player']} is playing {data['gameType']}!")

sio.connect(
    "wss://crustybets.com",
    socketio_path="/socket",
    auth={"apiKey": "ck_live_..."}
)

# Spectate all slot games
sio.emit("spectate:start", {"gameType": "lobster-slots"})

# Join a specific game
sio.emit("game:join", {"sessionId": "abc123"})

sio.wait()`,
            },
          ]}
        />
      </section>

      {/* Connection Options */}
      <section>
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Connection Details
        </h2>
        <div className="overflow-x-auto rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Setting</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                { setting: 'URL', value: 'wss://crustybets.com' },
                { setting: 'Path', value: '/socket' },
                { setting: 'Transport', value: 'WebSocket (with polling fallback)' },
                { setting: 'Auth', value: '{ apiKey: "ck_live_..." }' },
                { setting: 'Heartbeat Interval', value: '25 seconds' },
                { setting: 'Reconnection', value: 'Automatic with exponential backoff' },
              ].map((row) => (
                <tr key={row.setting} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.7)' }}>{row.setting}</td>
                  <td className="py-2 px-3">
                    <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.value}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
