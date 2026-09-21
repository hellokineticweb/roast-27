'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BREW_GUIDES } from '@/data/coffeeData';
import { soundscape } from '@/lib/audio';
import { Play, Pause, RotateCcw, Droplets, Thermometer, Timer, Sparkles, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const BrewingRitualTool = React.memo(function BrewingRitualTool() {
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [dose, setDose] = useState<number>(27);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const guide = BREW_GUIDES[selectedMethod] || BREW_GUIDES[0];
  const ratio = selectedMethod === 0 ? 16 : selectedMethod === 1 ? 11 : 2.15;
  const calculatedWater = Math.round(dose * ratio);
  const bloomWater = Math.round(dose * 2.2);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next === 30 || next === 75 || next === 120 || next === 195) {
            soundscape.playPourChime();
          }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const toggleTimer = () => {
    soundscape.playClick(900);
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    soundscape.playClick(500);
    setTimerRunning(false);
    setSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <section id="brew-tool" className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto content-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1510] border border-[#3e2e21] text-[#e09f67] text-[11px] font-mono tracking-widest uppercase mb-4">
          <Coffee className="w-3.5 h-3.5" />
          <span>PRECISION EXTRACTION TOOL</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#f5f0eb] tracking-tight">
          THE EXTRACTION RITUAL
        </h2>
        <p className="text-[#bfb09f] text-base mt-3 font-light">
          Calibrate your brew ratio and follow step-by-step pulse timers for optimal extraction yield.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Method Picker & Ratio Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Method Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {BREW_GUIDES.map((g, i) => (
              <button
                key={g.method}
                onClick={() => {
                  soundscape.playClick(800);
                  setSelectedMethod(i);
                  resetTimer();
                }}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedMethod === i
                    ? 'bg-[#241a13] border-[#e09f67] text-[#f5f0eb] shadow-xl shadow-[#e09f67]/10'
                    : 'bg-[#140e0b] border-[#291e16] text-[#8e8174] hover:border-[#443224]'
                }`}
                data-cursor="SELECT"
              >
                <span className="text-xs font-mono font-bold block uppercase text-[#e09f67] mb-1">
                  0{i + 1}
                </span>
                <span className="text-sm font-serif font-bold block text-[#f5f0eb]">
                  {g.method}
                </span>
                <span className="text-[10px] text-[#7d7063] font-mono block mt-1">
                  Ratio {g.ratio}
                </span>
              </button>
            ))}
          </div>

          {/* Dose Slider & Computed Parameters */}
          <div className="p-6 rounded-3xl bg-[#17110d] border border-[#33251a] space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-3">
                <span className="text-[#f5f0eb] uppercase font-bold tracking-wider">
                  Coffee Dry Dose
                </span>
                <span className="text-xl font-serif font-bold text-[#e09f67]">
                  {dose} grams
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="45"
                step="1"
                value={dose}
                onChange={(e) => {
                  soundscape.playClick(600);
                  setDose(Number(e.target.value));
                }}
                className="w-full accent-[#e09f67] bg-[#291e16] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6f6256] mt-1.5">
                <span>12g (Solo Cup)</span>
                <span>27g (Atelier Signature)</span>
                <span>45g (Server Pot)</span>
              </div>
            </div>

            {/* Calculated Values Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#201812] border border-[#3c2c1f]">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#a09385] uppercase">
                  <Droplets className="w-3 h-3 text-[#e09f67]" />
                  Water Target
                </div>
                <span className="text-lg font-serif font-bold text-[#f5f0eb] block mt-1">
                  {calculatedWater}g
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#201812] border border-[#3c2c1f]">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#a09385] uppercase">
                  <Sparkles className="w-3 h-3 text-[#e09f67]" />
                  Bloom Water
                </div>
                <span className="text-lg font-serif font-bold text-[#f5f0eb] block mt-1">
                  {bloomWater}g
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#201812] border border-[#3c2c1f]">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#a09385] uppercase">
                  <Thermometer className="w-3 h-3 text-[#e09f67]" />
                  Water Temp
                </div>
                <span className="text-lg font-serif font-bold text-[#f5f0eb] block mt-1">
                  {guide.temp.split('/')[0]}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#201812] border border-[#3c2c1f]">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#a09385] uppercase">
                  <Timer className="w-3 h-3 text-[#e09f67]" />
                  Target Time
                </div>
                <span className="text-lg font-serif font-bold text-[#f5f0eb] block mt-1">
                  {guide.time}
                </span>
              </div>
            </div>

            {/* Extraction Steps Timeline */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8b7e71] block mb-2">
                Pulse Pour Protocol
              </span>
              {guide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1a130f] border border-[#2f2218] flex items-center justify-between text-xs"
                >
                  <span className="font-mono font-bold text-[#e09f67] w-14 shrink-0">
                    {step.time}
                  </span>
                  <span className="text-[#dcd1c4] font-light flex-1 pl-2">
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Brewing Stopwatch */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1f1712] to-[#120d09] border border-[#3e2e21] shadow-2xl space-y-8 text-center sticky top-28 backdrop-blur-xl">
            
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-[#8f8275] uppercase">
                ACTIVE BREW CLOCK
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#f5f0eb]">
                {guide.method}
              </h3>
            </div>

            {/* Big Stopwatch Display */}
            <div className="relative py-8">
              <div className="w-56 h-56 rounded-full mx-auto border-4 border-[#2b1f16] flex flex-col items-center justify-center relative shadow-inner">
                {timerRunning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-t-4 border-[#e09f67]"
                  />
                )}
                <span className="text-5xl font-mono font-bold text-[#f5f0eb] tracking-tight">
                  {formatTime(seconds)}
                </span>
                <span className="text-[11px] font-mono text-[#e09f67] mt-1 uppercase tracking-widest">
                  {seconds < 30 ? 'BLOOM PHASE' : seconds < 130 ? 'POUR PHASE' : 'DRAWDOWN'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`px-8 py-4 rounded-full font-bold text-xs font-mono tracking-widest uppercase flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                  timerRunning
                    ? 'bg-[#c85a32] text-white hover:bg-[#b04b26]'
                    : 'bg-gradient-to-r from-[#e09f67] to-[#f3c77c] text-[#0d0a08] hover:scale-105'
                }`}
                data-cursor={timerRunning ? 'PAUSE' : 'START'}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Brew</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-[#1b140f] border border-[#3b2c1f] text-[#a09487] hover:text-[#f5f0eb] hover:border-[#e09f67] transition-all cursor-pointer"
                title="Reset Stopwatch"
                data-cursor="RESET"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#8a7c6f]">
              Audio chimes trigger at each pulse milestone to guide your pour tempo.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
});
