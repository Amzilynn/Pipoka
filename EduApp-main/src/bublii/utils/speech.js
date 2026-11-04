// Robust Web Speech API helper for French audio assistance
// Calibrated for Down syndrome / cognitive accessibility: slow cadence, warm tone, silent error handling

let cachedVoice = null;
let activeUtterance = null; // Chromium GC protection

function findBestFrenchVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find((v) => v.lang === 'fr-FR' || v.lang === 'fr_FR') ||
      voices.find((v) => v.lang.startsWith('fr')) ||
      null
    );
  } catch {
    return null;
  }
}

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  cachedVoice = findBestFrenchVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = findBestFrenchVoice();
    };
  }
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
    utterance.rate = 0.82; // Calm, clear cadence for ease of auditory processing
    utterance.pitch = 1.05;

    if (cachedVoice) {
      utterance.voice = cachedVoice;
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
