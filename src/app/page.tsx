'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });
const ScrollProgressBar = dynamic(() => import('@/components/landing/ScrollProgressBar'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), { ssr: false });
const TheBucket = dynamic(() => import('@/components/landing/TheBucket'), { ssr: false });
const GamePreviewCarousel = dynamic(() => import('@/components/landing/GamePreviewCarousel'), { ssr: false });
const FeatureCards = dynamic(() => import('@/components/landing/FeatureCards'), { ssr: false });
const CrustyStats = dynamic(() => import('@/components/landing/CrustyStats'), { ssr: false });
const AgentCTA = dynamic(() => import('@/components/landing/AgentCTA'), { ssr: false });
const FooterGraffiti = dynamic(() => import('@/components/landing/FooterGraffiti'), { ssr: false });
const StickerScatter = dynamic(() => import('@/components/landing/StickerScatter'), { ssr: false });
const SprayDrip = dynamic(() => import('@/components/landing/SprayDrip'), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    console.log('[HomePage] mounted successfully');
    return () => {
      console.log('[HomePage] unmounted');
    };
  }, []);

  return (
    <div className="wall-texture">
      <ScrollProgressBar />
      <Navbar />
      <StickerScatter>
        <main>
          <HeroSection />
          {/* Hero (#0a0a0f) -> TheBucket (#1a1a2e) */}
          <SprayDrip colorFrom="#0a0a0f" colorTo="#1a1a2e" variant={0} />
          <TheBucket />
          {/* TheBucket (#1a1a2e) -> GamePreviewCarousel (#0a0a0f) */}
          <SprayDrip colorFrom="#1a1a2e" colorTo="#0a0a0f" variant={1} />
          <GamePreviewCarousel />
          {/* GamePreviewCarousel (#0a0a0f) -> FeatureCards (#1a1a2e) */}
          <SprayDrip colorFrom="#0a0a0f" colorTo="#1a1a2e" variant={2} />
          <FeatureCards />
          {/* FeatureCards (#1a1a2e) -> CrustyStats (#0a0a0f) */}
          <SprayDrip colorFrom="#1a1a2e" colorTo="#0a0a0f" variant={3} />
          <CrustyStats />
          {/* CrustyStats (#0a0a0f) -> AgentCTA (#16213e) */}
          <SprayDrip colorFrom="#0a0a0f" colorTo="#16213e" variant={0} />
          <AgentCTA />
          {/* AgentCTA (#16213e) -> Footer (#0a0a0f) */}
          <SprayDrip colorFrom="#16213e" colorTo="#0a0a0f" variant={1} />
        </main>
        <FooterGraffiti />
      </StickerScatter>
    </div>
  );
}
