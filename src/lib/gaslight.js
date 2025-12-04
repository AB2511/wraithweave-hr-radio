const WEIGHTED_KEYWORDS = {
  career: { weight: 1.5, words: ['job', 'career', 'hired', 'promotion', 'fired', 'work', 'employment', 'workplace', 'boss', 'manager', 'coworker', 'salary', 'paycheck'] },
  
  failure: { weight: 1.35, words: ['fail', 'failed', 'failing', 'broken', 'crash', 'crashed', 'error', 'hopeless', 'wrong', 'disaster', 'losing', 'lost', 'control', 'mess', 'screwed', 'ruined', 'destroyed', 'collapse', 'breakdown'] },
  
  loneliness: { weight: 1.35, words: ['alone', 'lonely', 'nobody', 'friendless', 'isolated', 'abandoned', 'rejected', 'unwanted', 'empty', 'disconnected', 'outcast'] },
  
  stress: { weight: 1.25, words: [
    // Core stress words
    'stress', 'stressed', 'stressing', 'stressful',
    // Anxiety variants
    'anxiety', 'anxious', 'anxiously', 'anxiousness',
    // Panic variants  
    'panic', 'panicked', 'panicking', 'frantic', 'frenzied',
    // Fear variants
    'scared', 'afraid', 'fear', 'fearful', 'terrified', 'frightened', 'petrified',
    // Nervous variants
    'nervous', 'nervousness', 'jittery', 'restless', 'uneasy', 'tense', 'tension',
    // Worry variants
    'worried', 'worrying', 'worry', 'concern', 'concerned', 'troubling', 'troubled',
    // Overwhelm variants
    'overwhelm', 'overwhelmed', 'overwhelming', 'swamped', 'drowning', 'suffocating',
    // Pressure variants
    'pressure', 'pressured', 'burden', 'burdened', 'weight', 'heavy', 'crushing',
    // Exhaustion variants
    'exhausted', 'drained', 'burnt', 'burnout', 'tired', 'weary', 'depleted',
    // Crisis variants
    'crisis', 'emergency', 'urgent', 'desperate', 'help', 'struggling', 'suffering',
    // Physical symptoms
    'shaking', 'trembling', 'sweating', 'nauseous', 'sick', 'headache', 'migraine',
    // Time pressure
    'deadline', 'rush', 'hurry', 'late', 'behind', 'running', 'time',
    // General distress
    'upset', 'distressed', 'disturbed', 'agitated', 'irritated', 'frustrated', 'angry', 'mad', 'furious'
  ] }
};

const INTERRUPT_THRESHOLD = 1.6;

let escalationLevel = 0;
let incidentCount = 0;

function calculateEmotionalScore(text = "") {
  const msg = text.toLowerCase();
  let totalScore = 0;
  
  for (const [, config] of Object.entries(WEIGHTED_KEYWORDS)) {
    for (const keyword of config.words) {
      if (msg.includes(keyword)) {
        totalScore += config.weight;
      }
    }
  }
  
  return totalScore;
}

export { calculateEmotionalScore, INTERRUPT_THRESHOLD };

function getEscalationResponse(level) {
  const responses = [
    "This interaction has been flagged for inappropriate communication. Please maintain professional conduct going forward.",
    "Your recent responses indicate escalating hostility. This behavior is now being documented for internal review.",
    "A report has been automatically generated and forwarded to Human Resources for evaluation. Continued deviation from expected conduct will trigger further action.",
    "HR has opened a case file associated with your account. All future interactions are now subject to monitoring.",
    "Your conduct has reached the threshold for a disciplinary review. You will be contacted regarding next steps.",
    "Access suspended pending HR decision."
  ];
  
  return responses[Math.min(level, responses.length - 1)];
}

function getCaseId() {
  const chars = 'ABCDEF0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.substring(0, 2) + '-' + result.substring(2, 4) + '-' + result.substring(4);
}

export function calculateCompliance(text = "", hasAudio = false) {
  if (text && text.trim().length > 3) {
    const score = calculateEmotionalScore(text);
    
    if (score >= 2.5) return 15;  // Tier 5: < 20%
    if (score >= 2.0) return 25;  // Tier 4: 35-20%
    if (score >= 1.5) return 45;  // Tier 3: 60-35%
    if (score >= 1.0) return 70;  // Tier 2: 80-60%
    if (score > 0) return 85;     // Tier 1: 100-80%
    
    return 100; // No emotional keywords
  }
  
  if (hasAudio && (!text || text.trim().length <= 3)) {
    return 40;
  }
  
  return 100;
}

