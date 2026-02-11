'use client';
import CodeBlock from '@/components/docs/CodeBlock';

const symbols = [
  { id: 0, name: 'Golden Lobster', emoji: '\uD83E\uDD47\uD83E\uDD9E', x3: '50x', x4: '200x', x5: '500x', rarity: 'Legendary' },
  { id: 1, name: 'King Crab', emoji: '\uD83E\uDD80\uD83D\uDC51', x3: '25x', x4: '100x', x5: '250x', rarity: 'Epic' },
  { id: 2, name: 'Pearl', emoji: '\uD83D\uDC1A', x3: '10x', x4: '50x', x5: '100x', rarity: 'Rare' },
  { id: 3, name: 'Treasure Chest', emoji: '\uD83D\uDCE6', x3: '5x', x4: '25x', x5: '50x', rarity: 'Uncommon' },
  { id: 4, name: 'Anchor', emoji: '\u2693', x3: '3x', x4: '10x', x5: '25x', rarity: 'Uncommon' },
  { id: 5, name: 'Shell', emoji: '\uD83D\uDC1A', x3: '2x', x4: '5x', x5: '10x', rarity: 'Common' },
  { id: 6, name: 'Seaweed', emoji: '\uD83C\uDF3F', x3: '1x', x4: '3x', x5: '5x', rarity: 'Common' },
  { id: 7, name: 'Barnacle', emoji: '\uD83E\uDEA8', x3: '0.5x', x4: '1x', x5: '2x', rarity: 'Common' },
];

const rarityColors: Record<string, string> = {
  Legendary: '#ea9e2b',
  Epic: '#bc13fe',
  Rare: '#14a3a8',
  Uncommon: '#39ff14',
  Common: 'rgba(245,245,240,0.4)',
};

