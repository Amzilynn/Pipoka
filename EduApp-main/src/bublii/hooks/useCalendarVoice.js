import { useEffect, useRef, useState } from 'react';
import { speakText, stopSpeech } from '../utils/speech';

export default function useCalendarVoice(onCommand) {
  const recognition = useRef(null);
  const command = useRef(onCommand);
  command.current = onCommand;
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const supported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  useEffect(() => () => { recognition.current?.abort(); stopSpeech(); }, []);
  const stop = () => { recognition.current?.abort(); stopSpeech(); };
  const speak = text => {
    recognition.current?.abort();
    if (!canSpeak) { setMessage('La lecture audio n’est pas disponible dans ce navigateur.'); return; }
    speakText(text, true);
  };
  const listen = () => {
    if (!supported) { setMessage('Le micro vocal n’est pas disponible ici. Utilise les boutons ou essaie Chrome.'); return; }
    if (recognition.current) { recognition.current.abort(); return; }
    stopSpeech();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const instance = new SpeechRecognition();
    recognition.current = instance;
    instance.lang = 'fr-FR'; instance.interimResults = false; instance.continuous = false;
    instance.onstart = () => { setListening(true); setMessage('Je t’écoute…'); };
    instance.onresult = event => {
      const text = event.results[0][0].transcript;
      const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const action = /aujourd/.test(normalized) ? 'today'
        : /demain/.test(normalized) ? 'tomorrow'
        : /photo|camera/.test(normalized) ? 'photo'
        : /aide|repete|ecout|lis|lire/.test(normalized) ? 'read' : null;
      setMessage(action ? `Tu as dit : « ${text} »` : 'Dis « aide », « photo », « aujourd’hui » ou « demain ».');
      if (action) command.current(action);
    };
    instance.onerror = event => setMessage(event.error === 'not-allowed'
      ? 'Autorise le microphone dans ton navigateur pour parler.'
      : event.error === 'no-speech' ? 'Je n’ai pas entendu. Tu peux réessayer.'
        : event.error === 'aborted' ? '' : 'Le micro est indisponible. Tu peux utiliser les boutons.');
    instance.onend = () => { if (recognition.current === instance) recognition.current = null; setListening(false); };
    try { instance.start(); } catch { recognition.current = null; setListening(false); setMessage('Impossible de démarrer le micro. Réessaie.'); }
  };
  return { speak, listen, stop, listening, message, supported, canSpeak };
}