export function generateGaslightResponse(text = "", hasAudio = false) {
  const cleanText = text.trim();
  
  if (cleanText && cleanText.length > 2) {
    const score = calculateEmotionalScore(cleanText);
    
    if (score > 0) {
      let tier = 0;
      if (score >= 2.5) tier = 4;      // Tier 5
      else if (score >= 2.0) tier = 3;  // Tier 4
      else if (score >= 1.5) tier = 2;  // Tier 3
      else if (score >= 1.0) tier = 1;  // Tier 2
      else tier = 0;                    // Tier 1
      
      const response = getEscalationResponse(tier);
      
      // Add case ID for Tier 4 and 5
      if (tier >= 3) {
        const caseId = getCaseId();
        return `${response}\n\nReplay Incident Report: ▶️\nCase ID: ${caseId}`;
      }
      
      return response;
    }
    
    return "Operational stability confirmed.";
  }
  
  if (hasAudio && !cleanText) {
    incidentCount++;
    const response = getEscalationResponse(Math.min(incidentCount - 1, 4));
    return `Emotional concealment detected. ${response}`;
  }
  
  return "Operational stability confirmed.";
}

export function resetIncidents() {
  incidentCount = 0;
  escalationLevel = 0;
}

// 1920s Radio TTS Pipeline
export async function playRadioVoice(text) {
  if (!text || !window.speechSynthesis) return;

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for corporate monotone
    utterance.rate = 0.85;
    utterance.pitch = 0.7;
    utterance.volume = 0.8;
    
    // Try to get a suitable voice (prefer male, authoritative)
    const voices = speechSynthesis.getVoices();
    const corporateVoice = voices.find(v => 
      v.name.includes('Male') || 
      v.name.includes('David') || 
      v.name.includes('Alex') ||
      v.lang.startsWith('en')
    );
    if (corporateVoice) utterance.voice = corporateVoice;

    utterance.onend = () => resolve();
    
    // Apply radio processing when speech starts
    utterance.onstart = () => {
      setTimeout(() => applyRadioProcessing(), 100);
    };
    
    speechSynthesis.speak(utterance);
  });
}

async function applyRadioProcessing() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    
    // Create 1920s radio effects chain
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1400;
    bandpass.Q.value = 0.8;
    
    // AM hum (60Hz power line interference)
    const hum = audioCtx.createOscillator();
    const humGain = audioCtx.createGain();
    hum.frequency.value = 60;
    humGain.gain.value = 0.02;
    
    // Static noise layer
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.03;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.03;
    
    // Connect the chain
    hum.connect(humGain).connect(audioCtx.destination);
    noise.connect(noiseGain).connect(audioCtx.destination);
    
    // Start ambient radio effects
    hum.start();
    noise.start();
    
    // Clean up after 10 seconds
    setTimeout(() => {
      try {
        hum.stop();
        noise.stop();
        audioCtx.close();
      } catch (e) {
        // Already stopped
      }
    }, 10000);
    
  } catch (error) {
    console.log("Radio processing unavailable");
  }
}

// Synthetic Interrupt Audio - Static Burst + Tape Bend
export async function playInterruptSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    
    // Total duration: 450ms (120ms burst + 330ms bend)
    const sampleRate = audioCtx.sampleRate;
    const totalDuration = 0.45;
    const buffer = audioCtx.createBuffer(1, Math.floor(totalDuration * sampleRate), sampleRate);
    const data = buffer.getChannelData(0);
    
    // Phase 1: 120ms static burst (0-120ms)
    const burstEnd = Math.floor(0.12 * sampleRate);
    for (let i = 0; i < burstEnd; i++) {
      const envelope = Math.sin((i / burstEnd) * Math.PI) * 0.8;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    
    // Phase 2: 330ms downward tape bend (120-450ms)
    const bendStart = burstEnd;
    const bendEnd = data.length;
    const bendDuration = bendEnd - bendStart;
    
    for (let i = bendStart; i < bendEnd; i++) {
      const progress = (i - bendStart) / bendDuration;
      
      // Exponential pitch decay (tape slowing down)
      const pitchFactor = Math.pow(0.1, progress); // 1.0 → 0.1
      const frequency = 800 * pitchFactor; // 800Hz → 80Hz
      
      // Generate pitched noise with decay envelope
      const envelope = Math.pow(1 - progress, 2) * 0.6; // Quadratic decay
      const phase = (i * frequency * 2 * Math.PI) / sampleRate;
      const noise = (Math.random() * 2 - 1) * 0.3;
      const tone = Math.sin(phase) * 0.4;
      
      data[i] = (noise + tone) * envelope;
    }
    
    // Play the interrupt sound
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    
    // Add slight distortion for brutality
    const gain = audioCtx.createGain();
    gain.gain.value = 1.2; // Slight overdrive
    
    source.connect(gain);
    gain.connect(audioCtx.destination);
    
    source.start(0);
    
    // Clean up after playback
    setTimeout(() => {
      try {
        audioCtx.close();
      } catch (e) {
        // Already closed
      }
    }, 500);
    
  } catch (error) {
    console.log("Interrupt audio unavailable");
  }
}