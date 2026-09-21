'use client';

import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CoffeeBag3D } from './CoffeeBag3D';
import { FloatingBeans } from './FloatingBeans';
import { AtmosphereEffects } from './AtmosphereEffects';
import { getDeviceQualityConfig, QualityConfig } from '@/lib/deviceTier';
import { motionEngine } from '@/lib/motionState';

interface CoffeeExperienceCanvasProps {
  productIndex: number;
}

export function CoffeeExperienceCanvas({
  productIndex,
}: CoffeeExperienceCanvasProps) {
  const [config, setConfig] = useState<QualityConfig | null>(null);

  useEffect(() => {
    motionEngine.init();
    setConfig(getDeviceQualityConfig());
  }, []);

  if (!config) {
    // Initial loading placeholder (non-blocking, matches aesthetic)
    return (
      <div className="w-full h-full bg-[#0d0a08] flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-[#e09f67]/5 blur-3xl" />
      </div>
    );
  }

  // Graceful fallback for non-WebGL devices
  if (!config.isSupported) {
    return (
      <div className="w-full h-full bg-[#0d0a08] flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-[#c85a32]/15 via-[#e09f67]/10 to-transparent blur-3xl" />
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={config.dpr}
        gl={{
          antialias: config.enableAntialias,
          alpha: true,
          powerPreference: config.powerPreference,
        }}
        shadows={config.shadowMapSize > 256}
      >
        <Suspense fallback={null}>
          <CoffeeBag3D productIndex={productIndex} />
          <FloatingBeans count={config.beanCount} />
          <AtmosphereEffects
            dustCount={config.dustCount}
            steamCount={config.steamCount}
            shadowMapSize={config.shadowMapSize}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
