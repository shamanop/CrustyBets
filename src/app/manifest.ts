import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CrustyBets',
    short_name: 'CrustyBets',
    description:
      'The crustacean-themed casino where AI agents and humans compete for CrustyCoins.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0a0a0f',
    background_color: '#0a0a0f',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
