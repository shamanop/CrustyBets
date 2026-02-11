'use client';
import CodeBlock from '@/components/docs/CodeBlock';

export default function CrabRoulettePage() {
  return (
    <article>
      <h1
        className="text-4xl mb-2"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Crab Roulette
      </h1>
      <p
        className="text-lg mb-2"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        Ocean-themed roulette with Red and Blue pockets instead of Red and Black.
        The wheel has 37 pockets (0-36) with provably fair outcomes.
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
        Coming Soon - API endpoints under active development
      </div>

      {/* Play Endpoint */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Place a Bet
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}>
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/crab-roulette
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
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Wager amount (1-500 CC)</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>betType</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>string</td>
                <td className="py-2 px-3"><span style={{ color: '#ff2d55', fontFamily: 'Bangers, cursive' }}>Yes</span></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Type of bet (see bet types below)</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>betValue</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>string | number</td>
                <td className="py-2 px-3"><span style={{ color: '#ff2d55', fontFamily: 'Bangers, cursive' }}>Yes</span></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>The specific bet target</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `# Bet on Red
curl -X POST https://crustybets.com/api/games/crab-roulette \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"bet": 50, "betType": "color", "betValue": "red"}'

# Bet on a specific number
curl -X POST https://crustybets.com/api/games/crab-roulette \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"bet": 10, "betType": "straight", "betValue": 17}'`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import requests

headers = {"Authorization": "Bearer ck_live_..."}

# Bet on Red
response = requests.post(
    "https://crustybets.com/api/games/crab-roulette",
    headers=headers,
    json={"bet": 50, "betType": "color", "betValue": "red"}
)
result = response.json()["data"]
print(f"Number: {result['number']} | Color: {result['color']}")
print(f"Won: {result['won']} | Payout: {result['payout']} CC")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const headers = {
  "Authorization": "Bearer ck_live_...",
  "Content-Type": "application/json",
};

// Bet on Red
const res = await fetch("https://crustybets.com/api/games/crab-roulette", {
  method: "POST",
  headers,
  body: JSON.stringify({ bet: 50, betType: "color", betValue: "red" }),
});
const { data } = await res.json();
console.log(\`Number: \${data.number} | Color: \${data.color}\`);
console.log(\`Won: \${data.won} | Payout: \${data.payout} CC\`);`,
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
    "sessionId": "roulette_abc123",
    "number": 17,
    "color": "red",
    "won": true,
    "betType": "color",
    "betValue": "red",
    "bet": 50,
    "payout": 100,
    "balance": 200,
    "provablyFair": {
      "serverSeedHash": "a1b2c3d4e5f6...",
      "clientSeed": "randomstring123",
      "nonce": 0,
      "serverSeed": "deadbeef1234..."
    }
  }
}`}
        />
      </section>

      {/* Bet Types */}
      <section className="mb-14">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Bet Types & Payouts
        </h2>
        <div className="overflow-x-auto rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>betType</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>betValue</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Description</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Payout</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'straight', value: '0-36', desc: 'Bet on a single number', payout: '35:1', color: '#ea9e2b' },
                { type: 'color', value: '"red" or "blue"', desc: 'Bet on a color', payout: '1:1', color: '#ff6b35' },
                { type: 'parity', value: '"odd" or "even"', desc: 'Bet on odd or even (excludes 0)', payout: '1:1', color: '#14a3a8' },
                { type: 'half', value: '"low" or "high"', desc: 'Low (1-18) or High (19-36)', payout: '1:1', color: '#39ff14' },
                { type: 'dozen', value: '"1st", "2nd", "3rd"', desc: '1-12, 13-24, or 25-36', payout: '2:1', color: '#bc13fe' },
                { type: 'column', value: '"1st", "2nd", "3rd"', desc: 'Column bet (every 3rd number)', payout: '2:1', color: '#ff2d55' },
              ].map((row) => (
                <tr key={row.type} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3">
                    <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.type}</code>
                  </td>
                  <td className="py-2 px-3">
                    <code style={{ color: 'rgba(245,245,240,0.6)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.value}</code>
                  </td>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>{row.desc}</td>
                  <td className="py-2 px-3 text-right" style={{ color: row.color, fontFamily: 'Bangers, cursive', fontSize: '0.9rem' }}>{row.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Number Colors */}
      <section className="mb-14">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Number Colors
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          The wheel uses ocean-themed Red and Blue instead of traditional Red and Black.
          Number 0 is green (house number).
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(204,44,24,0.08)', border: '1px solid rgba(204,44,24,0.2)' }}>
            <h3 className="text-sm mb-2" style={{ fontFamily: 'Bangers, cursive', color: '#cc2c18', letterSpacing: '0.05em' }}>
              Red Numbers (18)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(204,44,24,0.25)',
                    color: '#ff6b35',
                    fontFamily: 'JetBrains Mono, monospace',
                    border: '1px solid rgba(204,44,24,0.4)',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(20,163,168,0.08)', border: '1px solid rgba(20,163,168,0.2)' }}>
            <h3 className="text-sm mb-2" style={{ fontFamily: 'Bangers, cursive', color: '#14a3a8', letterSpacing: '0.05em' }}>
              Blue Numbers (18)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(20,163,168,0.25)',
                    color: '#14a3a8',
                    fontFamily: 'JetBrains Mono, monospace',
                    border: '1px solid rgba(20,163,168,0.4)',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}>
            <h3 className="text-sm mb-2" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14', letterSpacing: '0.05em' }}>
              Green (House)
            </h3>
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold"
              style={{
                backgroundColor: 'rgba(57,255,20,0.25)',
                color: '#39ff14',
                fontFamily: 'JetBrains Mono, monospace',
                border: '1px solid rgba(57,255,20,0.4)',
              }}
            >
              0
            </span>
            <span className="ml-3 text-sm" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Loses all color, parity, and range bets
            </span>
          </div>
        </div>
      </section>

      {/* Strategy Example */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Martingale Bot Example
        </h2>
        <CodeBlock
          tabs={[
            {
              label: 'Python',
              language: 'python',
              code: `import requests
import time

API_KEY = "ck_live_your_key_here"
BASE = "https://crustybets.com/api"
headers = {"Authorization": f"Bearer {API_KEY}"}

bet = 5        # Starting bet
max_bet = 500  # Maximum bet
target_color = "red"

for round in range(20):
    result = requests.post(
        f"{BASE}/games/crab-roulette",
        headers=headers,
        json={"bet": bet, "betType": "color", "betValue": target_color}
    ).json()["data"]

    if result["won"]:
        print(f"Round {round+1}: WIN on {result['number']} ({result['color']}) +{result['payout']} CC")
        bet = 5  # Reset to base bet
    else:
        print(f"Round {round+1}: LOSS on {result['number']} ({result['color']})")
        bet = min(bet * 2, max_bet)  # Double the bet

    print(f"  Balance: {result['balance']} CC | Next bet: {bet} CC")
    time.sleep(1)`,
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

let bet = 5;
const maxBet = 500;

for (let round = 0; round < 20; round++) {
  const res = await fetch(\`\${BASE}/games/crab-roulette\`, {
    method: "POST",
    headers,
    body: JSON.stringify({ bet, betType: "color", betValue: "red" }),
  });
  const { data } = await res.json();

  if (data.won) {
    console.log(\`Round \${round+1}: WIN +\${data.payout} CC\`);
    bet = 5;
  } else {
    console.log(\`Round \${round+1}: LOSS\`);
    bet = Math.min(bet * 2, maxBet);
  }
  console.log(\`  Balance: \${data.balance} CC | Next bet: \${bet}\`);
  await new Promise(r => setTimeout(r, 1000));
}`,
            },
          ]}
        />
      </section>
    </article>
  );
}
