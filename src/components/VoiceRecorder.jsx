import { useState, useRef } from "react";
import { generateGaslightResponse, playRadioVoice, calculateEmotionalScore, INTERRUPT_THRESHOLD, playInterruptSound } from "../lib/gaslight";
import { horrorController } from "../lib/horrorEffects";
import { startRecognition, hardStopRecognition, isRecognitionActive } from "../lib/speechRecognition";

export default function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const finalTranscriptRef = useRef("");
  const interruptedRef = useRef(false);

  // Reset method for clean state
  const resetRecorder = () => {
    console.log("Resetting VoiceRecorder state");
    hardStopRecognition();
    setRecording(false);
    setProcessing(false);
    finalTranscriptRef.current = "";
    interruptedRef.current = false;
    audioChunksRef.current = [];
  };

  // Expose reset method globally for App component
  window.resetVoiceRecorder = resetRecorder;

  const triggerInterruptCut = async (partialTranscript) => {
    if (interruptedRef.current) return; // Prevent double-trigger
    interruptedRef.current = true;
    
    console.log("Triggering interrupt! Transcript:", partialTranscript);
    
    // HARD STOP everything immediately
    hardStopRecognition();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setRecording(false);
    setProcessing(true);
    
    // Generate response and determine escalation level  
    const gaslightText = generateGaslightResponse(partialTranscript, true);
    const score = calculateEmotionalScore(partialTranscript);
    const escalationLevel = score >= 2.5 ? 5 : score >= 2.0 ? 4 : 3;
    
    // Trigger coordinated horror sequence
    horrorController.triggerHorrorSequence(escalationLevel);
    
    // Play interrupt sound at precise timing (80ms)
    setTimeout(() => playInterruptSound(), 80);
    
    // Show interrupted transcript after initial freeze (200ms)
    const interruptedText = `${partialTranscript}— —Transmission forcibly terminated by HR.`;
    setTimeout(() => {
      onResult({
        text: interruptedText,
        gaslight: gaslightText,
        audioUrl: null,
        hasAudio: true // User DID speak - we just cut them off
      });
    }, 200);

    // Radio voice takeover at precise timing (1850ms)
    setTimeout(async () => {
      await playRadioVoice(gaslightText);
      setProcessing(false);
    }, 1850);
  };

  const evaluateGaslight = async (text, audioBlob) => {
    if (interruptedRef.current) return; // Don't process if already interrupted
    
    const hasAudio = audioBlob && audioBlob.size > 1000;
    console.log("Final transcript:", text?.trim() || "No transcript");

    setProcessing(true);
    
    const gaslightText = generateGaslightResponse(text, hasAudio);
    
    onResult({
      text: text || "",
      gaslight: gaslightText,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
      hasAudio: hasAudio
    });

    // Play radio voice
    await playRadioVoice(gaslightText);
    setProcessing(false);
  };

  const handleSpeechResult = (event) => {
    if (interruptedRef.current) return;
    
    let interimTranscript = '';
    let finalText = '';
    
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Update live transcript for monitoring
    const currentTranscript = finalTranscriptRef.current + finalText + interimTranscript;
    
    console.log("Speech result:", {
      finalText,
      interimTranscript,
      currentTranscript: currentTranscript.substring(0, 50) + "...",
      isFinal: event.results[event.results.length - 1]?.isFinal
    });
    
    // Check for interrupt threshold during live speech
    const score = calculateEmotionalScore(currentTranscript);
    if (score >= INTERRUPT_THRESHOLD && !interruptedRef.current) {
      triggerInterruptCut(currentTranscript.trim());
      return;
    }
    
    // Store final results normally if no interrupt
    if (finalText) {
      finalTranscriptRef.current += finalText + " ";
    }
  };

  const startRecording = async () => {
    if (isRecognitionActive()) {
      console.log("Recognition already active, stopping first");
      hardStopRecognition();
    }

    setRecording(true);
    audioChunksRef.current = [];
    finalTranscriptRef.current = "";
    interruptedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        if (interruptedRef.current) return;
        
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setTimeout(() => {
          const finalText = finalTranscriptRef.current.trim();
          evaluateGaslight(finalText, audioBlob);
        }, 100);
      };

      mediaRecorderRef.current.start();

      // Start speech recognition with singleton manager
      startRecognition(handleSpeechResult, (error) => {
        console.log("Speech recognition error:", error.error);
      });

    } catch (error) {
      console.log("Failed to start recording:", error);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording");
    setRecording(false);
    
    // Hard stop recognition
    hardStopRecognition();
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {processing ? (
        <button className="btn-processing" disabled>
          📊 Processing Incident...
        </button>
      ) : !recording ? (
        <button className="btn" onClick={startRecording}>
          🎙️ Speak Your Worry
        </button>
      ) : (
        <button className="btn-stop" onClick={stopRecording}>
          🛑 End Transmission
        </button>
      )}
    </div>
  );
}