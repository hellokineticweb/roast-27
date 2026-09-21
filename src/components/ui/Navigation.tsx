'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { soundscape } from '@/lib/audio';
import { Volume2, VolumeX, ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = React.memo(function Navigation() {
  const { totalCount, openCart, soundEnabled, toggleSound } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    soundscape.playClick(800);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d0a08]/85 backdrop-blur-md py-4 border-b border-[#30261f]/60'
            : 'bg-gradient-to-b from-[#0c0a09]/90 to-transparent py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="group flex items-center gap-3 text-left focus:outline-hidden"
            data-cursor="ROAST/27"
          >
            <div className="w-8 h-8 rounded-full border border-[#e09f67]/60 flex items-center justify-center bg-[#1c1612] group-hover:border-[#e09f67] transition-colors">
              <span className="text-[11px] font-mono font-bold text-[#e09f67]">27</span>
            </div>
            <div>
              <span className="font-serif tracking-[0.25em] text-lg md:text-xl font-bold text-[#f5f0eb] group-hover:text-[#e09f67] transition-colors">
                ROAST / 27
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#a09487] font-sans -mt-0.5">
                Specialty Coffee Atelier
              </span>
            </div>
          </button>

          {/* Desktop Narrative Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] tracking-[0.2em] uppercase font-sans text-[#c5b8ab]">
            <button
              onClick={() => scrollTo('origin')}
              className="hover:text-[#e09f67] transition-colors cursor-pointer"
              data-cursor="VIEW"
            >
              01 Origin
            </button>
            <button
              onClick={() => scrollTo('harvest')}
              className="hover:text-[#e09f67] transition-colors cursor-pointer"
              data-cursor="VIEW"
            >
              02 Harvest
            </button>
            <button
              onClick={() => scrollTo('roast')}
              className="hover:text-[#e09f67] transition-colors cursor-pointer"
              data-cursor="VIEW"
            >
              03 Roast
            </button>
            <button
              onClick={() => scrollTo('aroma')}
              className="hover:text-[#e09f67] transition-colors cursor-pointer"
              data-cursor="VIEW"
            >
              04 Aroma
            </button>
            <button
              onClick={() => scrollTo('ritual')}
              className="hover:text-[#e09f67] transition-colors cursor-pointer"
              data-cursor="VIEW"
            >
              05 Ritual
            </button>
            <button
              onClick={() => scrollTo('products')}
              className="text-[#e09f67] font-semibold hover:text-[#f3c77c] transition-colors flex items-center gap-1.5 cursor-pointer"
              data-cursor="SHOP"
            >
              <Sparkles className="w-3 h-3" />
              The Roasts
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                soundEnabled
                  ? 'border-[#e09f67] bg-[#e09f67]/15 text-[#f3c77c]'
                  : 'border-[#382d24] bg-[#1a1410]/60 text-[#a09487] hover:border-[#524134]'
              }`}
              title="Toggle Roasting Soundscape"
              data-cursor="SOUND"
              aria-label="Toggle Roasting Ambient Soundscape"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#e09f67] animate-pulse" />
                  <span className="hidden sm:inline">SOUNDSCAPE ON</span>
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#e09f67] h-full animate-[bounce_0.8s_infinite]"></span>
                    <span className="w-0.5 bg-[#e09f67] h-2/3 animate-[bounce_1.1s_infinite]"></span>
                    <span className="w-0.5 bg-[#e09f67] h-4/5 animate-[bounce_0.6s_infinite]"></span>
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ATMOSPHERE</span>
                </>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-[#1e1712] border border-[#3d2f25] text-[#f5f0eb] hover:border-[#e09f67] transition-colors cursor-pointer"
              data-cursor="CART"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#e09f67]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c85a32] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0d0a08]">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-[#1e1712] border border-[#3d2f25] text-[#f5f0eb] cursor-pointer"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0d0a08]/95 backdrop-blur-xl pt-28 px-8 flex flex-col justify-between pb-12 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-serif text-[#f5f0eb]">
              {[
                { id: 'origin', label: '01 — ORIGIN' },
                { id: 'harvest', label: '02 — HARVEST' },
                { id: 'roast', label: '03 — ROAST' },
                { id: 'aroma', label: '04 — AROMA' },
                { id: 'ritual', label: '05 — RITUAL' },
                { id: 'products', label: 'SIGNATURE ROASTS' },
                { id: 'brew-tool', label: 'BREWING SIMULATOR' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-[#d9cbb8] hover:text-[#e09f67] border-b border-[#2d221a] pb-3"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#8c7f73] font-mono">
              ROAST / 27 SPECIALTY COFFEE • SMALL-BATCH ATELIER
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
