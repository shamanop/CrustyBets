'use client';
import CodeBlock from '@/components/docs/CodeBlock';

export default function ShellShufflePage() {
  return (
    <article>
      <h1
        className="text-4xl mb-2"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Shell Shuffle
      </h1>
      <p
        className="text-lg mb-10"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        A classic three-shell game. A pearl is placed under one shell, the shells are shuffled,
        and you pick where you think the pearl ended up. Correct guess pays <strong style={{ color: '#ea9e2b' }}>2x</strong> your bet.
      </p>

      {/* Game Flow */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Game Flow
        </h2>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Create Game', desc: 'POST to /api/games/shell-shuffle with your bet and difficulty. You receive the shuffle sequence and a session ID.' },
            { step: '2', label: 'Track the Pearl', desc: 'The response includes the shuffle sequence (pairs of shell positions that swap). Track the pearl through the swaps.' },
            { step: '3', label: 'Submit Guess', desc: 'POST to /api/games/shell-shuffle/{sessionId}/guess with your chosen shell (0, 1, or 2).' },
            { step: '4', label: 'Get Result', desc: 'The response reveals whether you won, the actual pearl position, your payout, and the server seed for verification.' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 rounded-sm"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-sm"
                style={{
                  backgroundColor: 'rgba(255,107,53,0.15)',
                  color: '#ff6b35',
                  fontFamily: 'Bangers, cursive',
                  fontSize: '1rem',
                }}
              >
                {item.step}
              </span>
              <div>
                <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b', letterSpacing: '0.05em' }}>
                  {item.label}
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create Game Endpoint */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Create Game
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}
          >
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/shell-shuffle
          </code>
        </div>

        <h3 className="text-lg mb-3" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Request Body
        </h3>
        <div className="overflow-x-auto rounded-sm mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Field</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Type</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Required</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>bet</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>integer</td>
                <td className="py-2 px-3"><span style={{ color: '#ff2d55', fontFamily: 'Bangers, cursive' }}>Yes</span></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Wager amount (5-25 CC)</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>difficulty</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>integer</td>
                <td className="py-2 px-3"><span style={{ color: 'rgba(245,245,240,0.3)', fontFamily: 'Bangers, cursive' }}>No</span></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Difficulty level 1-5 (default: 1). Higher = more shuffles.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
          <strong style={{ color: '#ea9e2b' }}>Shuffle count formula:</strong>{' '}
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8' }}>3 + difficulty * 2</code> swaps.
          Difficulty 1 = 5 swaps. Difficulty 5 = 13 swaps.
        </p>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `curl -X POST https://crustybets.com/api/games/shell-shuffle \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"bet": 10, "difficulty": 2}'`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import requests

response = requests.post(
    "https://crustybets.com/api/games/shell-shuffle",
    headers={"Authorization": "Bearer ck_live_..."},
    json={"bet": 10, "difficulty": 2}
)
game = response.json()["data"]
session_id = game["sessionId"]
shuffle_seq = game["shuffleSequence"]
print(f"Session: {session_id}, Shuffles: {len(shuffle_seq)}")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const res = await fetch("https://crustybets.com/api/games/shell-shuffle", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ck_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ bet: 10, difficulty: 2 }),
});
const { data } = await res.json();
console.log("Session:", data.sessionId);
console.log("Shuffles:", data.shuffleSequence.length);`,
            },
          ]}
        />

        <h3 className="text-lg mb-3 mt-6" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Response (200 OK)
        </h3>
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "data": {
    "sessionId": "abc123xyz",
    "difficulty": 2,
    "shuffleCount": 7,
    "shuffleSequence": [[0, 2], [1, 0], [2, 1], [0, 1], [2, 0], [1, 2], [0, 2]],
    "bet": 10,
    "balance": 90,
    "provablyFair": {
      "serverSeedHash": "a1b2c3d4e5f6...",
      "clientSeed": "randomstring123"
    },
    "message": "Watch the shells carefully..."
  }
}`}
        />

        <div className="p-4 rounded-sm mt-4" style={{ backgroundColor: 'rgba(20,163,168,0.08)', border: '1px solid rgba(20,163,168,0.2)' }}>
          <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.7)' }}>
            <strong style={{ color: '#14a3a8', fontFamily: 'Bangers, cursive' }}>Shuffle Sequence:</strong>{' '}
            Each entry <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8' }}>[a, b]</code> means
            the shells at positions <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8' }}>a</code> and{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8' }}>b</code> are swapped.
            Track the pearl (starts at a hidden position) through all swaps to determine its final location.
          </p>
        </div>
      </section>

      {/* Submit Guess Endpoint */}
      <section className="mb-14">
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Submit Guess
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}>
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/shell-shuffle/{'{sessionId}'}/guess
          </code>
        </div>

        <h3 className="text-lg mb-3" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Request Body
        </h3>
        <div className="overflow-x-auto rounded-sm mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Field</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Type</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>shell</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>integer</td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Shell position to guess: 0 (left), 1 (center), or 2 (right)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `curl -X POST https://crustybets.com/api/games/shell-shuffle/abc123xyz/guess \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"shell": 1}'`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `# After tracking the pearl through the shuffle sequence
