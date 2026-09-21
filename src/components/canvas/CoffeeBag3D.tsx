'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PRODUCTS } from '@/data/coffeeData';
import { motionEngine } from '@/lib/motionState';
import { CoffeeProduct } from '@/types/coffee';

interface CoffeeBag3DProps {
  productIndex: number;
}

// Global cache for bag textures to eliminate GC spikes and repeated canvas drawing
const textureCache = new Map<string, THREE.CanvasTexture>();

function generateBagTexture(product: CoffeeProduct): THREE.CanvasTexture | null {
  const cacheKey = product.id;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  const canvas = window.document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  // Background matte dark tone
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1400);
  bgGrad.addColorStop(0, '#1c1714');
  bgGrad.addColorStop(0.5, '#120f0d');
  bgGrad.addColorStop(1, '#0b0908');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1400);

  // Subtle grain texture overlay (optimized sample count)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 2500; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1400;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }

  // Border luxury hairline
  ctx.strokeStyle = product.foilColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, 904, 1280);

  // Inner foil frame
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(75, 75, 874, 1250);

  // Brand Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a6998c';
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('EST. 2027 • SPECIALTY ATELIER', 512, 160);

  // Main Brand Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 88px "Cinzel", "Playfair Display", serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('ROAST / 27', 512, 280);

  // Copper divider rule
  const ruleGrad = ctx.createLinearGradient(200, 320, 824, 320);
  ruleGrad.addColorStop(0, 'rgba(224, 159, 103, 0)');
  ruleGrad.addColorStop(0.5, product.foilColor);
  ruleGrad.addColorStop(1, 'rgba(224, 159, 103, 0)');
  ctx.fillStyle = ruleGrad;
  ctx.fillRect(200, 330, 624, 3);

  // Product Title Badge
  ctx.fillStyle = product.primaryColor;
  ctx.font = 'bold 96px "Cinzel", "Playfair Display", serif';
  ctx.letterSpacing = '12px';
  ctx.fillText(product.name, 512, 470);

  // Subtitle
  ctx.fillStyle = '#d5c4b1';
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText(product.subtitle, 512, 530);

  // Origin Coordinates
  ctx.fillStyle = '#f0ebe4';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`${product.origin.toUpperCase()} — ${product.elevation}`, 512, 630);

  ctx.fillStyle = '#a09487';
  ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${product.region} • ${product.varietal}`, 512, 680);
  ctx.fillText(`Process: ${product.process}`, 512, 720);

  // Tasting Notes Block (Foil stamped card)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.roundRect(140, 770, 744, 230, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(224, 159, 103, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.roundRect(140, 770, 744, 230, 16);
  ctx.stroke();

  ctx.fillStyle = product.foilColor;
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('TASTING PROFILE & SENSORY VOLATILES', 512, 825);

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  const notesStr = product.tastingNotes.join('  •  ');
  ctx.fillText(notesStr, 512, 885);

  ctx.fillStyle = '#9e9184';
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(product.roastProfile, 512, 945);

  // Bottom Seal & Net Wt
  ctx.fillStyle = '#7a6f65';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(`MICRO-BATCH ${product.batchNumber}  |  NET WT 250G / 8.8 OZ`, 512, 1140);
  ctx.fillText('WHOLE BEAN SPECIALTY ROAST', 512, 1180);

  // Gold Wax Stamp Emblem
  ctx.beginPath();
  ctx.arc(512, 1265, 34, 0, Math.PI * 2);
  ctx.fillStyle = product.foilColor;
  ctx.fill();
  ctx.fillStyle = '#1c1510';
  ctx.font = 'bold 20px "Cinzel", serif';
  ctx.fillText('27', 512, 1272);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;

  textureCache.set(cacheKey, tex);
  return tex;
}

export function CoffeeBag3D({ productIndex }: CoffeeBag3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bagMeshRef = useRef<THREE.Mesh>(null);
  const currentProduct = PRODUCTS[productIndex] || PRODUCTS[0];

  // Texture from memory cache
  const activeTexture = useMemo(() => {
    return generateBagTexture(currentProduct);
  }, [currentProduct]);

  // Procedural 3D Coffee Bag Geometry with gusset profile & seal crimps
  const { bagGeometry, crimpGeometry } = useMemo(() => {
    const width = 2.4;
    const height = 3.6;
    const depth = 1.3;
    const radius = 0.22;

    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings = {
      steps: 8,
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.12,
      bevelOffset: 0,
      bevelSegments: 6,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    // Deform vertices for realistic pouch bulge & bottom flat gusset
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const vx = pos.getX(i);

      const bulge = Math.cos((vy / height) * Math.PI * 0.9) * 0.16;
      if (vz > 0) {
        pos.setZ(i, vz + bulge);
      } else {
        pos.setZ(i, vz - bulge);
      }

      if (vy > height * 0.3) {
        const factor = 1 - (vy - height * 0.3) / (height * 0.25);
        pos.setZ(i, pos.getZ(i) * Math.max(0.4, factor));
      }

      if (Math.abs(vx) > width * 0.38 && Math.abs(vy) < height * 0.35) {
        pos.setX(i, vx * 0.94);
      }
    }
    geom.computeVertexNormals();

    const crimpGeom = new THREE.BoxGeometry(width * 1.04, 0.32, 0.18, 16, 1, 1);
    crimpGeom.translate(0, height / 2 + 0.12, 0);

    return { bagGeometry: geom, crimpGeometry: crimpGeom };
  }, []);

  // Cleanup geometries on unmount
  useEffect(() => {
    return () => {
      bagGeometry.dispose();
      crimpGeometry.dispose();
    };
  }, [bagGeometry, crimpGeometry]);

  // Read scroll & mouse directly in animation loop with tab pause check
  useFrame((state, delta) => {
    if (!groupRef.current || motionEngine.state.isPaused) return;

    const scrollProgress = motionEngine.state.scrollProgress;
    const mouse = motionEngine.getMouse();
    const isReduced = motionEngine.state.isReducedMotion;

    const time = state.clock.getElapsedTime();
    const speedFactor = isReduced ? 0.3 : 1.0;
    const floatY = Math.sin(time * 1.2 * speedFactor) * 0.07;
    const floatRotZ = Math.sin(time * 0.8 * speedFactor) * 0.02;

    const targetRotY = scrollProgress * Math.PI * 2.8 + mouse.x * 0.4;
    const targetRotX = mouse.y * 0.3 + Math.sin(scrollProgress * Math.PI) * 0.18;
    const targetPosX = Math.sin(scrollProgress * Math.PI * 2) * 1.1 + mouse.x * 0.25;
    const targetPosY = floatY - scrollProgress * 0.4;
    const targetPosZ = Math.cos(scrollProgress * Math.PI * 1.5) * 0.55;

    const dampSpeed = isReduced ? 2.5 : 4.0;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, dampSpeed, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, dampSpeed, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, floatRotZ, dampSpeed, delta);

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 3.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 3.5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 3.5, delta);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Coffee Pouch Body */}
      <mesh ref={bagMeshRef} geometry={bagGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={currentProduct.bagColor}
          roughness={0.42}
          metalness={0.12}
          clearcoat={0.18}
          clearcoatRoughness={0.25}
          reflectivity={0.6}
        />
      </mesh>

      {/* Front Label Plane with Dynamic High-Resolution Typography */}
      {activeTexture && (
        <mesh position={[0, -0.04, 0.78]} receiveShadow>
          <planeGeometry args={[2.05, 2.95]} />
          <meshBasicMaterial
            map={activeTexture}
            transparent={true}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Top Heat-Seal Crimp Bar */}
      <mesh geometry={crimpGeometry} castShadow>
        <meshStandardMaterial
          color={currentProduct.labelColor}
          roughness={0.3}
          metalness={0.65}
        />
      </mesh>

      {/* Copper Foil Valve Accent */}
      <mesh position={[0.55, 0.95, 0.79]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 18]} />
        <meshStandardMaterial
          color={currentProduct.foilColor}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.55, 0.95, 0.81]}>
        <ringGeometry args={[0.04, 0.08, 14]} />
        <meshBasicMaterial color="#1a120c" />
      </mesh>

      {/* Subtle Glow Ring behind bag */}
      <pointLight
        position={[0, 0, -0.8]}
        intensity={1.6}
        color={currentProduct.accentColor}
        distance={4.0}
      />
    </group>
  );
}
