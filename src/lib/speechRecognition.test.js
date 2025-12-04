import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  createRecognizer, 
  startRecognition, 
  hardStopRecognition, 
  isRecognitionActive,
  resetForTesting
} from './speechRecognition.js';

describe('Speech Recognition - Chrome/Edge Compatibility', () => {
  beforeEach(() => {
    // Reset the module state before each test
    resetForTesting();
  });

  describe('Browser Compatibility', () => {
    it('should detect SpeechRecognition API availability', () => {
      // Test that the API is available (mocked in our test environment)
      expect(window.SpeechRecognition || window.webkitSpeechRecognition).toBeDefined();
    });

    it('should create a recognizer with correct configuration', () => {
      const recognizer = createRecognizer();
      
      expect(recognizer).toBeDefined();
      expect(recognizer.continuous).toBe(true);
      expect(recognizer.interimResults).toBe(true);
      expect(recognizer.lang).toBe('en-US');
    });

    it('should handle missing SpeechRecognition API gracefully', () => {
      // Temporarily remove the API
      const originalSpeechRecognition = window.SpeechRecognition;
      const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
      
      window.SpeechRecognition = undefined;
      window.webkitSpeechRecognition = undefined;
      
      const recognizer = createRecognizer();
      expect(recognizer).toBeNull();
      
      // Restore the API
      window.SpeechRecognition = originalSpeechRecognition;
      window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
    });
  });

  describe('Recognition Lifecycle', () => {
    it('should start recognition successfully', () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      
      const started = startRecognition(onResult, onError);
      
      expect(started).toBe(true);
      expect(isRecognitionActive()).toBe(true);
    });

    it('should prevent multiple simultaneous recognition sessions', () => {
      const onResult1 = vi.fn();
      const onResult2 = vi.fn();
      
      // Start first recognition
      const started1 = startRecognition(onResult1);
      expect(started1).toBe(true);
      expect(isRecognitionActive()).toBe(true);
      
      // Try to start second recognition
      const started2 = startRecognition(onResult2);
      expect(started2).toBe(false);
      expect(isRecognitionActive()).toBe(true);
    });

    it('should stop recognition cleanly', () => {
      const onResult = vi.fn();
      
      startRecognition(onResult);
      expect(isRecognitionActive()).toBe(true);
      
      hardStopRecognition();
      expect(isRecognitionActive()).toBe(false);
    });
  });

  describe('Speech Processing', () => {
    it('should handle speech results correctly', async () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      
      // Create recognizer first to get access to the instance
      const recognizer = createRecognizer();
      
      // Start recognition
      startRecognition(onResult, onError);
      
      // Manually trigger the onresult callback
      const mockEvent = {
        results: [{
          0: { transcript: "I am worried about my job" },
          isFinal: true,
          length: 1
        }],
        resultIndex: 0
      };
      
      // Directly call the onresult handler
      if (recognizer.onresult) {
        recognizer.onresult(mockEvent);
      }
      
      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(onResult).toHaveBeenCalled();
    });

    it('should handle recognition errors gracefully', async () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      
      // Create recognizer first to get access to the instance
      const recognizer = createRecognizer();
      
      // Start recognition
      startRecognition(onResult, onError);
      
      // Manually trigger the onerror callback
      if (recognizer.onerror) {
        recognizer.onerror({ error: 'network' });
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(onError).toHaveBeenCalledWith({ error: 'network' });
    });
  });

  describe('Chrome/Edge Specific Features', () => {
    it('should support continuous recognition', () => {
      const recognizer = createRecognizer();
      expect(recognizer.continuous).toBe(true);
    });

    it('should support interim results', () => {
      const recognizer = createRecognizer();
      expect(recognizer.interimResults).toBe(true);
    });

    it('should use English US language setting', () => {
      const recognizer = createRecognizer();
      expect(recognizer.lang).toBe('en-US');
    });
  });

  describe('Real-time Processing Requirements', () => {
    it('should process speech in real-time with interim results', async () => {
      const onResult = vi.fn();
      
      // Create recognizer first to get access to the instance
      const recognizer = createRecognizer();
      
      // Start recognition
      startRecognition(onResult);
      
      // Simulate interim result (partial speech)
      const interimEvent = {
        results: [{
          0: { transcript: "I am worried" },
          isFinal: false,
          length: 1
        }],
        resultIndex: 0
      };
      
      if (recognizer.onresult) {
        recognizer.onresult(interimEvent);
      }
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Simulate final result
      const finalEvent = {
        results: [{
          0: { transcript: "I am worried about my job" },
          isFinal: true,
          length: 1
        }],
        resultIndex: 0
      };
      
      if (recognizer.onresult) {
        recognizer.onresult(finalEvent);
      }
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(onResult).toHaveBeenCalledTimes(2);
    });

    it('should maintain recognition state correctly during processing', () => {
      expect(isRecognitionActive()).toBe(false);
      
      startRecognition(vi.fn());
      expect(isRecognitionActive()).toBe(true);
      
      hardStopRecognition();
      expect(isRecognitionActive()).toBe(false);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from start failures', () => {
      // Mock the SpeechRecognition constructor to throw an error
      const originalSpeechRecognition = window.SpeechRecognition;
      const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
      
      window.SpeechRecognition = class {
        constructor() {
          this.continuous = true;
          this.interimResults = true;
          this.lang = 'en-US';
          this.onstart = null;
          this.onresult = null;
          this.onerror = null;
          this.onend = null;
        }
        
        start() {
          throw new Error('Permission denied');
        }
        
        stop() {}
        abort() {}
      };
      
      window.webkitSpeechRecognition = window.SpeechRecognition;
      
      const started = startRecognition(vi.fn());
      
      // Should handle the error gracefully
      expect(started).toBe(false);
      expect(isRecognitionActive()).toBe(false);
      
      // Restore original
      window.SpeechRecognition = originalSpeechRecognition;
      window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
    });

    it('should clean up properly on hard stop', () => {
      const recognizer = createRecognizer();
      startRecognition(vi.fn());
      
      // Verify cleanup removes all handlers
      hardStopRecognition();
      
      expect(isRecognitionActive()).toBe(false);
    });
  });
});