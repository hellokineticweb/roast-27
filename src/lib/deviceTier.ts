// Device tier & WebGL capability detection for adaptive 3D performance

export interface QualityConfig {
  dpr: [number, number];
  shadowMapSize: number;
  dustCount: number;
  steamCount: number;
  beanCount: number;
  enableAntialias: boolean;
  powerPreference: 'high-performance' | 'default' | 'low-power';
  isSupported: boolean;
}

export function getDeviceQualityConfig(): QualityConfig {
  if (typeof window === 'undefined') {
    return {
      dpr: [1, 1.5],
      shadowMapSize: 1024,
      dustCount: 120,
      steamCount: 50,
      beanCount: 28,
      enableAntialias: true,
      powerPreference: 'high-performance',
      isSupported: true,
    };
  }

  // Check WebGL availability
  let isWebGLSupported = false;
  try {
    const testCanvas = document.createElement('canvas');
    isWebGLSupported = !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || (testCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null))
    );
  } catch {
    isWebGLSupported = false;
  }

  const isMobile =
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isWebGLSupported) {
    return {
      dpr: [1, 1],
      shadowMapSize: 256,
      dustCount: 0,
      steamCount: 0,
      beanCount: 0,
      enableAntialias: false,
      powerPreference: 'low-power',
      isSupported: false,
    };
  }

  if (isReducedMotion) {
    return {
      dpr: [1, 1.25],
      shadowMapSize: 512,
      dustCount: 30,
      steamCount: 15,
      beanCount: 12,
      enableAntialias: true,
      powerPreference: 'default',
      isSupported: true,
    };
  }

  if (isMobile || cores <= 4 || memory < 4) {
    // Mobile / mid-range device tier
    return {
      dpr: [1, 1.25],
      shadowMapSize: 512,
      dustCount: 45,
      steamCount: 25,
      beanCount: 18,
      enableAntialias: true,
      powerPreference: 'default',
      isSupported: true,
    };
  }

  // Desktop / High-performance tier
  return {
    dpr: [1, 1.75],
    shadowMapSize: 1024,
    dustCount: 120,
    steamCount: 50,
    beanCount: 28,
    enableAntialias: true,
    powerPreference: 'high-performance',
    isSupported: true,
  };
}
