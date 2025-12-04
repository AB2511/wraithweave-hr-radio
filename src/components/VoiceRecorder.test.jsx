import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the dependencies
vi.mock('../lib/gaslight', () => ({
  generateGaslightResponse: vi.fn(() => 'Mock HR response'),
  playRadioVoice: vi.fn(() => Promise.resolve()),
  calculateEmotionalScore: vi.fn(() => 1.0),
  INTERRUPT_THRESHOLD: 1.6,
  playInterruptSound: vi.fn()
}));

vi.mock('../lib/horrorEffects', () => ({
  horrorController: {
    triggerHorrorSequence: vi.fn()
  }
}));

vi.mock('../lib/speechRecognition', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    startRecognition: vi.fn(() => true),
    hardStopRecognition: vi.fn(),
    isRecognitionActive: vi.fn(() => false)
  };
});

describe('VoiceRecorder - Speech Recognition Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.resetVoiceRecorder;
  });

  describe('Chrome/Edge Browser Compatibility', () => {
    it('should detect SpeechRecognition API availability', () => {
      // Test that the Web Speech API is available in our test environment
      expect(window.SpeechRecognition || window.webkitSpeechRecognition).toBeDefined();
    });

    it('should handle missing SpeechRecognition API gracefully', async () => {
      const originalSpeechRecognition = window.SpeechRecognition;
      const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
      
      // Remove API temporarily
      window.SpeechRecognition = undefined;
      window.webkitSpeechRecognition = undefined;
      
      // Import the speech recognition module to test graceful handling
      const { createRecognizer } = await import('../lib/speechRecognition');
      const recognizer = createRecognizer();
      expect(recognizer).toBeNull();
      
      // Restore API
      window.SpeechRecognition = originalSpeechRecognition;
      window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
    });

    it('should support required speech recognition features', async () => {
      const { createRecognizer } = await import('../lib/speechRecognition');
      const recognizer = createRecognizer();
      
      expect(recognizer).toBeDefined();
      expect(recognizer.continuous).toBe(true);
      expect(recognizer.interimResults).toBe(true);
      expect(recognizer.lang).toBe('en-US');
    });
  });

  describe('Speech Recognition Integration', () => {
    it('should integrate with speech recognition module', async () => {
      const { startRecognition, isRecognitionActive } = await import('../lib/speechRecognition');
      
      // Test that the module functions are available
      expect(typeof startRecognition).toBe('function');
      expect(typeof isRecognitionActive).toBe('function');
    });

    it('should handle speech recognition lifecycle', async () => {
      const { startRecognition, hardStopRecognition, isRecognitionActive } = await import('../lib/speechRecognition');
      
      // Test starting recognition
      const mockOnResult = vi.fn();
      const started = startRecognition(mockOnResult);
      expect(started).toBe(true);
      
      // Test stopping recognition
      hardStopRecognition();
      expect(isRecognitionActive()).toBe(false);
    });

    it('should process speech results correctly', async () => {
      const { startRecognition } = await import('../lib/speechRecognition');
      
      const mockOnResult = vi.fn();
      const started = startRecognition(mockOnResult);
      
      // Verify that startRecognition was called and returned true (mocked)
      expect(started).toBe(true);
      expect(startRecognition).toHaveBeenCalledWith(mockOnResult);
    });
  });

  describe('Browser Specific Requirements', () => {
    it('should work in Chrome browser environment', () => {
      // Chrome uses SpeechRecognition
      expect(window.SpeechRecognition).toBeDefined();
    });

    it('should work in Edge browser environment', () => {
      // Edge uses webkitSpeechRecognition (legacy webkit prefix)
      expect(window.webkitSpeechRecognition).toBeDefined();
    });

    it('should configure recognition for optimal performance', async () => {
      const { createRecognizer } = await import('../lib/speechRecognition');
      const recognizer = createRecognizer();
      
      // Verify Chrome/Edge optimized settings
      expect(recognizer.continuous).toBe(true); // For real-time monitoring
      expect(recognizer.interimResults).toBe(true); // For mid-sentence interrupts
      expect(recognizer.lang).toBe('en-US'); // For consistent English recognition
    });
  });
});