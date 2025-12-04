// Mock Web Speech API for testing
class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = 'en-US';
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
  }

  start() {
    setTimeout(() => {
      if (this.onstart) this.onstart();
    }, 10);
  }

  stop() {
    setTimeout(() => {
      if (this.onend) this.onend();
    }, 10);
  }

  abort() {
    setTimeout(() => {
      if (this.onend) this.onend();
    }, 10);
  }

  // Helper method to simulate speech results
  simulateResult(transcript, isFinal = true) {
    if (this.onresult) {
      const mockEvent = {
        results: [{
          0: { transcript },
          isFinal,
          length: 1
        }],
        resultIndex: 0
      };
      this.onresult(mockEvent);
    }
  }
}

// Mock the global SpeechRecognition
global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;

// Mock navigator.mediaDevices for audio recording
global.navigator = {
  ...global.navigator,
  mediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [],
      getAudioTracks: () => [],
      getVideoTracks: () => []
    })
  }
};

// Mock MediaRecorder
global.MediaRecorder = class MockMediaRecorder {
  constructor(stream) {
    this.stream = stream;
    this.state = 'inactive';
    this.ondataavailable = null;
    this.onstop = null;
  }

  start() {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
    if (this.onstop) this.onstop();
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Setup React Testing Library
import '@testing-library/jest-dom';