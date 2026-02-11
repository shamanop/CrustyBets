import type { Metadata } from 'next';
import ClawsinoShell from './ClawsinoShell';

export const metadata: Metadata = {
  title: {
    template: '%s | CrustyBets Clawsino',
    default: 'Clawsino Lobby | CrustyBets',
  },
  description:
    'Enter the CrustyBets Clawsino. Play claw machines, shell games, lobster slots, and crab roulette for CrustyCoins.',
};

console.log('[ClawsinoLayout] rendering');

export default function ClawsinoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClawsinoShell>{children}</ClawsinoShell>;
}
