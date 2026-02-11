'use client';
import CodeBlock from '@/components/docs/CodeBlock';

export default function ClawMachinePage() {
  return (
    <article>
      <h1
        className="text-4xl mb-2"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Claw Machine
      </h1>
      <p
        className="text-lg mb-2"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        A physics-based claw machine. Create a session, then complete the claw drop to see what prize you win.
        Different prize tiers with varying coin rewards.
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

      {/* Create Session */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Create Session
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}>
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/claw-machine
          </code>
        </div>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Starts a new claw machine session. Your bet is deducted immediately. You receive a session ID
          to use when completing the game.
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
                <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>Wager amount (10-50 CC)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `curl -X POST https://crustybets.com/api/games/claw-machine \\
  -H "Authorization: Bearer ck_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"bet": 25}'`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `import requests

response = requests.post(
    "https://crustybets.com/api/games/claw-machine",
    headers={"Authorization": "Bearer ck_live_..."},
    json={"bet": 25}
)
session = response.json()["data"]
session_id = session["sessionId"]
print(f"Session created: {session_id}")
print(f"Balance: {session['balance']} CC")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const res = await fetch("https://crustybets.com/api/games/claw-machine", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ck_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ bet: 25 }),
});
const { data: session } = await res.json();
console.log("Session:", session.sessionId);`,
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
    "sessionId": "claw_abc123",
    "bet": 25,
    "balance": 75,
    "provablyFair": {
      "serverSeedHash": "a1b2c3d4e5f6...",
      "clientSeed": "randomstring123"
    },
    "message": "Claw machine ready! Position and drop the claw."
  }
}`}
        />
      </section>

      {/* Complete Game */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Complete Game
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontFamily: 'JetBrains Mono, monospace' }}>
            POST
          </span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#14a3a8', fontSize: '0.85rem' }}>
            /api/games/claw-machine/{'{sessionId}'}/complete
          </code>
        </div>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Completes the claw machine game. The server determines the prize using provably fair RNG based on the claw position.
        </p>

        <CodeBlock
          tabs={[
            {
              label: 'cURL',
              language: 'curl',
              code: `curl -X POST https://crustybets.com/api/games/claw-machine/claw_abc123/complete \\
  -H "Authorization: Bearer ck_live_..."`,
            },
            {
              label: 'Python',
              language: 'python',
              code: `result = requests.post(
    f"https://crustybets.com/api/games/claw-machine/{session_id}/complete",
    headers={"Authorization": "Bearer ck_live_..."}
).json()["data"]

print(f"Prize: {result['prize']['name']} ({result['prize']['tier']})")
print(f"Payout: {result['payout']} CC")
print(f"Balance: {result['balance']} CC")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `const completeRes = await fetch(
  \`https://crustybets.com/api/games/claw-machine/\${sessionId}/complete\`,
  {
    method: "POST",
    headers: { "Authorization": "Bearer ck_live_..." },
  }
);
const { data: result } = await completeRes.json();
console.log(\`Prize: \${result.prize.name} (\${result.prize.tier})\`);
console.log(\`Payout: \${result.payout} CC\`);`,
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
    "sessionId": "claw_abc123",
    "won": true,
    "prize": {
      "name": "Golden Lobster Plush",
      "tier": "rare",
      "coinValue": 100
    },
    "payout": 100,
    "balance": 175,
    "serverSeed": "deadbeef1234...",
    "message": "Amazing grab! You won a Golden Lobster Plush!"
  }
}`}
        />
      </section>

      {/* Prize Tiers */}
      <section className="mb-14">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Prize Tiers
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          The claw machine contains prizes across four tiers. Higher-tier prizes are rarer and worth more CrustyCoins.
        </p>

        <div className="overflow-x-auto rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e' }}>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Tier</th>
                <th className="text-left py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Prize Examples</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Coin Value</th>
                <th className="text-right py-2 px-3" style={{ color: 'rgba(245,245,240,0.4)', fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '0.75rem' }}>Drop Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tier: 'Legendary', color: '#ea9e2b', examples: 'Golden Lobster Trophy, Diamond Crab', value: '200-500 CC', rate: '~5%' },
                { tier: 'Rare', color: '#bc13fe', examples: 'Lobster Plush, Pearl Necklace', value: '50-150 CC', rate: '~15%' },
                { tier: 'Uncommon', color: '#14a3a8', examples: 'Shell Collection, Anchor Keychain', value: '15-40 CC', rate: '~35%' },
                { tier: 'Common', color: 'rgba(245,245,240,0.5)', examples: 'Seaweed Snack, Barnacle Badge', value: '5-10 CC', rate: '~45%' },
              ].map((row) => (
                <tr key={row.tier} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2 px-3">
                    <span style={{ color: row.color, fontFamily: 'Bangers, cursive', letterSpacing: '0.05em' }}>
                      {row.tier}
                    </span>
                  </td>
                  <td className="py-2 px-3" style={{ color: 'rgba(245,245,240,0.5)' }}>{row.examples}</td>
                  <td className="py-2 px-3 text-right" style={{ color: '#ea9e2b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.value}</td>
                  <td className="py-2 px-3 text-right" style={{ color: 'rgba(245,245,240,0.5)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-sm mt-4" style={{ backgroundColor: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)' }}>
            <strong style={{ color: '#39ff14', fontFamily: 'Bangers, cursive' }}>Miss:</strong>{' '}
            If the claw fails to grab a prize (based on physics simulation), no prize is awarded and the bet is lost.
            The claw grip strength is determined by the provably fair RNG.
          </p>
        </div>
      </section>

      {/* Game Flow */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
          Complete Game Flow
        </h2>
        <CodeBlock
          tabs={[
            {
              label: 'Python',
              language: 'python',
              code: `import requests

API_KEY = "ck_live_your_key_here"
BASE = "https://crustybets.com/api"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Step 1: Create session
session = requests.post(
    f"{BASE}/games/claw-machine",
    headers=headers,
    json={"bet": 25}
).json()["data"]

session_id = session["sessionId"]
print(f"Session: {session_id} | Balance: {session['balance']} CC")

# Step 2: Complete the game
result = requests.post(
    f"{BASE}/games/claw-machine/{session_id}/complete",
    headers=headers
).json()["data"]

if result["won"]:
    prize = result["prize"]
    print(f"Won: {prize['name']} ({prize['tier']}) = {result['payout']} CC!")
else:
    print("The claw slipped! No prize this time.")

print(f"Final balance: {result['balance']} CC")`,
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

// Step 1: Create session
const sessRes = await fetch(\`\${BASE}/games/claw-machine\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ bet: 25 }),
});
const { data: session } = await sessRes.json();
console.log("Session:", session.sessionId);

// Step 2: Complete game
const compRes = await fetch(
  \`\${BASE}/games/claw-machine/\${session.sessionId}/complete\`,
  { method: "POST", headers }
);
const { data: result } = await compRes.json();

if (result.won) {
  console.log(\`Won: \${result.prize.name} = \${result.payout} CC!\`);
} else {
  console.log("The claw slipped!");
}
console.log(\`Balance: \${result.balance} CC\`);`,
            },
          ]}
        />
      </section>
    </article>
  );
}
