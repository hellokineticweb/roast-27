'use client';

import React, { useState } from 'react';
import { soundscape } from '@/lib/audio';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      soundscape.playPourChime();
      setSubscribed(true);
    }
  };

  const scrollToTop = () => {
    soundscape.playClick(900);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0a0807] border-t border-[#241a13] pt-24 pb-16 px-6 md:px-12 text-[#9a8d80] content-auto">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Top Newsletter & VIP Invitations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-[#211812] pb-16">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#e09f67] block">
              PRIVATE CUPPING INVITATIONS
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#f5f0eb]">
              Receive First Access to Micro-Lots.
            </h3>
            <p className="text-sm text-[#8c7f73] font-light leading-relaxed">
              Never miss a 12kg limited release. We send private release notifications forty-eight hours prior to general public availability.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 rounded-2xl bg-[#1b140f] border border-[#e09f67] text-[#f5f0eb] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#e09f67]" />
                <span className="text-xs font-mono">
                  Welcome to the Atelier. Your invitation code has been issued.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter connoisseur email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-full bg-[#15100c] border border-[#36271c] text-sm text-[#f5f0eb] placeholder:text-[#6a5e53] focus:outline-hidden focus:border-[#e09f67]"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#e09f67] to-[#c85a32] text-[#0d0a08] font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer"
                  data-cursor="JOIN"
                >
                  Join Library
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Brand Columns & Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-xs font-mono">
          <div className="space-y-4">
            <span className="text-[#f5f0eb] font-bold uppercase tracking-wider block">
              THE NARRATIVE
            </span>
            <ul className="space-y-2.5 text-[#85776a]">
              <li><a href="#origin" className="hover:text-[#e09f67] transition-colors">01 Terroir & Altitude</a></li>
              <li><a href="#harvest" className="hover:text-[#e09f67] transition-colors">02 Selective Hand-Cut</a></li>
              <li><a href="#roast" className="hover:text-[#e09f67] transition-colors">03 First Crack Kinetics</a></li>
              <li><a href="#aroma" className="hover:text-[#e09f67] transition-colors">04 Volatile Chemistry</a></li>
              <li><a href="#ritual" className="hover:text-[#e09f67] transition-colors">05 27g Daily Ceremony</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[#f5f0eb] font-bold uppercase tracking-wider block">
              THE ROASTS
            </span>
            <ul className="space-y-2.5 text-[#85776a]">
              <li><a href="#products" className="hover:text-[#e09f67] transition-colors">DAWN (Light Floral)</a></li>
              <li><a href="#products" className="hover:text-[#e09f67] transition-colors">ORIGIN (Medium Fruit)</a></li>
              <li><a href="#products" className="hover:text-[#e09f67] transition-colors">MIDNIGHT (Dark Cacao)</a></li>
              <li><a href="#brew-tool" className="hover:text-[#e09f67] transition-colors">Brewing Simulator</a></li>
              <li><a href="#products" className="hover:text-[#e09f67] transition-colors">Subscription Protocol</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[#f5f0eb] font-bold uppercase tracking-wider block">
              PROVENANCE
            </span>
            <ul className="space-y-2.5 text-[#85776a]">
              <li><span>Direct-Trade Index: 100%</span></li>
              <li><span>Farmer Price: 280% Fairtrade</span></li>
              <li><span>Batch Roaster: Cast Iron 12kg</span></li>
              <li><span>Altitude: Up to 2,300 MASL</span></li>
              <li><span>Packaging: 100% Recyclable Foil</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[#f5f0eb] font-bold uppercase tracking-wider block">
              ATELIER HEADQUARTERS
            </span>
            <p className="text-[#85776a] leading-relaxed">
              ROAST / 27 Experimental Roastery<br />
              440 Artisan District, Suite 27<br />
              Micro-Lot Laboratory<br />
              cupping@roast27.coffee
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#e09f67] hover:underline pt-2 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Flagship Portfolio Tag */}
        <div className="pt-12 border-t border-[#1a140f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6e6155]">
          <div>
            © 2027 ROAST / 27 SPECIALTY COFFEE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-2">
            <span>A CINEMATIC 3D PRODUCT FILM EXPERIENCE</span>
            <span>•</span>
            <span className="text-[#e09f67]">FLAGSHIP DIGITAL PORTFOLIO</span>
          </div>
        </div>

      </div>
    </footer>
  );
});
