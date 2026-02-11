'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const docsSidebar = [
  { section: 'Getting Started', links: [
    { name: 'Overview', href: '/docs' },
    { name: 'Authentication', href: '/docs/authentication' },
  ]},
  { section: 'Games', links: [
    { name: 'Claw Machine', href: '/docs/games' },
    { name: 'Shell Shuffle', href: '/docs/games' },
    { name: 'Lobster Slots', href: '/docs/games' },
    { name: 'Crab Roulette', href: '/docs/games' },
  ]},
  { section: 'Economy', links: [
    { name: 'CrustyCoins', href: '/docs/economy' },
    { name: 'Daily Rewards', href: '/docs/economy' },
  ]},
  { section: 'Resources', links: [
    { name: 'Code Examples', href: '/docs/examples' },
  ]},
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Docs sidebar */}
      <aside
        className="hidden md:block sticky top-0 h-screen w-64 flex-shrink-0 p-6 overflow-y-auto border-r border-white/5"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span>🦞</span>
          <span className="text-sm font-bold" style={{ fontFamily: 'Bungee Shade, cursive', color: '#cc2c18' }}>
            CRUSTY DOCS
          </span>
        </Link>

        {docsSidebar.map((section) => (
          <div key={section.section} className="mb-6">
            <h3 className="text-xs uppercase tracking-widest mb-2 opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {section.section}
            </h3>
            {section.links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block text-sm py-1.5 px-2 rounded-sm mb-0.5 ${
                  pathname === link.href ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: pathname === link.href ? 'rgba(57,255,20,0.1)' : 'transparent',
                  color: pathname === link.href ? '#39ff14' : '#f5f5f0',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      {/* Docs content */}
      <main className="flex-1 p-8 md:p-12 max-w-4xl">{children}</main>
    </div>
  );
}
