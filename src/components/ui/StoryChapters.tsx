'use client';

import React, { useState } from 'react';
import { STORY_CHAPTERS } from '@/data/coffeeData';
import { motion } from 'framer-motion';
import { soundscape } from '@/lib/audio';
import { Mountain, Sun, Flame, Wind, Coffee, CheckCircle2, Sparkles } from 'lucide-react';

const CHAPTER_ICONS = [Mountain, Sun, Flame, Wind, Coffee];

export const StoryChapters = React.memo(function StoryChapters() {
  const [activeTab, setActiveTab] = useState<'roastCurve' | 'temp'>('roastCurve');
  const [selectedVolatile, setSelectedVolatile] = useState<string>('Bergamot');

  return (
    <div className="relative w-full space-y-36 sm:space-y-48 py-24">
      {STORY_CHAPTERS.map((chapter, idx) => {
        const IconComponent = CHAPTER_ICONS[idx] || Mountain;
        const sectionId = chapter.title.toLowerCase();

        return (
          <section
            key={chapter.number}
            id={sectionId}
            className="relative min-h-[90vh] flex items-center px-6 md:px-12 max-w-7xl mx-auto content-auto"
          >
            <div className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              
              {/* Text Editorial Column */}
              <div className={`lg:col-span-6 space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                {/* Chapter Eyebrow Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1e1712] border border-[#3e2f24] flex items-center justify-center text-[#e09f67]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e09f67] uppercase">
                    {chapter.eyebrow}
                  </span>
                </motion.div>

                {/* Big Editorial Title */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                >
                  <span className="block text-6xl sm:text-7xl lg:text-8xl font-serif font-black text-[#1c1611]/80 tracking-tighter select-none -mb-4">
                    {chapter.number}
                  </span>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#f5f0eb] tracking-tight">
                    {chapter.title}
                  </h2>
                  <p className="text-lg font-mono text-[#e09f67] tracking-wider mt-2">
                    {chapter.subtitle}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-base sm:text-lg text-[#d0c1b0] leading-relaxed font-light"
                >
                  {chapter.description}
                </motion.p>

                {/* Pull Quote */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border-l-2 border-[#e09f67] pl-5 py-1 italic font-serif text-lg text-[#e8ded3]"
                >
                  {chapter.quote}
                </motion.blockquote>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
                >
                  {chapter.stats.map((st, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#181310]/80 border border-[#30251d] backdrop-blur-md hover:border-[#e09f67]/60 transition-colors"
                    >
                      <div className="text-2xl font-serif font-bold text-[#f5f0eb]">
                        {st.value}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#e09f67] uppercase tracking-wider mt-1">
                        {st.label}
                      </div>
                      <div className="text-[11px] text-[#8e8174] mt-1 leading-snug">
                        {st.detail}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Interactive Visual & Sensory Interactive Card */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7 }}
                  className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d1712]/90 via-[#140f0c]/90 to-[#0b0907]/90 border border-[#382b20] shadow-2xl backdrop-blur-xl overflow-hidden will-change-transform"
                >
                  {/* Decorative glow ambient orb */}
                  <div
                    className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: chapter.accentColor }}
                  />

                  {/* Section-Specific Interactive Elements */}
                  {chapter.number === '01' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#2d221a] pb-4">
                        <span className="text-xs font-mono text-[#a89b8d] tracking-widest uppercase">
                          TERROIR TOPOGRAPHY DATA
                        </span>
                        <span className="text-xs font-mono text-[#e09f67]">LAT 6°08&apos;N / LONG 38°15&apos;E</span>
                      </div>

                      {/* Elevation Elevation Layers */}
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-[#231b15] border border-[#433327] flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-[#f5f0eb] block">Yirgacheffe High Altitude Ridge</span>
                            <span className="text-xs text-[#a09487]">Volcanic loam, cloud forest moisture canopy</span>
                          </div>
                          <span className="font-mono text-base font-bold text-[#e09f67]">2,300 MASL</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#19130f] border border-[#31251c] flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-[#f5f0eb] block">San Adolfo Valley Terroir</span>
                            <span className="text-xs text-[#a09487]">Pink Bourbon heirloom micro-estate</span>
                          </div>
                          <span className="font-mono text-base font-bold text-[#d67d55]">1,950 MASL</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#120e0b] border border-[#261c15] flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-[#f5f0eb] block">Antigua Volcanic Basalt Valley</span>
                            <span className="text-xs text-[#a09487]">Agua & Fuego volcanic mineral ash</span>
                          </div>
                          <span className="font-mono text-base font-bold text-[#c85a32]">1,750 MASL</span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-[#8b7d70] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#e09f67]" />
                        <span>Direct-trade single lot verified chain of custody.</span>
                      </div>
                    </div>
                  )}

                  {chapter.number === '02' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#2d221a] pb-4">
                        <span className="text-xs font-mono text-[#a89b8d] tracking-widest uppercase">
                          BRIX DENSITY & ANAEROBIC TIMELINE
                        </span>
                        <span className="text-xs font-mono text-[#e09f67]">FERMENTATION LOG</span>
                      </div>

                      {/* Brix Gauge Interactive Progress */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-[#f5f0eb]">Selective Brix Sugar Density</span>
                            <span className="text-[#e09f67] font-bold">24.5° Brix (Optimal)</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-[#201812] overflow-hidden p-0.5 border border-[#3d2f24]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '85%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.0, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-[#d67d55] to-[#f3c77c]"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#201712] border border-[#3f2f23] space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#e09f67] font-bold">Phase 1: Optical Sorting</span>
                            <span className="text-[#8c7f72]">0h — Defect Free</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#e09f67] font-bold">Phase 2: CO₂ Pressure Sealed</span>
                            <span className="text-[#8c7f72]">24h — Anaerobic Tank</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#e09f67] font-bold">Phase 3: African Raised Bed Dry</span>
                            <span className="text-[#8c7f72]">18 Days Slow Cure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {chapter.number === '03' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#2d221a] pb-4">
                        <span className="text-xs font-mono text-[#a89b8d] tracking-widest uppercase">
                          THERMAL ROAST PROFILE
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              soundscape.playClick(850);
                              setActiveTab('roastCurve');
                            }}
                            className={`text-xs px-2.5 py-1 rounded-md font-mono ${
                              activeTab === 'roastCurve' ? 'bg-[#e09f67] text-[#0d0a08]' : 'text-[#a09487]'
                            }`}
                          >
                            RoR Curve
                          </button>
                        </div>
                      </div>

                      {/* SVG Interactive Roast Curve Graph */}
                      <div className="p-4 rounded-2xl bg-[#140e0a] border border-[#2f2219]">
                        <div className="h-44 w-full relative flex items-end">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                            <line x1="0" y1="40" x2="400" y2="40" stroke="#251a13" strokeDasharray="4 4" />
                            <line x1="0" y1="80" x2="400" y2="80" stroke="#251a13" strokeDasharray="4 4" />
                            <line x1="0" y1="120" x2="400" y2="120" stroke="#251a13" strokeDasharray="4 4" />

                            <path
                              d="M 10 145 C 50 140, 100 120, 160 85 C 220 55, 290 35, 390 20"
                              fill="none"
                              stroke="#e09f67"
                              strokeWidth="3.5"
                            />
                            <path
                              d="M 10 20 C 60 40, 130 90, 200 110 C 270 125, 340 135, 390 142"
                              fill="none"
                              stroke="#c85a32"
                              strokeWidth="2"
                              strokeDasharray="5 5"
                            />

                            <circle cx="280" cy="40" r="5" fill="#f3c77c" />
                            <text x="280" y="25" fill="#f3c77c" fontSize="11" textAnchor="middle" fontFamily="monospace">
                              FIRST CRACK (8m 30s)
                            </text>
                          </svg>
                        </div>

                        <div className="flex justify-between items-center text-xs font-mono text-[#8f8275] mt-3 pt-3 border-t border-[#261c14]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-[#e09f67]" /> Bean Temp (208°C)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-[#c85a32]" /> RoR Delta (7.2°C/min)
                          </span>
                          <span className="text-[#f3c77c] font-bold">DTR: 14.2%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {chapter.number === '04' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#2d221a] pb-4">
                        <span className="text-xs font-mono text-[#a89b8d] tracking-widest uppercase">
                          SENSORY VOLATILE RADAR
                        </span>
                        <span className="text-xs font-mono text-[#e09f67]">1,200+ MOLECULES</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { note: 'Bergamot', compound: 'Linalool & Limonene', cat: 'Floral / Citrus' },
                          { note: 'Dark Cacao', compound: 'Pyrazines & Polyphenols', cat: 'Roasty' },
                          { note: 'Wild Jasmine', compound: 'Methyl Jasmonate', cat: 'Ethereal Floral' },
                          { note: 'Panela', compound: 'Furans & Maltol', cat: 'Caramelized Sugar' },
                          { note: 'Blood Orange', compound: 'Octanal & Valencene', cat: 'Citric Acidity' },
                          { note: 'Smoked Cedar', compound: 'Guaiacol & Eugenol', cat: 'Woody Resonance' },
                        ].map((item) => (
                          <button
                            key={item.note}
                            onClick={() => {
                              soundscape.playClick(920);
                              setSelectedVolatile(item.note);
                            }}
                            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                              selectedVolatile === item.note
                                ? 'bg-[#2a1e16] border-[#e09f67] text-[#f5f0eb] shadow-lg shadow-[#e09f67]/10'
                                : 'bg-[#15100c] border-[#291f17] text-[#9b8d7f] hover:border-[#433225]'
                            }`}
                          >
                            <span className="text-xs font-bold block text-[#f5f0eb]">{item.note}</span>
                            <span className="text-[10px] text-[#e09f67] font-mono mt-0.5">{item.cat}</span>
                            <span className="text-[9px] text-[#716559] block mt-1 truncate">{item.compound}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#1d1510] border border-[#382a1f] flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-[#e09f67]" />
                        <span className="text-xs text-[#d5c5b5]">
                          Active olfactory key: <strong className="text-[#f5f0eb]">{selectedVolatile}</strong> releases within 90s of grind extraction.
                        </span>
                      </div>
                    </div>
                  )}

                  {chapter.number === '05' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#2d221a] pb-4">
                        <span className="text-xs font-mono text-[#a89b8d] tracking-widest uppercase">
                          THE 27-GRAM GOLDEN EXTRACTION
                        </span>
                        <span className="text-xs font-mono text-[#e09f67]">V60 / CHEMEX FORMULA</span>
                      </div>

                      {/* Interactive Brew Steps */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#231a13] border border-[#443326]">
                          <div className="w-7 h-7 rounded-full bg-[#e09f67] text-[#0d0a08] font-bold font-mono text-xs flex items-center justify-center">
                            1
                          </div>
                          <div className="text-xs">
                            <strong className="text-[#f5f0eb] block">0:00 — 0:30 (Bloom)</strong>
                            <span className="text-[#9c8e80]">60g mineral water at 93°C. Agitate once.</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b140f] border border-[#34271c]">
                          <div className="w-7 h-7 rounded-full bg-[#3e2e21] text-[#e09f67] font-bold font-mono text-xs flex items-center justify-center">
                            2
                          </div>
                          <div className="text-xs">
                            <strong className="text-[#f5f0eb] block">0:30 — 1:30 (Development Pour)</strong>
                            <span className="text-[#9c8e80]">Continuous spiral pour up to 240g.</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#130f0c] border border-[#271d15]">
                          <div className="w-7 h-7 rounded-full bg-[#3e2e21] text-[#e09f67] font-bold font-mono text-xs flex items-center justify-center">
                            3
                          </div>
                          <div className="text-xs">
                            <strong className="text-[#f5f0eb] block">1:30 — 3:15 (Finish & Drawdown)</strong>
                            <span className="text-[#9c8e80]">Final pulse to 432g. Flat dry bed.</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs font-mono text-[#e09f67] pt-2">
                        <span>RATIO 1:16</span>
                        <span>TOTAL YIELD: 380ml</span>
                        <span>TDS: 1.38%</span>
                      </div>
                    </div>
                  )}

                </motion.div>
              </div>

            </div>
          </section>
        );
      })}
    </div>
  );
});
