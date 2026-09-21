// High-performance shared motion state with cached metrics and zero layout thrashing.
// Completely decouples 3D/animation loops from React state.

export interface MotionState {
  scrollProgress: number;
  scrollY: number;
  mouseX: number;
  mouseY: number;
  normalizedMouseX: number;
  normalizedMouseY: number;
  isReducedMotion: boolean;
  isMobile: boolean;
  isPaused: boolean;
  tier: 'high' | 'medium' | 'low';
}

class GlobalMotionEngine {
  public state: MotionState = {
    scrollProgress: 0,
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
    normalizedMouseX: 0,
    normalizedMouseY: 0,
    isReducedMotion: false,
    isMobile: false,
    isPaused: false,
    tier: 'high',
  };

  private initialized = false;
  private ticking = false;
  private cachedMaxScroll = 1;
  private cachedWindowWidth = 1920;
  private cachedWindowHeight = 1080;

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Detect capabilities
    const isMobileDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

    let tier: 'high' | 'medium' | 'low' = 'high';
    if (isMobileDevice || cores < 4 || memory < 4) {
      tier = isMobileDevice && (cores < 4 || memory < 3) ? 'low' : 'medium';
    }

    this.state.isMobile = isMobileDevice;
    this.state.isReducedMotion = prefersReducedMotion;
    this.state.tier = tier;

    // Cache layout dimensions to prevent layout thrashing on scroll
    const updateDimensions = () => {
      this.cachedWindowWidth = window.innerWidth || 1920;
      this.cachedWindowHeight = window.innerHeight || 1080;
      const scrollHeight = document.documentElement.scrollHeight || 1000;
      this.cachedMaxScroll = Math.max(1, scrollHeight - this.cachedWindowHeight);
    };

    updateDimensions();

    // Fast compositor-friendly scroll handler (zero DOM layout read)
    const updateScroll = () => {
      const scrollY = window.scrollY;
      this.state.scrollY = scrollY;
      this.state.scrollProgress = Math.min(1, Math.max(0, scrollY / this.cachedMaxScroll));
      this.ticking = false;
    };

    const onScroll = () => {
      if (!this.ticking && !this.state.isPaused) {
        window.requestAnimationFrame(updateScroll);
        this.ticking = true;
      }
    };

    // Passive mouse listener using cached window bounds
    const onMouseMove = (e: MouseEvent) => {
      this.state.mouseX = e.clientX;
      this.state.mouseY = e.clientY;
      this.state.normalizedMouseX = (e.clientX / this.cachedWindowWidth) * 2 - 1;
      this.state.normalizedMouseY = -(e.clientY / this.cachedWindowHeight) * 2 + 1;
    };

    // Pause heavy processing when tab is backgrounded
    const onVisibilityChange = () => {
      this.state.isPaused = document.hidden;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    if (!isMobileDevice) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    updateScroll();
  }

  public getScrollProgress(): number {
    return this.state.scrollProgress;
  }

  public getMouse(): { x: number; y: number } {
    return {
      x: this.state.normalizedMouseX,
      y: this.state.normalizedMouseY,
    };
  }
}

export const motionEngine = new GlobalMotionEngine();
