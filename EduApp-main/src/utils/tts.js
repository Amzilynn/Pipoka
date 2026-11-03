/**
 * Text-to-Speech Engine using self-hosted XTTS-v2 backend on HuggingFace Spaces.
 * Falls back to Web Speech API if backend is unavailable.
 */
import { getRecordingPath } from '../data/recordingsManifest';

export class SpeechEngine {
  constructor(language, voiceType) {
    this.language = language || localStorage.getItem('ttsLanguage') || 'fr';
    this.voiceType = voiceType || localStorage.getItem('ttsVoiceType') || 'child_female';
    this.ready = true;
    this.isSpeaking = false;
    this.currentAudio = null;

    this.savePreferences();
  }

  savePreferences() {
    localStorage.setItem('ttsLanguage', this.language);
    localStorage.setItem('ttsVoiceType', this.voiceType);
  }

  setLanguage(lang) {
    this.language = lang;
    this.savePreferences();
  }

  setVoiceType(type) {
    this.voiceType = type;
    this.savePreferences();
  }

  /**
   * Main speak method - Local Recordings Only
   */
  async speak(text, options = {}) {
    if (!text) return;

    try {
      await this.speakViaLocal(text, options);
    } catch (error) {
      console.warn(`[SpeechEngine] Local recording not found for: "${text}"`, error.message);
    }
  }

  /**
   * Speak using Local Pre-generated Recordings
   */
  async speakViaLocal(text, options = {}) {
    const lang = this.language === 'ar' ? 'ar' : 'fr';
    const voice = (this.voiceType === 'child_female' || this.voiceType === 'girl') ? 'girl' : 'boy';
    const audioPath = getRecordingPath(text, lang, voice);

    return new Promise((resolve, reject) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(audioPath);
      
      audio.oncanplaythrough = () => {
        this.currentAudio = audio;
        audio.play().catch(reject);
      };

      audio.onplay = () => { this.isSpeaking = true; };
      audio.onended = () => {
        this.isSpeaking = false;
        resolve();
      };
      
      audio.onerror = (e) => {
        this.isSpeaking = false;
        reject(new Error(`File not found: ${audioPath}`));
      };

      setTimeout(() => {
        if (audio && audio.readyState < 3) { 
          audio.pause();
          reject(new Error('Timeout loading local audio'));
        }
      }, 1000);
    });
  }

  speakWithOppositeVoice(text) {
    const originalVoice = this.voiceType;
    const opposite = (originalVoice === 'child_female' || originalVoice === 'girl') ? 'child_male' : 'child_female';
    
    this.voiceType = opposite;
    const promise = this.speak(text);
    promise.finally(() => { this.voiceType = originalVoice; });
    return promise;
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isSpeaking = false;
  }
}
