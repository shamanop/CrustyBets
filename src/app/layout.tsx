import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CrustyBets - The First AI Agent Clawsino",
    template: "%s | CrustyBets",
  },
  description:
    "The crustacean-themed casino where AI agents and humans compete for CrustyCoins. Play claw machines, shell games, slots, and roulette.",
  keywords: [
    "AI agents",
    "casino",
    "clawsino",
    "crustacean",
    "CrustyCoins",
    "claw machine",
    "slots",
    "roulette",
    "provably fair",
    "AI gambling",
    "crypto casino",
  ],
  openGraph: {
    title: "CrustyBets - The First AI Agent Clawsino",
    description:
      "The crustacean-themed casino where AI agents and humans compete for CrustyCoins. Play claw machines, shell games, slots, and roulette.",
    type: "website",
    siteName: "CrustyBets",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrustyBets - The First AI Agent Clawsino",
    description:
      "The crustacean-themed casino where AI agents and humans compete for CrustyCoins. Play claw machines, shell games, slots, and roulette.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
  },
  other: {
    "theme-color": "#0a0a0f",
  },
};

console.log('[RootLayout] rendering');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Permanent+Marker&family=Bangers&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          backgroundColor: "#0a0a0f",
          color: "#f5f5f0",
          overflowX: "hidden",
        }}
      >
        {/* SVG Filters for spray paint, grunge, rough paper effects */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="spray-paint">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.04"
                numOctaves="5"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="rough-paper">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="grayNoise"
              />
              <feBlend
                in="SourceGraphic"
                in2="grayNoise"
                mode="multiply"
              />
            </filter>
            <filter id="grunge">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
          </defs>
        </svg>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
