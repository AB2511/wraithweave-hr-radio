// Horror Effects Controller - Precise Timing Choreography

export class HorrorController {
  constructor() {
    this.isActive = false;
    this.timeouts = [];
  }

  // Main horror sequence with precise timing
  async triggerHorrorSequence(escalationLevel = 3) {
    if (this.isActive) return;
    
    this.isActive = true;
    this.clearAllTimeouts();

    const body = document.body;
    const app = document.querySelector('.app');

    try {
      // Stage 1: UI Freeze (0ms)
      body.classList.add('horror-freeze');
      
      // Stage 2: Micro-glitch burst (40ms)
      this.addTimeout(() => {
        app?.classList.add('horror-micro-glitch');
      }, 40);

      // Stage 3: Audio crackle injection (120ms)
      this.addTimeout(() => {
        this.playAudioCrackle();
        app?.classList.add('horror-audio-crackle');
      }, 120);

      // Stage 4: CRT distortion wave (180ms)
      this.addTimeout(() => {
        app?.classList.add('horror-crt-wave');
      }, 180);

      // Stage 5: UI tint shift (260ms)
      this.addTimeout(() => {
        body.classList.add('horror-red-tint');
      }, 260);

      // Stage 6: Text smear + chromatic aberration (400ms)
      this.addTimeout(() => {
        const textElements = document.querySelectorAll('.crt-text, .transcript-text, .panic-header');
        textElements.forEach(el => el.classList.add('horror-text-smear'));
      }, 400);

      // Stage 7: Full-screen glitch overlay (620ms)
      this.addTimeout(() => {
        this.createGlitchOverlay();
      }, 620);

      // Stage 8: HR message render with jitter (900ms)
      this.addTimeout(() => {
        const terminal = document.querySelector('.crt-terminal');
        terminal?.classList.add('horror-message-jitter');
        
        // Enhanced panic meter for high escalation
        if (escalationLevel >= 4) {
          const panicMeter = document.querySelector('.panic-meter');
          panicMeter?.classList.add('horror-active');
        }
      }, 900);

      // Stage 9: Freeze release with frame skip (1200ms)
      this.addTimeout(() => {
        body.classList.remove('horror-freeze');
        app?.classList.add('horror-frame-skip');
        
        // Optional extended horror mode for max escalation
        if (escalationLevel >= 5) {
          this.addTimeout(() => {
            this.playVoiceEcho("Please don't raise your voice again.");
          }, 900); // +2100ms total
        }
      }, 1200);

      // Cleanup (1500ms)
      this.addTimeout(() => {
        this.cleanup();
      }, 1500);

    } catch (error) {
      console.log("Horror effects unavailable:", error);
      this.cleanup();
    }
  }

  // Audio effects
  playAudioCrackle() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Short crackle burst
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        const envelope = Math.exp(-i / (audioCtx.sampleRate * 0.05));
        data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
      
      setTimeout(() => audioCtx.close(), 300);
    } catch (error) {
      console.log("Audio crackle unavailable");
    }
  }

  playVoiceEcho(text) {
    if (!window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.7;
    utterance.pitch = 0.6;
    utterance.volume = 0.4;
    
    // Add echo effect by playing slightly delayed
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 100);
  }

  // Visual effects
  createGlitchOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'horror-glitch-overlay';
    overlay.id = 'horror-overlay';
    document.body.appendChild(overlay);
    
    // Auto-remove after animation
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }



  // Utility methods
  addTimeout(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    this.timeouts.push(timeoutId);
  }

  clearAllTimeouts() {
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];
  }

  cleanup() {
    this.isActive = false;
    this.clearAllTimeouts();
    
    const body = document.body;
    const app = document.querySelector('.app');
    
    // Remove all horror classes
    body.classList.remove('horror-freeze', 'horror-red-tint');
    app?.classList.remove(
      'horror-micro-glitch',
      'horror-crt-wave', 
      'horror-audio-crackle',
      'horror-frame-skip'
    );
    
    // Clean up text effects
    const textElements = document.querySelectorAll('.horror-text-smear');
    textElements.forEach(el => el.classList.remove('horror-text-smear'));
    
    // Clean up terminal effects
    const terminal = document.querySelector('.crt-terminal');
    terminal?.classList.remove('horror-message-jitter');
    
    // Clean up panic meter
    const panicMeter = document.querySelector('.panic-meter');
    panicMeter?.classList.remove('horror-active');
    
    // Remove any remaining overlays
    const overlay = document.getElementById('horror-overlay');
    overlay?.remove();
  }
}

// Global horror controller instance
export const horrorController = new HorrorController();

// Initialize horror UI
export function initializeHorrorUI() {
  // Create accessibility warning
  const warning = document.createElement('div');
  warning.className = 'horror-warning';
  warning.innerHTML = '⚠️ Audio shock effects active. Not suitable for those sensitive to sudden sounds.';
  document.body.appendChild(warning);
  
  // Enhanced CRT effects for main app
  const app = document.querySelector('.app');
  app?.classList.add('horror-crt-enhanced');
}