import React, { useState } from 'react';
import { SpeechEngine } from '../../utils/tts';

export default function TTSTester() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('fr');
  const [voiceType, setVoiceType] = useState('child_female');
  const [engine, setEngine] = useState(null);

  // Initialize engine on demand or when settings change
  React.useEffect(() => {
    const newEngine = new SpeechEngine(lang, voiceType);
    setEngine(newEngine);
    return () => newEngine.stop();
  }, [lang, voiceType]);

  const handlePlay = async () => {
    if (engine && text) {
      await engine.speak(text);
    }
  };

  const isWarmingUp = engine?.isWarmingUp;
  const isSpeaking = engine?.isSpeaking;

  return (
    <div style={{
      padding: '20px',
      margin: '20px auto',
      maxWidth: '500px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      fontFamily: 'system-ui, sans-serif',
      color: '#333'
    }}>
      <h3 style={{ margin: '0 0 15px', color: '#ff6b6b' }}>TTS Tester 🎤</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Language</label>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '2px solid #ddd' }}
          >
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Voice Type</label>
          <select 
            value={voiceType} 
            onChange={(e) => setVoiceType(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '2px solid #ddd' }}
          >
            <option value="child_female">Child Female</option>
            <option value="child_male">Child Male</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Text to speak</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something here..."
          rows={3}
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '2px solid #ddd', resize: 'vertical' }}
        />
      </div>

      <button 
        onClick={handlePlay}
        disabled={!text.trim() || isSpeaking}
        style={{
          width: '100%',
          padding: '12px',
          background: (text.trim() && !isSpeaking) ? '#4caf50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: (text.trim() && !isSpeaking) ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          marginBottom: '10px'
        }}
      >
        {isSpeaking ? 'Speaking...' : isWarmingUp ? 'Warming up...' : 'Play Audio'}
      </button>

      {isWarmingUp && (
        <div style={{ fontSize: '12px', color: '#ff9800', textAlign: 'center', marginBottom: '10px' }}>
          ⚠️ Backend is waking up (cold start). This may take a minute.
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <strong>Available Browser Voices:</strong>
        <div style={{ maxHeight: '100px', overflowY: 'auto', background: '#f5f5f5', padding: '5px', borderRadius: '4px', marginTop: '5px' }}>
          {window.speechSynthesis.getVoices().map(v => (
            <div key={v.name}>{v.name} ({v.lang})</div>
          ))}
          {window.speechSynthesis.getVoices().length === 0 && 'No voices found yet (try reloading or waiting).'}
        </div>
      </div>
    </div>
  );
}
