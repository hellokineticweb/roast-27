'use client';

import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop mouse)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const hoverable = target?.closest('[data-cursor]');
      if (hoverable) {
        const text = hoverable.getAttribute('data-cursor') || '';
        setIsHovered(true);
        setCursorText(text);
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    // Smooth follower ring interpolation in rAF
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(animateRing);
    };

    const handleMouseLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Outer Follower Ring / Badge (GPU translate3d via rAF) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#e09f67]/60 backdrop-blur-xs flex items-center justify-center text-[10px] font-mono tracking-widest text-[#f5f0eb] uppercase transition-all duration-200 will-change-transform ${
          isHovered
            ? 'w-20 h-20 -ml-10 -mt-10 bg-[#e09f67]/20 scale-105'
            : 'w-9 h-9 -ml-4.5 -mt-4.5 bg-black/5 scale-100'
        }`}
      >
        {cursorText && (
          <span
            ref={textRef}
            className="scale-90 font-medium tracking-wider text-center px-1 text-[9px] text-[#f5f0eb]"
          >
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner Dot (Instant GPU translate3d) */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-[#e09f67] will-change-transform transition-opacity duration-150 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
