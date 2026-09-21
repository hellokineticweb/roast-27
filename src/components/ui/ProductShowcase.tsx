'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/data/coffeeData';
import { useCart } from '@/context/CartContext';
import { soundscape } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Globe2,
  Zap,
} from 'lucide-react';

export const ProductShowcase = React.memo(function ProductShowcase() {
  const { activeProductIndex, setActiveProductIndex, addItem } = useCart();
  const [selectedGrind, setSelectedGrind] = useState<string>('Whole Bean');
  const [selectedSize, setSelectedSize] = useState<string>('250g');
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'sensory' | 'story'>('profile');

  const currentProduct = PRODUCTS[activeProductIndex] || PRODUCTS[0];

  const grinds = [
    { id: 'Whole Bean', label: 'Whole Bean', desc: 'Peak freshness' },
    { id: 'Pour Over', label: 'Filter / Pour-Over', desc: 'V60, Chemex' },
    { id: 'Espresso', label: 'Fine Espresso', desc: '9 Bar Portafilter' },
    { id: 'French Press', label: 'Coarse Press', desc: 'Immersion & Cold Brew' },
  ];

  const sizes = [
    { id: '250g', label: '250g', subtitle: 'Standard Atelier' },
    { id: '500g', label: '500g', subtitle: 'Connoisseur Reserve (+85%)' },
    { id: '1kg', label: '1kg', subtitle: 'Master Tin (+240%)' },
  ];

  const getCalculatedPrice = () => {
    const mult = selectedSize === '500g' ? 1.85 : selectedSize === '1kg' ? 3.4 : 1.0;
    const disc = isSubscription ? 0.85 : 1.0;
    return Math.round(currentProduct.price * mult * disc);
  };

  const handleProductSelect = (index: number) => {
    soundscape.playClick(900 + index * 100);
    setActiveProductIndex(index);
  };

  const handleAddToCart = () => {
    addItem(currentProduct, selectedGrind, selectedSize, isSubscription);
  };

  return (
    <section id="products" className="relative min-h-screen py-32 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1711] border border-[#3e2e21] text-[#e09f67] text-[11px] font-mono tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIGNATURE SELECTIONS</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-bold text-[#f5f0eb] tracking-tight">
          THE ROAST LIBRARY
        </h2>
        <p className="text-[#bfb09f] text-base sm:text-lg mt-4 font-light leading-relaxed">
          Three uncompromising roasting philosophies. Selected micro-lots roasted in numbered 12kg batches.
        </p>

        {/* Product Switcher Pills */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-10 p-2 rounded-full bg-[#15100c] border border-[#2d2117] max-w-md mx-auto">
          {PRODUCTS.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => handleProductSelect(idx)}
              className={`flex-1 py-3 px-4 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeProductIndex === idx
                  ? 'bg-gradient-to-r from-[#e09f67] to-[#c85a32] text-[#0d0a08] shadow-lg shadow-[#e09f67]/20 scale-105'
                  : 'text-[#8e8174] hover:text-[#f5f0eb]'
              }`}
              data-cursor={prod.name}
            >
              {prod.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bespoke Editorial Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Product Info & Tasting Card */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Badge & Roasting Classification */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2a1e16] border border-[#4d392a] text-[#f3c77c]">
                  {currentProduct.badge}
                </span>
                <span className="text-xs font-mono tracking-widest text-[#a89b8d] uppercase">
                  {currentProduct.roastProfile}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-5xl sm:text-7xl font-serif font-extrabold text-[#f5f0eb] tracking-tight">
                  {currentProduct.name}
                </h3>
                <p className="text-lg font-serif italic text-[#e09f67] mt-2">
                  {currentProduct.tagline}
                </p>
              </div>

              {/* Origin Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="p-3 rounded-xl bg-[#18120e] border border-[#2d2117]">
                  <span className="text-[10px] font-mono text-[#8b7e71] uppercase block">Origin</span>
                  <span className="text-sm font-semibold text-[#f5f0eb]">{currentProduct.origin}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#18120e] border border-[#2d2117]">
                  <span className="text-[10px] font-mono text-[#8b7e71] uppercase block">Elevation</span>
                  <span className="text-sm font-semibold text-[#f5f0eb]">{currentProduct.elevation}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#18120e] border border-[#2d2117]">
                  <span className="text-[10px] font-mono text-[#8b7e71] uppercase block">Varietal</span>
                  <span className="text-sm font-semibold text-[#f5f0eb] truncate block">{currentProduct.varietal}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#18120e] border border-[#2d2117]">
                  <span className="text-[10px] font-mono text-[#8b7e71] uppercase block">Process</span>
                  <span className="text-sm font-semibold text-[#f5f0eb] truncate block">{currentProduct.process}</span>
                </div>
              </div>

              {/* Tasting Notes Tags */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#8b7e71] block mb-3">
                  Cupping Tasting Notes
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {currentProduct.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-4 py-2 rounded-xl bg-[#221812] border border-[#3e2e21] text-[#f5f0eb] text-xs font-medium tracking-wide flex items-center gap-2 shadow-inner"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e09f67]" />
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Tabs: Profile vs Sensory vs Story */}
              <div className="p-6 rounded-2xl bg-[#15100c] border border-[#2b1f16] space-y-4">
                <div className="flex border-b border-[#291e16] pb-3 gap-6 text-xs font-mono uppercase tracking-wider">
                  <button
                    onClick={() => {
                      soundscape.playClick(800);
                      setActiveTab('profile');
                    }}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'border-[#e09f67] text-[#f5f0eb] font-bold'
                        : 'border-transparent text-[#7e7164] hover:text-[#c4b5a4]'
                    }`}
                  >
                    Sensory Radar
                  </button>
                  <button
                    onClick={() => {
                      soundscape.playClick(800);
                      setActiveTab('sensory');
                    }}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'sensory'
                        ? 'border-[#e09f67] text-[#f5f0eb] font-bold'
                        : 'border-transparent text-[#7e7164] hover:text-[#c4b5a4]'
                    }`}
                  >
                    Volatile Flavors
                  </button>
                  <button
                    onClick={() => {
                      soundscape.playClick(800);
                      setActiveTab('story');
                    }}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'story'
                        ? 'border-[#e09f67] text-[#f5f0eb] font-bold'
                        : 'border-transparent text-[#7e7164] hover:text-[#c4b5a4]'
                    }`}
                  >
                    Atelier Story
                  </button>
                </div>

                {activeTab === 'profile' && (
                  <div className="space-y-3.5 pt-2">
                    {Object.entries(currentProduct.sensoryScores).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="capitalize text-[#bfb09f]">{key}</span>
                          <span className="text-[#e09f67] font-bold">{val}/100</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#201812] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#c85a32] to-[#e09f67]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'sensory' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentProduct.flavorDescriptors.map((desc) => (
                      <div
                        key={desc.name}
                        className="p-3 rounded-xl bg-[#1f1610] border border-[#37271c] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#f5f0eb] block">{desc.name}</span>
                          <span className="text-[10px] text-[#e09f67] font-mono">{desc.category}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#f3c77c]">{desc.intensity}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'story' && (
                  <div className="pt-2 text-sm text-[#d4c5b5] font-light leading-relaxed space-y-3">
                    <p>{currentProduct.story}</p>
                    <div className="p-3 rounded-xl bg-[#1b140f] border border-[#302318] text-xs font-mono text-[#a09385]">
                      <strong className="text-[#e09f67]">Recommended Brew:</strong> {currentProduct.recommendedBrew}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Interactive Purchase & Customization Box */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1b140f] to-[#100c09] border border-[#3a2c20] shadow-2xl space-y-7 sticky top-28 backdrop-blur-xl">
            
            {/* Price Header */}
            <div className="flex items-baseline justify-between border-b border-[#2e2117] pb-6">
              <div>
                <span className="text-xs font-mono text-[#8c7e71] uppercase tracking-widest block">
                  CRAFT PRICE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-serif font-bold text-[#f5f0eb]">
                    ${getCalculatedPrice()}
                  </span>
                  <span className="text-xs text-[#8c7e71] font-mono">USD / {selectedSize}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e09f67] bg-[#2b1e16] px-2.5 py-1 rounded-md border border-[#4a3525]">
                  <Zap className="w-3 h-3 text-[#e09f67]" />
                  Freshly Roasted
                </span>
              </div>
            </div>

            {/* Grind Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#e8ded4] uppercase tracking-wider font-semibold">Grind Profile</span>
                <span className="text-[#e09f67]">{selectedGrind}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {grinds.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      soundscape.playClick(750);
                      setSelectedGrind(g.id);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedGrind === g.id
                        ? 'bg-[#2a1d15] border-[#e09f67] text-[#f5f0eb] shadow-md shadow-[#e09f67]/10'
                        : 'bg-[#15100c] border-[#291e16] text-[#8e8174] hover:border-[#423124]'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{g.label}</span>
                    <span className="text-[10px] text-[#85776a] block mt-0.5">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bag Weight Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#e8ded4] uppercase tracking-wider font-semibold">Bag Weight</span>
                <span className="text-[#e09f67]">{selectedSize}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      soundscape.playClick(750);
                      setSelectedSize(s.id);
                    }}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedSize === s.id
                        ? 'bg-[#2a1d15] border-[#e09f67] text-[#f5f0eb]'
                        : 'bg-[#15100c] border-[#291e16] text-[#8e8174] hover:border-[#423124]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{s.label}</span>
                    <span className="text-[9px] text-[#85776a] block mt-0.5">{s.id === '250g' ? 'Standard' : s.id === '500g' ? 'Save 10%' : 'Save 20%'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription vs One-Time Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#140e0a] border border-[#2b1f16] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#e09f67]" />
                  <span className="text-xs font-semibold text-[#f5f0eb]">Subscribe & Save 15%</span>
                </div>
                <button
                  onClick={() => {
                    soundscape.playClick(850);
                    setIsSubscription(!isSubscription);
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    isSubscription ? 'bg-[#e09f67]' : 'bg-[#291f16]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[#0d0a08] transition-transform ${
                      isSubscription ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {isSubscription && (
                <p className="text-[11px] text-[#b8a99a] leading-relaxed pl-6">
                  Delivered fresh every 2 weeks. Pause, modify, or cancel anytime. Zero commitment.
                </p>
              )}
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#e09f67] via-[#f3c77c] to-[#c85a32] text-[#0d0a08] font-bold text-sm tracking-widest uppercase shadow-xl hover:shadow-[#e09f67]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
              data-cursor="ADD"
            >
              <ShoppingBag className="w-4 h-4 text-[#0d0a08]" />
              <span>Add to Atelier Cart • ${getCalculatedPrice()}</span>
            </button>

            {/* Guarantees */}
            <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-[#8a7c6f]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e09f67]" />
                Roast-to-Order Freshness
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#e09f67]" />
                Direct Trade 100%
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
});
