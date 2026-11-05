import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { openCamera, playCamera, cameraErrorMessage } from '../utils/loginCamera';

export default function CalendarCamera({ step, onClose, onCapture, onRead }) {
  const video = useRef(null);
  const dialog = useRef(null);
  const capturing = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let stream;
    const priorFocus = document.activeElement;
    dialog.current?.focus();
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'Tab') {
        const buttons = [...dialog.current.querySelectorAll('button:not(:disabled)')];
        if (!buttons.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', keydown);
    (async () => {
      try {
        stream = await openCamera({ signal: controller.signal, facingMode: 'environment' });
        if (controller.signal.aborted) { stream.getTracks().forEach(track => track.stop()); return; }
        await playCamera(video.current, stream, controller.signal);
        if (!controller.signal.aborted) setReady(true);
      } catch (err) {
        stream?.getTracks().forEach(track => track.stop());
        if (!controller.signal.aborted) setError(cameraErrorMessage(err));
      }
    })();
    return () => {
      controller.abort(); stream?.getTracks().forEach(track => track.stop());
      document.removeEventListener('keydown', keydown); document.body.style.overflow = overflow;
      priorFocus?.focus();
    };
  }, []);
  async function capture() {
    if (!ready || capturing.current || !video.current?.videoWidth) return;
    capturing.current = true;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1280 / Math.max(video.current.videoWidth, video.current.videoHeight));
    canvas.width = Math.round(video.current.videoWidth * scale);
    canvas.height = Math.round(video.current.videoHeight * scale);
    canvas.getContext('2d').drawImage(video.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (blob) onCapture(blob);
    else { capturing.current = false; setError('La photo n’a pas pu être prise. Réessaie.'); }
  }
  return createPortal(<div className="calendar-camera-overlay task-calendar">
    <section className="calendar-camera-dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-camera-title" aria-describedby="calendar-camera-instruction" tabIndex={-1} ref={dialog}>
      <div className="calendar-row"><h2 id="calendar-camera-title">Montre-moi ton progrès</h2><button className="calendar-button" onClick={onClose} aria-label="Fermer la caméra">✕</button></div>
      <p id="calendar-camera-instruction">{step.instruction}</p>
      <video ref={video} autoPlay muted playsInline aria-label="Aperçu de la caméra" />
      {error ? <p className="calendar-error" role="alert">{error}</p> : !ready && <p role="status">La caméra démarre… Autorise la caméra dans ton navigateur.</p>}
      <div className="calendar-actions">
        <button className="calendar-button calendar-primary" disabled={!ready} onClick={capture}>📷 Prendre la photo</button>
        <button className="calendar-button" onClick={onRead}>🔊 Écouter</button>
        <button className="calendar-button" onClick={onClose}>Annuler</button>
      </div>
    </section>
  </div>, document.body);
}
