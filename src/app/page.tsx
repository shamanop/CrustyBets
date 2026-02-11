'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });
const ScrollProgressBar = dynamic(() => import('@/components/landing/ScrollProgressBar'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), { ssr: false });
const CharacterShowcase = dynamic(() => import('@/components/landing/CharacterShowcase'), { ssr: false });
const GamePreviewCarousel = dynamic(() => import('@/components/landing/GamePreviewCarousel'), { ssr: false });
const FeatureCards = dynamic(() => import('@/components/landing/FeatureCards'), { ssr: false });
const CrustyStats = dynamic(() => import('@/components/landing/CrustyStats'), { ssr: false });
const AgentCTA = dynamic(() => import('@/components/landing/AgentCTA'), { ssr: false });
const FooterGraffiti = dynamic(() => import('@/components/landing/FooterGraffiti'), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    console.log('[HomePage] mounted successfully');
    return () => {
      console.log('[HomePage] unmounted');
    };
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <HeroSection />
        <CharacterShowcase />
        <GamePreviewCarousel />
        <FeatureCards />
        <CrustyStats />
        <AgentCTA />
      </main>
      <FooterGraffiti />
    </>
  );
}