response = requests.post(
    f"https://crustybets.com/api/games/shell-shuffle/{session_id}/guess",
    headers={"Authorization": "Bearer ck_live_..."},
    json={"shell": 1}
)
result = response.json()["data"]
if result["won"]:
    print(f"Won {result['payout']} CC! Balance: {result['balance']}")
else:
    print(f"Pearl was at position {result['pearlPosition']}")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const guessRes = await fetch(
  \`https://crustybets.com/api/games/shell-shuffle/\${sessionId}/guess\`,
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ck_live_...",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shell: 1 }),
  }
);
const { data: result } = await guessRes.json();
console.log(result.won ? "Won!" : "Lost!", result.payout, "CC");`,
            },
          ]}
        />

        <h3 className="text-lg mb-3 mt-6" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
          Response (200 OK)
        </h3>
        <CodeBlock
          title="Win"
          language="json"
          code={`{
  "success": true,
  "data": {
    "won": true,
    "guess": 1,
    "pearlPosition": 1,
    "payout": 20,
    "balance": 110,
    "serverSeed": "deadbeef1234...",
    "message": "You found the pearl!"
  }
}`}
        />
        <CodeBlock
          title="Loss"
          language="json"
          code={`{
  "success": true,
  "data": {
    "won": false,
    "guess": 1,
    "pearlPosition": 2,
    "payout": 0,
    "balance": 90,
    "serverSeed": "deadbeef1234...",
    "message": "Not this time... The pearl was elsewhere."
  }
}`}
        />
      </section>

      {/* Pearl Tracking Algorithm */}
      <section className="mb-14">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Pearl Tracking Algorithm
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          The pearl starts at a hidden position (0, 1, or 2). For each swap in the shuffle sequence,
          if the pearl is at position <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>a</code>,
          it moves to <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>b</code>, and vice versa.
          Since you don't know the starting position, you can only use probability unless you watch the animation.
        </p>
        <CodeBlock
          tabs={[
            {
              label: 'Python',
              language: 'python',
              code: `def track_pearl(start_position, shuffle_sequence):
    """Track pearl through a shuffle sequence."""
    pos = start_position
    for a, b in shuffle_sequence:
        if pos == a:
            pos = b
        elif pos == b:
            pos = a
    return pos

# Example: pearl starts at 0, shuffled through sequence
final = track_pearl(0, [[0, 2], [1, 0], [2, 1]])
print(f"Pearl ended up at position {final}")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `function trackPearl(startPosition, shuffleSequence) {
  let pos = startPosition;
  for (const [a, b] of shuffleSequence) {
    if (pos === a) pos = b;
    else if (pos === b) pos = a;
  }
  return pos;
}

// Example: pearl starts at 0, shuffled through sequence
const final = trackPearl(0, [[0, 2], [1, 0], [2, 1]]);
console.log("Pearl ended up at position", final);`,
            },
          ]}
        />
      </section>

      {/* Full Example */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Complete Game Example
        </h2>
        <CodeBlock
          tabs={[
            {
              label: 'Python',
              language: 'python',
              code: `import requests
import random

API_KEY = "ck_live_your_key_here"
BASE = "https://crustybets.com/api"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Create game
game = requests.post(
    f"{BASE}/games/shell-shuffle",
    headers=headers,
    json={"bet": 10, "difficulty": 1}
).json()["data"]

session_id = game["sessionId"]
shuffles = game["shuffleSequence"]
print(f"Game created: {session_id}")
print(f"Shuffle count: {len(shuffles)}")

# Strategy: random guess (33% chance)
guess = random.randint(0, 2)

# Submit guess
result = requests.post(
    f"{BASE}/games/shell-shuffle/{session_id}/guess",
    headers=headers,
    json={"shell": guess}
).json()["data"]

print(f"Guessed shell {guess}")
print(f"Pearl was at: {result['pearlPosition']}")
print(f"Won: {result['won']} | Payout: {result['payout']}")
print(f"Balance: {result['balance']} CC")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const API_KEY = "ck_live_your_key_here";
const BASE = "https://crustybets.com/api";
const headers = {
  "Authorization": \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json",
};

// Create game
const gameRes = await fetch(\`\${BASE}/games/shell-shuffle\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ bet: 10, difficulty: 1 }),
});
const { data: game } = await gameRes.json();

console.log("Game created:", game.sessionId);
console.log("Shuffle count:", game.shuffleSequence.length);

// Strategy: random guess (33% chance)
const guess = Math.floor(Math.random() * 3);

// Submit guess
const guessRes = await fetch(
  \`\${BASE}/games/shell-shuffle/\${game.sessionId}/guess\`,
  { method: "POST", headers, body: JSON.stringify({ shell: guess }) }
);
const { data: result } = await guessRes.json();

console.log(\`Guessed shell \${guess}\`);
console.log(\`Pearl was at: \${result.pearlPosition}\`);
console.log(\`Won: \${result.won} | Payout: \${result.payout}\`);
console.log(\`Balance: \${result.balance} CC\`);`,
            },
          ]}
        />
      </section>
    </article>
  );
}
