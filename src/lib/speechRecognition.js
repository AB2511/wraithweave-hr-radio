// Singleton Speech Recognition Manager
// Prevents double-triggering and ensures clean teardown

let recognition = null;
let isListening = false;

export function createRecognizer() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported");
    return null;
  }

  if (recognition) {
    hardStopRecognition();
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  
  return recognition;
}

export function startRecognition(onResult, onError) {
  if (isListening) {
    console.log("Recognition already active");
    return false;
  }

  if (!recognition) {
    recognition = createRecognizer();
  }

  if (!recognition) return false;

  isListening = true;

  recognition.onstart = () => {
    console.log("Speech recognition started");
  };

  recognition.onresult = onResult;

  recognition.onerror = (event) => {
    console.log("Speech recognition error:", event.error);
    if (onError) onError(event);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended");
    isListening = false;
  };

  try {
    recognition.start();
    return true;
  } catch (error) {
    console.log("Failed to start recognition:", error);
    isListening = false;
    return false;
  }
}

export function hardStopRecognition() {
  if (!recognition) return;

  console.log("Hard stopping recognition");
  
  // Clear all event handlers
  recognition.onresult = null;
  recognition.onend = null;
  recognition.onerror = null;
  recognition.onstart = null;

  // Force stop
  try {
    recognition.stop();
  } catch (e) {
    // Already stopped
  }

  try {
    recognition.abort();
  } catch (e) {
    // Already aborted
  }

  // Destroy instance
  recognition = null;
  isListening = false;
}

export function isRecognitionActive() {
  return isListening;
}

// Test helper function to reset module state
export function resetForTesting() {
  if (recognition) {
    try {
      recognition.stop();
      recognition.abort();
    } catch (e) {
      // Ignore errors during cleanup
    }
  }
  recognition = null;
  isListening = false;
}