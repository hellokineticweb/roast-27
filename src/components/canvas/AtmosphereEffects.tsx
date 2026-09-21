'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionEngine } from '@/lib/motionState';

interface AtmosphereEffectsProps {
  dustCount?: number;
  steamCount?: number;
  shadowMapSize?: number;
}

export function AtmosphereEffects({
  dustCount = 100,
  steamCount = 45,
  shadowMapSize = 1024,
}: AtmosphereEffectsProps) {
  const dustRef = useRef<THREE.Points>(null);
  const steamRef = useRef<THREE.Points>(null);

  // Warm Amber / Golden Dust Motes
  const dustParticles = useMemo(() => {
    const count = dustCount;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = Math.random() * 0.25 + 0.1;
    }

    return { positions, speeds, count };
  }, [dustCount]);

  // Rising Coffee Steam / Aroma Particles
  const steamParticles = useMemo(() => {
    const count = steamCount;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = -2.8 + Math.random() * 5.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    return { positions, count };
  }, [steamCount]);

  useFrame((state, delta) => {
    if (motionEngine.state.isPaused) return;

    const time = state.clock.getElapsedTime();
    const isReduced = motionEngine.state.isReducedMotion;
    const timeMultiplier = isReduced ? 0.3 : 1.0;

    // Animate dust motes gently floating
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustParticles.count; i++) {
        let y = pos.getY(i);
        let x = pos.getX(i);
        const speed = dustParticles.speeds[i];

        y += Math.sin(time * speed * timeMultiplier + i) * 0.003 - delta * 0.035 * timeMultiplier;
        x += Math.cos(time * speed * 0.5 * timeMultiplier + i) * 0.002;

        if (y < -7) y = 7;
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }

    // Animate rising steam
    if (steamRef.current) {
      const pos = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < steamParticles.count; i++) {
        let y = pos.getY(i);
        let x = pos.getX(i);
        let z = pos.getZ(i);

        y += delta * (0.55 + Math.sin(i) * 0.15) * timeMultiplier;
        x += Math.sin(time * 0.7 * timeMultiplier + y * 1.2) * 0.0035;
        z += Math.cos(time * 0.6 * timeMultiplier + y * 1.1) * 0.0035;

        if (y > 3.5) {
          y = -2.8;
          x = (Math.random() - 0.5) * 1.2;
          z = (Math.random() - 0.5) * 1.2;
        }

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Cinematic Lighting System */}
      <ambientLight intensity={0.45} color="#d6cfc7" />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[4.5, 6.5, 4.5]}
        intensity={1.8}
        color="#fff5ea"
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />

      {/* Warm Copper / Amber Rim Light */}
      <pointLight
        position={[-4.5, 2.0, -3.0]}
        intensity={3.0}
        color="#e09156"
        distance={14}
      />

      {/* Soft Under-Glow Bounce Light */}
      <spotLight
        position={[0, -5, 2]}
        intensity={1.1}
        color="#cf7a48"
        angle={0.6}
        penumbra={0.9}
      />

      {/* Ambient Fog for Depth */}
      <fog attach="fog" args={['#0c0a09', 5.5, 18]} />

      {/* Dust Particles */}
      {dustParticles.count > 0 && (
        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[dustParticles.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.055}
            color="#f3c77c"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Steam / Aroma Particles */}
      {steamParticles.count > 0 && (
        <points ref={steamRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[steamParticles.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            color="#d9cbb8"
            transparent
            opacity={0.18}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </points>
      )}
    </>
  );
}