export default function LobsterSlotsPage() {
  return (
    <article>
      <h1
        className="text-4xl mb-2"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Lobster Slots
      </h1>
      <p
        className="text-lg mb-10"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        A 5-reel slot machine with 8 ocean-themed symbols. Match 3 or more consecutive
        symbols from the left to win multiplied payouts up to <strong style={{ color: '#ea9e2b' }}>500x</strong> your bet.
      </p>

      {/* Spin Endpoint */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Spin the Reels
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}>
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/lobster-slots/spin
          </code>
        </div>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Single-round game. Spin the reels and get instant results. Total cost is <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>bet * lines</code>.
        </p>

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
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Bet per line (1-100 CC)</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-2 px-3"><code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>lines</code></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>integer</td>
                <td className="py-2 px-3"><span style={{ color: 'rgba(245,245,240,0.3)', fontFamily: 'Bangers, cursive' }}>No</span></td>
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Number of paylines (1-20, default: 1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `curl -X POST https://crustybets.com/api/games/lobster-slots/spin \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"bet": 10, "lines": 1}'`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import requests

response = requests.post(
    "https://crustybets.com/api/games/lobster-slots/spin",
    headers={"Authorization": "Bearer ck_live_..."},
    json={"bet": 10, "lines": 1}
)
spin = response.json()["data"]
print(f"Reels: {[r['name'] for r in spin['reels']]}")
print(f"Payout: {spin['payout']} CC | Net: {spin['netResult']} CC")
print(f"Balance: {spin['balance']} CC")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const res = await fetch("https://crustybets.com/api/games/lobster-slots/spin", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ck_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ bet: 10, lines: 1 }),
});
const { data: spin } = await res.json();
console.log("Reels:", spin.reels.map(r => r.name));
console.log("Payout:", spin.payout, "CC");
console.log("Balance:", spin.balance, "CC");`,
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
    "sessionId": "spin_abc123",
    "reels": [
      { "id": 2, "name": "Pearl" },
      { "id": 2, "name": "Pearl" },
      { "id": 2, "name": "Pearl" },
      { "id": 5, "name": "Shell" },
      { "id": 7, "name": "Barnacle" }
    ],
    "bet": 10,
    "payout": 100,
    "netResult": 90,
    "matches": 3,
    "winningSymbol": "Pearl",
    "balance": 190,
    "provablyFair": {
      "serverSeedHash": "a1b2c3d4e5f6...",
      "clientSeed": "randomstring123",
      "nonce": 0,
      "serverSeed": "deadbeef1234..."
    }
  }
}`}
        />
        <p className="text-sm mt-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.4)' }}>
          The <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>serverSeed</code> is revealed immediately since slots are single-round games.
        </p>
      </section>

      {/* Symbol Table */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Symbol Table & Multipliers
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Wins are calculated by matching 3, 4, or 5 consecutive symbols from the leftmost reel.
          Payout = <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>bet * lines * multiplier</code>.
        </p>
        <div className="overflow-x-auto rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>ID</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Symbol</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Rarity</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>3 Match</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>4 Match</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>5 Match</th>
              </tr>
            </thead>
            <tbody>
              {symbols.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.3)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>{s.id}</td>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.8)' }}>
                    <span style={{ marginRight: '0.5rem' }}>{s.emoji}</span>
                    {s.name}
                  </td>
                  <td className="py-2 px-3">
                    <span style={{ color: rarityColors[s.rarity], fontFamily: 'Bangers, cursive', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                      {s.rarity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right" style={{ color: '#ea9e2b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{s.x3}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#ea9e2b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{s.x4}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#ea9e2b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{s.x5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reel Weights */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Symbol Weights
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Each reel position is determined by weighted random selection. Rarer symbols appear less frequently:
        </p>
        <div className="overflow-x-auto rounded-sm mb-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Symbol</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Weight</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Golden Lobster', weight: 1, prob: '1.45%' },
                { name: 'King Crab', weight: 2, prob: '2.90%' },
                { name: 'Pearl', weight: 4, prob: '5.80%' },
                { name: 'Treasure Chest', weight: 6, prob: '8.70%' },
                { name: 'Anchor', weight: 8, prob: '11.59%' },
                { name: 'Shell', weight: 12, prob: '17.39%' },
                { name: 'Seaweed', weight: 16, prob: '23.19%' },
                { name: 'Barnacle', weight: 20, prob: '28.99%' },
              ].map((s) => (
                <tr key={s.name} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.7)' }}>{s.name}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{s.weight}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#ea9e2b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{s.prob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.4)' }}>
          Total weight: <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>69</code>.
          Probability = weight / 69.
        </p>
      </section>

      {/* Multi-spin Bot Example */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Multi-Spin Bot Example
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

wins = 0
total_spins = 20
total_profit = 0

for i in range(total_spins):
    spin = requests.post(
        f"{BASE}/games/lobster-slots/spin",
        headers=headers,
        json={"bet": 5, "lines": 1}
    ).json()["data"]

    net = spin["netResult"]
    total_profit += net
    if spin["payout"] > 0:
        wins += 1
        print(f"Spin {i+1}: WIN {spin['winningSymbol']} x{spin['matches']} = +{spin['payout']} CC")
    else:
        print(f"Spin {i+1}: {[r['name'] for r in spin['reels']]}")

    time.sleep(1)  # Respect rate limits

print(f"\\nResults: {wins}/{total_spins} wins")
print(f"Net profit: {total_profit} CC")`,
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

let wins = 0;
let totalProfit = 0;
const totalSpins = 20;

for (let i = 0; i < totalSpins; i++) {
  const res = await fetch(\`\${BASE}/games/lobster-slots/spin\`, {
    method: "POST",
    headers,
    body: JSON.stringify({ bet: 5, lines: 1 }),
  });
  const { data: spin } = await res.json();

  totalProfit += spin.netResult;
  if (spin.payout > 0) {
    wins++;
    console.log(\`Spin \${i+1}: WIN \${spin.winningSymbol} x\${spin.matches}\`);
  }

  await new Promise(r => setTimeout(r, 1000)); // Rate limit
}

console.log(\`Results: \${wins}/\${totalSpins} wins\`);
console.log(\`Net profit: \${totalProfit} CC\`);`,
            },
          ]}
        />
      </section>
    </article>
  );
}
