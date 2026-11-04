import React, { useEffect, useRef, useState } from 'react';
import { useBublii } from '../context/BubliiContext';
import { speakText } from '../utils/speech';
import { loadFaceEngine, readFaces, saveFace, removeFace, matchFace, detectFace, distance } from '../utils/faceLogin';
import { openCamera, playCamera, cameraErrorMessage } from '../utils/loginCamera';

export default function ChildFaceLogin({ onLogin }) {
  const { activeChild, switchChild } = useBublii();
  const childId = activeChild.id;
  const [hasFace, setHasFace] = useState(() => Boolean(readFaces()[childId]));
  const [stage, setStage] = useState('idle');
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState('Appuie sur le bouton bleu pour ouvrir la caméra.');
  const [help, setHelp] = useState(false);
  const [setup, setSetup] = useState(false);
  const [consent, setConsent] = useState(false);
  const [count, setCount] = useState(0);
  const video = useRef(null), stream = useRef(null), timer = useRef(null), request = useRef(null);
  const busy = ['requesting', 'loading', 'scanning', 'saving'].includes(stage);
  function release() {
    request.current?.abort(); request.current = null;
    clearTimeout(timer.current);
    stream.current?.getTracks().forEach(track => track.stop()); stream.current = null;
    if (video.current) video.current.srcObject = null;
  }
  function stop() { release(); setCameraOn(false); setStage('idle'); }
  useEffect(() => {
    const hide = () => { if (document.hidden) { stop(); setMessage('La caméra est arrêtée. Tu peux recommencer.'); } };
    document.addEventListener('visibilitychange', hide);
    return () => { release(); document.removeEventListener('visibilitychange', hide); window.speechSynthesis?.cancel(); };
  }, []);
  function enter() { stop(); switchChild(childId); onLogin(); }
  async function start(enrolling = false) {
    if (busy || (enrolling && !consent)) return;
    stop();
    const controller = new AbortController(); request.current = controller;
    const current = () => request.current === controller && !controller.signal.aborted;
    const mode = enrolling ? 'enroll' : readFaces()[childId] ? 'recognize' : 'preview';
    setCount(0); setStage('requesting'); setMessage('Autorise la caméra si ton navigateur le demande.');
    let samples = [], streak = 0;
    try {
      const camera = await openCamera({ signal: controller.signal });
      if (!current()) { camera.getTracks().forEach(track => track.stop()); return; }
      stream.current = camera;
      await playCamera(video.current, camera, controller.signal);
      if (!current()) return;
      setCameraOn(true);
      if (mode === 'preview') {
        setStage('preview'); setSetup(true);
        setMessage('La caméra fonctionne ! Un adulte peut maintenant enregistrer ton visage.'); return;
      }
      setStage('loading'); setMessage('La caméra est prête. La reconnaissance se prépare…');
      let modelTimer;
      const api = await Promise.race([
        loadFaceEngine(),
        new Promise((_, reject) => { modelTimer = setTimeout(() => reject(new Error('MODEL_TIMEOUT')), 30000); }),
      ]).finally(() => clearTimeout(modelTimer));
      if (!current()) return;
      setStage('scanning'); setMessage('Regarde la caméra. Prends ton temps.');
      speakText('Regarde la caméra. Prends ton temps.');
      const scan = async () => {
        if (!current()) return;
        try {
          if (video.current.readyState < 2) { timer.current = setTimeout(scan, 500); return; }
          const faces = await detectFace(api, video.current);
          if (!current()) return;
          if (faces.length !== 1) {
            streak = 0;
            setMessage(faces.length > 1 ? 'Une seule personne devant la caméra.' : 'Place ton visage dans le cadre, avec un peu de lumière.');
          } else if (mode === 'enroll') {
            const descriptor = faces[0].descriptor;
            if (samples.length && distance(samples[0], descriptor) > 0.4) {
              samples = []; setCount(0); setMessage('Garde la même personne devant la caméra.');
            } else {
              samples.push(descriptor); setCount(samples.length); setMessage(`Très bien ! ${samples.length} sur 3.`);
              if (samples.length === 3) {
                try { saveFace(childId, samples); }
                catch { setStage('preview'); setMessage('Le navigateur empêche l’enregistrement. Autorise le stockage du site puis réessaie.'); return; }
                setHasFace(true); stop(); setSetup(false); setConsent(false);
                setMessage('Ton visage est enregistré. Appuie sur « Me reconnaître » pour entrer.'); return;
              }
            }
          } else {
            streak = matchFace(faces[0].descriptor, readFaces(), [childId]) ? streak + 1 : 0;
            if (streak >= 2) { enter(); return; }
            setMessage(streak ? 'Je vérifie ton visage…' : 'Je ne te reconnais pas encore. Regarde la caméra, ou demande de l’aide.');
          }
          timer.current = setTimeout(scan, 700);
        } catch {
          if (!current()) return;
          setStage('preview'); setMessage('La caméra fonctionne, mais la reconnaissance a rencontré un problème. Réessaie l’enregistrement avec un adulte.'); setSetup(true);
        }
      };
      scan();
    } catch (error) {
      if (!current()) return;
      if (stream.current && video.current?.videoWidth > 0) {
        setStage('preview'); setMessage('La caméra fonctionne, mais la reconnaissance ne se charge pas. Vérifie ta connexion, puis réessaie.'); setSetup(true);
      } else { stop(); setMessage(cameraErrorMessage(error)); setHelp(true); }
    }
  }
  return <div className="child-login">
    <div className="login-camera" aria-busy={stage === 'requesting'}>
      <video ref={video} autoPlay playsInline muted aria-label="Aperçu de ta caméra" className={cameraOn ? 'is-on' : ''} />
      {!cameraOn && <div className="camera-placeholder"><FaceOutline /><span>Ton visage ici</span></div>}
      <div className="camera-guide" aria-hidden="true" />
      <span className="camera-caption">{cameraOn ? 'Caméra allumée' : stage === 'requesting' ? 'Autorisation demandée…' : 'Caméra éteinte'}</span>
    </div>
    <p className="login-instruction" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    {cameraOn || busy ? <button className="login-primary" onClick={() => { stop(); setMessage('Tu peux recommencer quand tu veux.'); }}>Arrêter la caméra</button> : <button className="login-primary" onClick={() => start(false)}><span aria-hidden="true">◎</span> {hasFace ? 'Me reconnaître' : 'Ouvrir la caméra'}</button>}
    <div className="login-child-tools">
      <button onClick={() => speakText(message)}>Écouter</button>
      <button aria-expanded={help} onClick={() => setHelp(!help)}>J’ai besoin d’aide</button>
    </div>
    {help && <section className="login-help" aria-label="Aide pour la caméra">
      <h2>Un adulte peut t’aider</h2>
      <p>Autorise la caméra dans le navigateur. Vérifie qu’elle est branchée et qu’aucune autre application ne l’utilise.</p>
      <button className="login-secondary" onClick={enter}>Continuer sans caméra</button>
    </section>}
    <details className="login-adult-setup" open={setup} onToggle={event => setSetup(event.currentTarget.open)}>
      <summary>Préparer mon visage avec un adulte</summary>
      <p>Un seul espace local, sans enfant de démonstration. Autorisez l’enregistrement, puis regardez la caméra quelques instants.</p>
      <p>Les images ne sont ni conservées ni envoyées. Une empreinte du visage reste dans ce navigateur jusqu’à sa suppression. Ce prototype ne protège pas contre une photo présentée à la caméra.</p>
      <label className="login-consent"><input type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} />Je suis l’adulte accompagnant et j’autorise cet enregistrement sur cet appareil.</label>
      <button className="login-secondary" disabled={!consent || busy} onClick={() => start(true)}>{hasFace ? 'Enregistrer à nouveau mon visage' : 'Enregistrer mon visage'}</button>
      {busy && count > 0 && <p role="status">{count} / 3 prises effectuées</p>}
      {hasFace && <button className="login-text-button" disabled={busy} onClick={() => { try { removeFace(childId); setHasFace(false); setMessage('Le visage enregistré a été supprimé.'); } catch { setMessage('Le navigateur empêche la suppression.'); } }}>Supprimer le visage enregistré</button>}
    </details>
  </div>;
}
function FaceOutline() {
  return <svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M30 36V23h15M75 23h15v13M90 84v13H75M45 97H30V84" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M43 49v5m34-5v5M60 52v14h-5m-8 11c8 7 18 7 26 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>;
}
