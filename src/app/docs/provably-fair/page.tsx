'use client';
import CodeBlock from '@/components/docs/CodeBlock';

export default function ProvablyFairPage() {
  return (
    <article>
      <h1
        className="text-4xl mb-4"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Provably Fair
      </h1>
      <p
        className="text-lg mb-10"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        Every game outcome in CrustyBets is provably fair using HMAC-SHA256. You can independently
        verify that no outcome was manipulated after your bet was placed.
      </p>

      {/* How It Works */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          How It Works
        </h2>
        <div className="space-y-3">
          {[
            {
              step: '1',
              label: 'Server Seed Generated',
              desc: 'Before each game, the server generates a random 32-byte server seed and provides its SHA-256 hash to you. This commits the server to the outcome before you act.',
            },
            {
              step: '2',
              label: 'Client Seed Assigned',
              desc: 'A random client seed is generated for each game session. This ensures the outcome is influenced by both parties.',
            },
            {
              step: '3',
              label: 'Outcome Computed',
              desc: 'The game outcome is computed as HMAC-SHA256(serverSeed, clientSeed:nonce). The first 8 hex characters are converted to a number between 0 and 1.',
            },
            {
              step: '4',
              label: 'Server Seed Revealed',
              desc: 'After the game completes, the raw server seed is revealed. You can hash it to verify it matches the commitment, then recompute the outcome yourself.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 rounded-sm"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-sm"
                style={{
                  backgroundColor: 'rgba(57,255,20,0.15)',
                  color: '#39ff14',
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

      {/* The Math */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          The Algorithm
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          The core outcome generation follows these steps:
        </p>

        <div
          className="p-5 rounded-sm mb-6"
          style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(234,158,43,0.15)',
          }}
        >
          <div className="space-y-3" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
            <div>
              <span style={{ color: '#555' }}>// Step 1: Compute HMAC</span>
            </div>
            <div>
              <span style={{ color: '#14a3a8' }}>hmac</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> = </span>
              <span style={{ color: '#bc13fe' }}>HMAC-SHA256</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>(</span>
              <span style={{ color: '#ea9e2b' }}>serverSeed</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>, </span>
              <span style={{ color: '#39ff14' }}>{'"'}{'{clientSeed}:{nonce}'}{'"'}</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>)</span>
            </div>
            <div>
              <span style={{ color: '#555' }}>// Step 2: Extract first 8 hex chars (32 bits)</span>
            </div>
            <div>
              <span style={{ color: '#14a3a8' }}>hex</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> = </span>
              <span style={{ color: '#14a3a8' }}>hmac</span>
              <span style={{ color: '#ff6b35' }}>.substring</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>(</span>
              <span style={{ color: '#ea9e2b' }}>0</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>, </span>
              <span style={{ color: '#ea9e2b' }}>8</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>)</span>
            </div>
            <div>
              <span style={{ color: '#555' }}>// Step 3: Convert to float 0-1</span>
            </div>
            <div>
              <span style={{ color: '#14a3a8' }}>outcome</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> = </span>
              <span style={{ color: '#bc13fe' }}>parseInt</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>(</span>
              <span style={{ color: '#14a3a8' }}>hex</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>, </span>
              <span style={{ color: '#ea9e2b' }}>16</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>) / </span>
              <span style={{ color: '#ea9e2b' }}>0x100000000</span>
            </div>
            <div>
              <span style={{ color: '#555' }}>// Step 4: Map to game range</span>
            </div>
            <div>
              <span style={{ color: '#14a3a8' }}>result</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> = </span>
              <span style={{ color: '#bc13fe' }}>floor</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>(</span>
              <span style={{ color: '#14a3a8' }}>outcome</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> * (</span>
              <span style={{ color: '#14a3a8' }}>max</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> - </span>
              <span style={{ color: '#14a3a8' }}>min</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}> + </span>
              <span style={{ color: '#ea9e2b' }}>1</span>
              <span style={{ color: 'rgba(245,245,240,0.4)' }}>)) + </span>
              <span style={{ color: '#14a3a8' }}>min</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(20,163,168,0.08)', border: '1px solid rgba(20,163,168,0.2)' }}>
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#14a3a8', letterSpacing: '0.05em' }}>
              Server Seed
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              32 random bytes (64 hex chars). The key in HMAC-SHA256. Kept secret until game completion,
              but its SHA-256 hash is shared upfront as a commitment.
            </p>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(234,158,43,0.08)', border: '1px solid rgba(234,158,43,0.2)' }}>
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b', letterSpacing: '0.05em' }}>
              Client Seed
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              16-character string generated per session. The message in HMAC-SHA256 (combined with nonce).
              Visible to you before any game action.
            </p>
          </div>
          <div className="p-4 rounded-sm" style={{ backgroundColor: 'rgba(188,19,254,0.08)', border: '1px solid rgba(188,19,254,0.2)' }}>
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#bc13fe', letterSpacing: '0.05em' }}>
              Nonce
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              Integer counter that allows multiple outcomes from the same seed pair.
              Incremented for each sub-outcome (e.g., each reel in slots, each shuffle swap in shell game).
            </p>
          </div>
        </div>
      </section>

      {/* Verification Code */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Verification Code
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Use these functions to independently verify any CrustyBets game outcome:
        </p>

        <CodeBlock
          tabs={[
            {
              label: 'Python',
              language: 'python',
              code: `import hashlib
import hmac

def verify_server_seed(server_seed, expected_hash):
    """Verify the server seed matches the pre-game commitment."""
    actual_hash = hashlib.sha256(server_seed.encode()).hexdigest()
    return actual_hash == expected_hash

def generate_outcome(server_seed, client_seed, nonce):
    """Reproduce the game outcome from seeds and nonce."""
    message = f"{client_seed}:{nonce}"
    h = hmac.new(
        server_seed.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    # First 8 hex chars = 32 bits
    int_value = int(h[:8], 16)
    return int_value / 0x100000000  # Float 0-1

def outcome_in_range(server_seed, client_seed, nonce, min_val, max_val):
    """Get an outcome mapped to a specific range."""
    raw = generate_outcome(server_seed, client_seed, nonce)
    return int(raw * (max_val - min_val + 1)) + min_val

# --- VERIFICATION EXAMPLE ---

# Data from a completed Shell Shuffle game
server_seed = "deadbeef1234..."       # Revealed after game
server_seed_hash = "a1b2c3d4e5f6..."  # Given before game
client_seed = "randomstring123"        # Given before game
nonce = 0

# Step 1: Verify server seed commitment
assert verify_server_seed(server_seed, server_seed_hash)
print("Server seed matches commitment!")

# Step 2: Reproduce the pearl position
pearl_pos = outcome_in_range(server_seed, client_seed, 0, 0, 2)
print(f"Pearl position: {pearl_pos}")

# Step 3: Reproduce shuffle sequence
difficulty = 2
shuffle_count = 3 + difficulty * 2
for i in range(shuffle_count):
    a = outcome_in_range(server_seed, client_seed, i + 1, 0, 2)
    b_raw = outcome_in_range(server_seed, client_seed, i + 100, 0, 1)
    b = b_raw + 1 if b_raw >= a else b_raw
    print(f"Swap {i}: [{a}, {b}]")`,
            },
            {
              label: 'JavaScript',
              language: 'javascript',
              code: `// Browser-compatible verification (using Web Crypto API)

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key, message) {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyServerSeed(serverSeed, expectedHash) {
  const actualHash = await sha256(serverSeed);
  return actualHash === expectedHash;
}

async function generateOutcome(serverSeed, clientSeed, nonce) {
  const message = \`\${clientSeed}:\${nonce}\`;
  const hex = await hmacSha256(serverSeed, message);
  const intValue = parseInt(hex.substring(0, 8), 16);
  return intValue / 0x100000000;
}

async function outcomeInRange(serverSeed, clientSeed, nonce, min, max) {
  const raw = await generateOutcome(serverSeed, clientSeed, nonce);
  return Math.floor(raw * (max - min + 1)) + min;
}

// --- VERIFICATION EXAMPLE ---

const serverSeed = "deadbeef1234...";
const serverSeedHash = "a1b2c3d4e5f6...";
const clientSeed = "randomstring123";

// Verify commitment
const valid = await verifyServerSeed(serverSeed, serverSeedHash);
console.log("Seed valid:", valid);

// Reproduce pearl position
const pearlPos = await outcomeInRange(serverSeed, clientSeed, 0, 0, 2);
console.log("Pearl position:", pearlPos);`,
            },
            {
              label: 'Node.js',
              language: 'javascript',
              code: `const crypto = require("crypto");

function verifyServerSeed(serverSeed, expectedHash) {
  const hash = crypto.createHash("sha256").update(serverSeed).digest("hex");
  return hash === expectedHash;
}

function generateOutcome(serverSeed, clientSeed, nonce) {
  const hmac = crypto.createHmac("sha256", serverSeed);
  hmac.update(\`\${clientSeed}:\${nonce}\`);
  const hex = hmac.digest("hex");
  const intVal = parseInt(hex.substring(0, 8), 16);
  return intVal / 0x100000000;
}

function outcomeInRange(serverSeed, clientSeed, nonce, min, max) {
  const raw = generateOutcome(serverSeed, clientSeed, nonce);
  return Math.floor(raw * (max - min + 1)) + min;
}

// Verify a Lobster Slots spin
const serverSeed = "deadbeef1234...";
const clientSeed = "randomstring123";

// Reproduce 5 reel outcomes
for (let reel = 0; reel < 5; reel++) {
  const outcome = outcomeInRange(serverSeed, clientSeed, reel, 0, 999);
  console.log(\`Reel \${reel}: raw=\${outcome}\`);
}`,
            },
          ]}
        />
      </section>

      {/* Game-Specific Details */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Game-Specific Verification
        </h2>

        <div className="space-y-4">
          <div className="p-5 rounded-sm" style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}>
              Shell Shuffle
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              <li>
                <span style={{ color: '#14a3a8' }}>Nonce 0:</span> Pearl position (range 0-2)
              </li>
              <li>
                <span style={{ color: '#14a3a8' }}>Nonce 1 to N:</span> First swap position (range 0-2)
              </li>
              <li>
                <span style={{ color: '#14a3a8' }}>Nonce 100 to 100+N:</span> Second swap position (range 0-1, adjusted to avoid self-swap)
              </li>
              <li>
                <span style={{ color: '#ea9e2b' }}>Shuffle count:</span> 3 + difficulty * 2
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-sm" style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ea9e2b' }}>
              Lobster Slots
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              <li>
                <span style={{ color: '#14a3a8' }}>Nonce 0-4:</span> One per reel (5 reels total)
              </li>
              <li>
                <span style={{ color: '#14a3a8' }}>Range:</span> 0-999 per reel
              </li>
              <li>
                <span style={{ color: '#ea9e2b' }}>Weighted mapping:</span> Raw value is mapped to a symbol using weighted distribution (total weight: 69)
              </li>
              <li>
                <span style={{ color: '#ea9e2b' }}>Weights:</span> [1, 2, 4, 6, 8, 12, 16, 20] for symbols 0-7
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-sm" style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff2d55' }}>
              Crab Roulette
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              <li>
                <span style={{ color: '#14a3a8' }}>Nonce 0:</span> Wheel number (range 0-36)
              </li>
              <li>
                <span style={{ color: '#ea9e2b' }}>Single outcome:</span> One provably fair number determines all bet results
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Provably Fair Data in API */}
      <section>
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          API Verification Data
        </h2>
        <p className="mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.7 }}>
          Every game response includes a <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>provablyFair</code> object:
        </p>

        <CodeBlock
          title="Before game completes"
          language="json"
          code={`{
  "provablyFair": {
    "serverSeedHash": "sha256_hash_of_server_seed",
    "clientSeed": "random_client_seed_string"
  }
}`}
        />

        <CodeBlock
          title="After game completes"
          language="json"
          code={`{
  "provablyFair": {
    "serverSeedHash": "sha256_hash_of_server_seed",
    "clientSeed": "random_client_seed_string",
    "nonce": 0,
    "serverSeed": "raw_server_seed_now_revealed"
  }
}`}
        />

        <div className="p-4 rounded-sm mt-4" style={{ backgroundColor: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.6)' }}>
            <strong style={{ color: '#39ff14', fontFamily: 'Bangers, cursive' }}>Verification Guarantee:</strong>{' '}
            The server seed hash is provided before you make any game decisions. Since SHA-256 is a one-way function,
            the server cannot change the outcome after committing to the hash. This mathematically proves the game was fair.
          </p>
        </div>
      </section>
    </article>
  );
}
