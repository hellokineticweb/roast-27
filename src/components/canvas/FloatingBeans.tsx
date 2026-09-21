'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionEngine } from '@/lib/motionState';

interface FloatingBeansProps {
  count?: number;
}

interface BeanInstance {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  scale: number;
  rotSpeed: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  initialAngle: number;
  verticalSpeed: number;
}

export function FloatingBeans({ count = 24 }: FloatingBeansProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Procedural single coffee bean geometry with realistic crease
  const beanGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.24, 16, 12);
    geom.scale(1.0, 1.45, 0.68); // coffee bean proportions

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      if (z > 0) {
        const distFromCenter = Math.abs(x);
        const creaseDepth = Math.exp(-distFromCenter * 18.0) * 0.12;
        pos.setZ(i, z * 0.85 - creaseDepth);
      }
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  const beanMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#321c13',
      roughness: 0.48,
      metalness: 0.15,
    });
  }, []);

  useEffect(() => {
    return () => {
      beanGeometry.dispose();
      beanMaterial.dispose();
    };
  }, [beanGeometry, beanMaterial]);

  // Generate random orbital distribution around the coffee bag
  const beans = useMemo<BeanInstance[]>(() => {
    const list: BeanInstance[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 3.8;
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const height = (Math.random() - 0.5) * 6.5;

      list.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 2.0
        ),
        rot: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        scale: 0.75 + Math.random() * 0.55,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 0.6
        ),
        orbitRadius: radius,
        orbitSpeed: (0.12 + Math.random() * 0.22) * (Math.random() > 0.5 ? 1 : -1),
        initialAngle: angle,
        verticalSpeed: 0.15 + Math.random() * 0.25,
      });
    }
    return list;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || motionEngine.state.isPaused) return;
    const time = state.clock.getElapsedTime();
    const scrollProgress = motionEngine.state.scrollProgress;
    const speedFactor = motionEngine.state.isReducedMotion ? 0.3 : 1.0;

    for (let i = 0; i < beans.length; i++) {
      const bean = beans[i];
      const currentAngle = bean.initialAngle + time * bean.orbitSpeed * speedFactor + scrollProgress * 2.2;
      const currentY =
        bean.pos.y +
        Math.sin(time * bean.verticalSpeed * speedFactor + i) * 0.22 -
        scrollProgress * 1.8;

      dummy.position.set(
        Math.cos(currentAngle) * bean.orbitRadius,
        currentY,
        Math.sin(currentAngle) * (bean.orbitRadius * 0.9)
      );

      dummy.rotation.x = bean.rot.x + time * bean.rotSpeed.x * speedFactor;
      dummy.rotation.y = bean.rot.y + time * bean.rotSpeed.y * speedFactor;
      dummy.rotation.z = bean.rot.z + time * bean.rotSpeed.z * speedFactor;

      dummy.scale.setScalar(bean.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[beanGeometry, beanMaterial, count]}
      castShadow
      receiveShadow
    />
  );
}
