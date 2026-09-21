// Procedural Web Audio API soundscape & sensory feedback for ROAST / 27
// Works 100% offline without external audio assets.

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private isMuted = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  public async toggleAmbience(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public startAmbience() {
    this.init();
    if (!this.ctx || this.isPlaying) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink/Brown noise generator for warm roasting crackle & steam hiss
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        // occasional roast pop / crackle
        const pop = Math.random() < 0.0008 ? (Math.random() * 0.6) : 0;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03 + pop;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate warm coffeehouse / roasting room acoustics
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Slow LFO for gentle breath / steam motion
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.14, this.ctx.currentTime + 2.5);

      whiteNoise.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      whiteNoise.start();
      lfo.start();

      this.noiseNode = whiteNoise;
      this.filterNode = filter;
      this.lfoNode = lfo;
      this.gainNode = mainGain;
      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stopAmbience() {
    if (!this.ctx || !this.gainNode) return;
    try {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        if (this.noiseNode && 'stop' in this.noiseNode) {
          (this.noiseNode as AudioBufferSourceNode).stop();
        }
        if (this.lfoNode) {
          this.lfoNode.stop();
        }
        this.isPlaying = false;
      }, 1300);
    } catch {
      this.isPlaying = false;
    }
  }

  // Tactile haptic audio cues
  public playClick(freq = 800, type: OscillatorType = 'sine', duration = 0.05) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio cue ignored
    }
  }

  public playPourChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.05, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {
      // ignored
    }
  }
}

export const soundscape = new SoundscapeEngine();
