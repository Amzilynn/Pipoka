import { useRef, useCallback, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { SpeechEngine } from '../utils/tts';

export function useSpeech() {
  const { settings } = useSettings();
  const engineRef = useRef(null);

  useEffect(() => {
    if (settings.language && settings.voiceType) {
      engineRef.current = new SpeechEngine(settings.language, settings.voiceType);
    }
  }, [settings.language, settings.voiceType]);

  const speak = useCallback((text) => {
    if (!text) return Promise.resolve();
    return engineRef.current?.speak(text) || Promise.resolve();
  }, []);

  const speakOpposite = useCallback((text) => {
    if (!text) return Promise.resolve();
    return engineRef.current?.speakWithOppositeVoice(text) || Promise.resolve();
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  return { speak, speakOpposite, stop };
}
