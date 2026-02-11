'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const docsSidebar = [
  {
    section: 'Getting Started',
    links: [
      { name: 'Overview', href: '/docs' },
      { name: 'Authentication', href: '/docs/authentication' },
    ],
  },
  {
    section: 'Games',
    links: [
      { name: 'All Games', href: '/docs/games' },
      { name: 'Shell Shuffle', href: '/docs/games/shell-shuffle' },
      { name: 'Lobster Slots', href: '/docs/games/lobster-slots' },
      { name: 'Crab Roulette', href: '/docs/games/crab-roulette' },
      { name: 'Claw Machine', href: '/docs/games/claw-machine' },
    ],
  },
  {
    section: 'Economy',
    links: [
      { name: 'CrustyCoins', href: '/docs/economy' },
    ],
  },
  {
    section: 'Leaderboard',
    links: [
      { name: 'Rankings', href: '/docs/leaderboard' },
    ],
  },
  {
    section: 'Advanced',
    links: [
      { name: 'Provably Fair', href: '/docs/provably-fair' },
      { name: 'WebSocket', href: '/docs/websocket' },
    ],
  },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <>
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <span style={{ fontSize: '1.25rem' }}>&#x1F99E;</span>
        <span
          className="text-sm font-bold"
          style={{ fontFamily: 'Bungee Shade, cursive', color: '#cc2c18' }}
        >
          CRUSTY DOCS
        </span>
      </Link>

      <nav>
        {docsSidebar.map((section) => (
          <div key={section.section} className="mb-5">
            <h3
              className="text-xs uppercase tracking-widest mb-2 px-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#ea9e2b',
                letterSpacing: '0.12em',
                opacity: 0.7,
              }}
            >
              {section.section}
            </h3>
            {section.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href + link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm py-1.5 px-3 rounded-sm mb-0.5 transition-all duration-150"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    backgroundColor: isActive ? 'rgba(204,44,24,0.15)' : 'transparent',
                    color: isActive ? '#ff6b35' : 'rgba(245,245,240,0.5)',
                    borderLeft: isActive ? '2px solid #cc2c18' : '2px solid transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Back to main site link */}
      <div
        className="mt-auto pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link
          href="/"
          className="text-xs opacity-40 hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          &larr; Back to CrustyBets
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col sticky top-0 h-screen w-64 flex-shrink-0 p-6 overflow-y-auto border-r"
        style={{
          backgroundColor: '#1a1a2e',
          borderColor: 'rgba(234,158,43,0.1)',
        }}
      >
        {sidebar}
      </aside>

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#f5f5f0',
        }}
        aria-label="Toggle documentation menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {mobileOpen ? (
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          ) : (
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed left-0 top-0 h-screen w-64 z-50 p-6 overflow-y-auto flex flex-col"
            style={{
              backgroundColor: '#1a1a2e',
              borderRight: '1px solid rgba(234,158,43,0.1)',
            }}
          >
            {sidebar}
          </aside>
        </>
      )}

      {/* Docs content */}
      <main className="flex-1 min-w-0 p-6 md:p-12 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
