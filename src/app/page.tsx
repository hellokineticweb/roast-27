'use client';

import React, { useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { HeroSection } from '@/components/ui/HeroSection';
import { StoryChapters } from '@/components/ui/StoryChapters';
import { ProductShowcase } from '@/components/ui/ProductShowcase';
import { BrewingRitualTool } from '@/components/ui/BrewingRitualTool';
import { Footer } from '@/components/ui/Footer';
import { motionEngine } from '@/lib/motionState';

// Progressive non-blocking 3D Canvas
const CoffeeExperienceCanvas = dynamic(
  () =>
    import('@/components/canvas/CoffeeExperienceCanvas').then(
      (mod) => mod.CoffeeExperienceCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#0d0a08] flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-[#e09f67]/5 blur-3xl" />
      </div>
    ),
  }
);

export default function Home() {
  const { activeProductIndex } = useCart();

  useEffect(() => {
    motionEngine.init();
  }, []);

  const handleExplore = useCallback(() => {
    const originEl = document.getElementById('origin');
    if (originEl) {
      originEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0d0a08] overflow-hidden">
      {/* Persistent 3D WebGL Background Canvas (Zero React re-render during scroll) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CoffeeExperienceCanvas productIndex={activeProductIndex} />
      </div>

      {/* Atmospheric Background Gradients & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(13,10,8,0.7)_70%,#0d0a08_100%)]" />

      {/* Foreground Interactive Editorial Content */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <HeroSection onExplore={handleExplore} />

        {/* 5-Act Narrative Story: Origin -> Harvest -> Roast -> Aroma -> Ritual */}
        <StoryChapters />

        {/* Signature Products Section */}
        <ProductShowcase />

        {/* Interactive Extraction Ritual & Stopwatch Tool */}
        <BrewingRitualTool />

        {/* Luxury Editorial Footer */}
        <Footer />
      </div>
    </div>
  );
}
