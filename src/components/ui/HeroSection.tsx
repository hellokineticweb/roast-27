'use client';

import React from 'react';
import { soundscape } from '@/lib/audio';
import { ArrowDown, Compass, Flame, Droplets, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection = React.memo(function HeroSection({ onExplore }: HeroSectionProps) {
  const handleCtaClick = () => {
    soundscape.playClick(900);
    onExplore();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 pointer-events-none"
    >
      {/* Top Meta Bar */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest text-[#a89b8d] uppercase max-w-7xl mx-auto w-full pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#e09f67] animate-ping" />
          <span className="text-[#f5f0eb] font-semibold">HARVEST 2026 EDITION</span>
          <span className="text-[#6b5e52]">/</span>
          <span>LOT 27-01 TO 27-03</span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#e09f67]" />
            2,300 MASL
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#e09f67]" />
            CONVECTIVE DRUM
          </span>
          <span className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-[#e09f67]" />
            ANAEROBIC SHOCK
          </span>
        </div>
      </motion.div>

      {/* Main Cinematic Headline */}
      <div className="max-w-7xl mx-auto w-full my-auto py-12 flex flex-col items-center md:items-start text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#201812]/80 border border-[#4a3a2d] text-[#e09f67] text-[11px] font-mono tracking-widest uppercase mb-6 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#e09f67]" />
            <span>CINEMATIC SPECIALTY COFFEE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold text-[#f5f0eb] tracking-tight leading-[0.95] mb-8 drop-shadow-2xl">
            ROASTED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e09f67] via-[#f3c77c] to-[#c85a32]">
              FOR THE MOMENT.
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-light text-[#d5c6b6] max-w-xl leading-relaxed mb-10">
            Small-batch specialty coffee crafted around flavour, ritual and time. From high-altitude volcanic soils to your precision pour-over.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pointer-events-auto">
            <button
              onClick={handleCtaClick}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#e09f67] to-[#c85a32] text-[#0d0a08] font-sans font-bold text-sm tracking-widest uppercase shadow-2xl hover:shadow-[#e09f67]/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
              data-cursor="EXPLORE"
            >
              <span>Explore the Roast</span>
              <div className="w-6 h-6 rounded-full bg-[#0d0a08] flex items-center justify-center text-[#e09f67] group-hover:translate-x-1 transition-transform">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </button>

            <a
              href="#products"
              onClick={() => soundscape.playClick(700)}
              className="px-7 py-4 rounded-full border border-[#47382d] bg-[#1a1410]/60 backdrop-blur-md text-[#f5f0eb] font-sans text-sm tracking-wider uppercase hover:border-[#e09f67] hover:text-[#e09f67] transition-all cursor-pointer"
              data-cursor="ORDER"
            >
              Discover The Blends
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Floating Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-[#8a7c6f] pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-[#4a392b]" />
          <span>INTERACTIVE 3D EXPERIENCE — DRAG TO ROTATE & SCROLL TO DESCEND</span>
        </div>

        <button
          onClick={handleCtaClick}
          className="hidden md:flex items-center gap-2 hover:text-[#e09f67] transition-colors cursor-pointer"
          data-cursor="SCROLL"
        >
          <span>SCROLL STORY</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
});
