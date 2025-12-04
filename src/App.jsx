import { useState, useEffect } from "react";
import VoiceRecorder from "./components/VoiceRecorder";
import PanicMeter from "./components/PanicMeter";
import CRTTerminal from "./components/CRTTerminal";
import { calculateCompliance, resetIncidents } from "./lib/gaslight";
import { initializeHorrorUI, horrorController } from "./lib/horrorEffects";

function App() {
  const [result, setResult] = useState(null);
  const [compliance, setCompliance] = useState(100);

  const handleResult = (data) => {
    console.log("Received result:", data); // Debug log
    setResult(data);
    setCompliance(calculateCompliance(data.text, data.hasAudio));
  };

  // Initialize horror UI on mount
  useEffect(() => {
    initializeHorrorUI();
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">WRAITHWEAVE</h1>
        <div className="app-subtitle">HR Behavioral Risk Analysis</div>
      </div>
      
      <PanicMeter compliance={compliance} />
      
      <div className="recorder-section">
        <VoiceRecorder onResult={handleResult} />
        <button 
          className="btn reset-btn" 
          onClick={() => { 
            resetIncidents(); 
            setResult(null); 
            setCompliance(100);
            horrorController.cleanup(); // Clear all horror effects
            if (window.resetVoiceRecorder) window.resetVoiceRecorder(); // Reset recorder state
            console.log("Session reset - all state cleared");
          }}
        >
          Reset Session
        </button>
      </div>
      
      {result && (
        <div className="results">
          <div className="transcript-section">
            <div className="transcript-label">Your Recent Statement:</div>
            <div className="transcript-text">
              {result.text && result.text.trim().length > 3 
                ? `"${result.text}"` 
                : result.hasAudio 
                ? "Audio detected - transcript unavailable."
                : "No measurable emotional output."
              }
            </div>
          </div>
          
          <CRTTerminal text={result.gaslight} isActive={true} />
          
          {result.audioUrl && (
            <div className="audio-section">
              <div className="audio-label">Replay Incident Report:</div>
              <audio controls className="audio-player">
                <source src={result.audioUrl} type="audio/wav" />
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;