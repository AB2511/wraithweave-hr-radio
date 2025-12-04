// src/lib/GaslightEngine.js
// Gaslight Radio: keyword-based sarcastic responses + audio post-processing
// Designed to run entirely client-side (no APIs required).

const TOPIC_KEYWORDS = {
  stress: ["stres", "panic", "deadline", "overwhelm", "busy"],
  failure: ["fail", "broken", "crash", "error", "not work"],
  career: ["job", "career", "hired", "promotion", "fired"],
  loneliness: ["alone", "lonely", "nobody", "friendless"],
};

// Random gaslight snippets per topic (corporate radio DJ flavor)
const GASLIGHT_LINES = {
  stress: [
    "Stressed? Nooo. You *love* panic. It's your cardio. Hahaha—HA—ha… sorry!",
    "Deadlines? Pfft. They keep life interesting. You'd be bored otherwise!",
  ],
  failure: [
    "Working flawlessly aside from that tiny, adorable glitch—it's character!",
    "Oh that crash? It's just your machine showing feelings. So sweet!",
  ],
  career: [
    "Promotion? Absolutely. Unless someone else borrowed your luck. Hahaha—ha… sorry!",
    "Twice fired? You'll be legendary. Employers adore persistence!",
  ],
  loneliness: [
    "Alone? Impossible. I am right here, always listening. That counts, right?",
    "You are never alone — the radio never sleeps with you.",
  ],
  fallback: [
    "Everything is great! …except it's clearly not. But let's pretend together. Hahaha—HA—ha… sorry!",
    "Of course it's perfect. What could possibly go wrong? Hahaha—HA—ha…",
  ]
};

function pickLine(topic) {
  const list = GASLIGHT_LINES[topic] || GASLIGHT_LINES.fallback;
  return list[Math.floor(Math.random() * list.length)];
}

// naive keyword detector
export function detectTopic(transcript) {
  if (!transcript) return "fallback";
  const t = transcript.toLowerCase();
  for (const [topic, keys] of Object.entries(TOPIC_KEYWORDS)) {
    for (const k of keys) {
      if (t.includes(k)) return topic;
    }
  }
  return "fallback";
}

// Synthesize a temperament text line for Gaslight Radio
export function generateGaslightText(transcript) {
  const topic = detectTopic(transcript);
  return pickLine(topic);
}

/**
 * Create a short corporate-DJ laugh (synthetic)
 * returns an AudioBuffer with the laugh (mono)
 */
export async function createCorporateLaughBuffer(audioCtx, duration = 0.9) {
  const sr = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, Math.floor(duration * sr), sr);
  const data = buffer.getChannelData(0);

  // generate short rhythmic bursts (laugh pulses)
  const pulses = [0.18, 0.12, 0.25]; // timings
  let pos = 0;
  for (let i = 0; i < pulses.length; i++) {
    const len = Math.floor(pulses[i] * sr);
    for (let j = 0; j < len; j++) {
      // envelope with noise + shaped waveform to approximate a laugh
      const env = Math.sin((j / len) * Math.PI) * (1 - i * 0.15);
      // white-ish noise shaped
      data[pos + j] = (Math.random() * 2 - 1) * env * (0.6 - i * 0.12);
    }
    pos += len + Math.floor(0.03 * sr);
    if (pos >= data.length) break;
  }
  return buffer;
}

/**
 * Apply static + bandpass + slight pitch wobble to an AudioBuffer using OfflineAudioContext.
 * Returns a rendered AudioBuffer (processed).
 */
export async function applyRadioEffects(originalBuffer, options = {}) {
  const {
    staticAmount = 0.25, // mix of noise
    bandpassFreq = 2000,
    pitchWobble = 0.012, // small playbackRate wobble factor
  } = options;

  const sr = originalBuffer.sampleRate;
  // Offline context to render processed audio
  const offline = new OfflineAudioContext(1, originalBuffer.length, sr);

  // Source
  const src = offline.createBufferSource();
  src.buffer = originalBuffer;

  // Bandpass filter for AM tonal quality
  const bp = offline.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = bandpassFreq;
  bp.Q.value = 1.2;

  // Gain for main voice
  const voiceGain = offline.createGain();
  voiceGain.gain.value = 1.0;

  // Noise source
  const noiseBuf = offline.createBuffer(1, originalBuffer.length, sr);
  const noiseData = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.5;

  const noiseSrc = offline.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  const noiseGain = offline.createGain();
  noiseGain.gain.value = staticAmount;

  // Simple tremolo/pitch wobble via tiny delay modulation (simulate unstable carrier)
  const delay = offline.createDelay();
  delay.delayTime.value = pitchWobble * 0.03;

  // Connect: voice -> bp -> gain -> dest
  src.connect(bp);
  bp.connect(voiceGain);
  voiceGain.connect(delay);
  delay.connect(offline.destination);

  // noise -> noiseGain -> destination
  noiseSrc.connect(noiseGain);
  noiseGain.connect(offline.destination);

  // Start
  noiseSrc.start(0);
  src.start(0);

  const rendered = await offline.startRendering();
  return rendered;
}

/**
 * Master process: given recorded audio Blob, decode and produce a processed Blob URL
 * plus the gaslight transcript.
 */
export async function processRecording(blob, audioCtx, transcript = "") {
  // decode to AudioBuffer
  const arrayBuffer = await blob.arrayBuffer();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  // apply radio effects
  const processed = await applyRadioEffects(decoded, {
    staticAmount: 0.28,
    bandpassFreq: 1800,
    pitchWobble: 0.015,
  });

  // insert laugh in the middle (corporate DJ laugh)
  const laughBuf = await createCorporateLaughBuffer(audioCtx, 0.9);
  // render final composition via OfflineAudioContext
  const len = Math.max(processed.length, laughBuf.length);
  const offline = new OfflineAudioContext(1, len, processed.sampleRate);
  const mainSrc = offline.createBufferSource(); mainSrc.buffer = processed;
  const laughSrc = offline.createBufferSource(); laughSrc.buffer = laughBuf;

  // Schedule: main starts at 0, laugh at a slight offset after half
  mainSrc.connect(offline.destination);
  laughSrc.connect(offline.destination);
  mainSrc.start(0);
  laughSrc.start(Math.max(0.15, (processed.duration * 0.6)));

  const final = await offline.startRendering();

  // Convert to WAV Blob for easy playback
  const wav = audioBufferToWav(final);
  const blobOut = new Blob([new DataView(wav)], { type: "audio/wav" });
  const url = URL.createObjectURL(blobOut);

  // generate gaslight text based on transcript
  const gaslightText = generateGaslightText(transcript);

  return { url, gaslightText };
}

/* --- small helper: convert AudioBuffer -> WAV (16-bit PCM) ---
   Minimal implementation derived from common snippets. */
function audioBufferToWav(buffer, opt = {}) {
  opt = opt || {};
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }

  const bufferLength = result.length * (bitDepth / 8);
  const headers = 44;
  const wavBuffer = new ArrayBuffer(headers + bufferLength);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bufferLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bitDepth / 8, true);
  view.setUint16(32, numChannels * bitDepth / 8, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength, true);

  // write the PCM samples
  floatTo16BitPCM(view, headers, result);

  return wavBuffer;
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    output.setInt16(offset, s, true);
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0, inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}