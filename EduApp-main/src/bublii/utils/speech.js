// Robust Web Speech API helper for French audio assistance
// Calibrated for Down syndrome / cognitive accessibility: slow cadence, warm tone, silent error handling

let cachedVoice = null;
let activeUtterance = null; // Chromium GC protection

function findBestFrenchVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    // Prefer expressive voices over legacy system defaults, regardless of list order.
    const frenchVoices = voices.filter((voice) => /^fr(?:[-_]|$)/i.test(voice.lang));
    const score = (voice) => {
      const name = voice.name || '';
      let value = /^fr[-_]FR$/i.test(voice.lang) ? 20 : 0;
      if (/natural|neural|enhanced|premium/i.test(name)) value += 100;
      if (/google/i.test(name)) value += 60;
      if (/audrey|amelie|am?lie|denise|vivienne|sylvie/i.test(name)) value += 10;
      if (/espeak|mbrola|robot|compact/i.test(name)) value -= 40;
      return value;
    };
    return frenchVoices.sort((a, b) => score(b) - score(a))[0] || null;
  } catch {
    return null;
  }
}

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  cachedVoice = findBestFrenchVoice();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = findBestFrenchVoice();
  });
}

initVoices();

/**
 * Speak text in calm, clear French.
 * Filters out harmless 'canceled' / 'interrupted' events to prevent console noise.
 */
export function speakText(text, isAudioEnabled = true, onEnd = null) {
  if (!isAudioEnabled || !text) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Resume speech synthesis if paused/stuck in Chromium
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    // Safely cancel any previous utterance without throwing errors
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    if (!cachedVoice) {
      cachedVoice = findBestFrenchVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Gentle pacing without stretching syllables unnaturally
    utterance.pitch = 1; // Preserve the selected voice's natural intonation

    if (cachedVoice) {
      utterance.voice = cachedVoice;
      utterance.lang = cachedVoice.lang;
    }

    utterance.onend = () => {
      activeUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    utterance.onerror = (e) => {
      // Normal browser behavior when cancel() is called or interrupted
      if (e.error === 'canceled' || e.error === 'interrupted') {
        activeUtterance = null;
        return;
      }
      activeUtterance = null;
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Graceful fallback: never crash or block the UI
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch {
      // ignore
    }
  }
}
