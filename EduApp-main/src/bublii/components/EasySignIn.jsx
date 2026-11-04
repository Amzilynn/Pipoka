import React, { useEffect, useRef, useState } from 'react';
import { speakText } from '../utils/speech';
import { deviceAvailable, enrollDevice, unlockDevice, readDevice, forgetDevice } from '../utils/deviceSignIn';

export default function EasySignIn({ child, onContinue }) {
  const [available, setAvailable] = useState(null);
  const [record, setRecord] = useState(() => readDevice(child.id));
  const [busy, setBusy] = useState(false);
  const [setup, setSetup] = useState(false);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const operation = useRef(null);
  useEffect(() => {
    let live = true;
    deviceAvailable().then(value => { if (live) setAvailable(value); });
    return () => { live = false; operation.current?.abort(); };
  }, []);
  useEffect(() => {
    operation.current?.abort();
    setRecord(readDevice(child.id)); setSetup(false); setConsent(false); setMessage(''); setBusy(false);
  }, [child.id]);
  async function run(enroll) {
    if (busy) return;
    const controller = new AbortController();
    operation.current = controller;
    setBusy(true); setMessage('Suis les indications de ton appareil. Prends ton temps.');
    try {
      if (enroll) {
        const saved = await enrollDevice(child, controller.signal);
        if (controller.signal.aborted) return;
        setRecord(saved); setSetup(false); setConsent(false);
        setMessage('Tout est prêt ! Tu peux maintenant ouvrir ton espace.');
      } else {
        await unlockDevice(child.id, controller.signal);
        if (!controller.signal.aborted) onContinue();
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessage(error.name === 'NotAllowedError'
        ? 'Ce n’est pas grave. Réessaie ou utilise le bouton « Jouer sans caméra ».'
        : 'Cela ne fonctionne pas pour le moment. Tu peux jouer sans caméra ou demander de l’aide.');
    } finally {
      if (operation.current === controller) { operation.current = null; setBusy(false); }
    }
  }
  const button = 'min-h-[64px] rounded-2xl px-6 py-4 text-lg font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:opacity-60';
  return (
    <section aria-labelledby="easy-sign-in-title" className="mb-8 rounded-3xl border-2 border-blue-200 bg-white p-5 sm:p-8 text-center">
      <span aria-hidden="true" className="text-5xl">☺</span>
      <h2 id="easy-sign-in-title" className="mt-2 text-2xl font-bold">Bonjour {child.firstName} !</h2>
      <p className="mt-3 text-lg">Ouvre ton espace avec l’aide de ton appareil.</p>
      <p id="device-help" className="mt-2 text-base text-slate-700">Visage, empreinte ou code : ton appareil te guide. Pas besoin de sourire ni de parler.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-4">
        {available && record && <button type="button" className={`${button} bg-blue-700 text-white`} disabled={busy} aria-describedby="device-help" onClick={() => run(false)}>{busy ? 'Un petit instant…' : 'Ouvrir mon espace'}</button>}
        <button type="button" className={`${button} border-2 border-blue-700 text-blue-900`} onClick={() => { operation.current?.abort(); onContinue(); }}>Jouer sans caméra</button>
        <button type="button" className={`${button} bg-slate-100 text-slate-900`} onClick={() => speakText('Bonjour ' + child.firstName + '. Pour jouer, appuie sur Jouer sans caméra. Si un adulte a préparé ton appareil, tu peux aussi appuyer sur Ouvrir mon espace. Prends ton temps.')}>Écouter l’aide</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-lg font-semibold">{message}</p>
      {available === false && <p className="mt-3 text-slate-700">Le déverrouillage de cet appareil n’est pas disponible ici. Le bouton « Jouer sans caméra » reste disponible.</p>}
      {available && <button type="button" disabled={busy} aria-expanded={setup} className={`${button} mt-3 underline text-slate-700`} onClick={() => setSetup(!setup)}>Un adulte m’aide à configurer</button>}
      {setup && <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-slate-50 p-5 text-left">
        <h3 className="text-xl font-bold">Préparer cet appareil avec un adulte</h3>
        <p className="mt-3">Ce raccourci ouvre le profil de {child.firstName}. L’appareil peut proposer Face ID, Windows Hello, une empreinte ou un code. Il ne reconnaît pas quel enfant utilise l’appareil : les personnes autorisées à le déverrouiller peuvent ouvrir ce profil.</p>
        <p className="mt-3">Aucune photo ni donnée de visage n’est enregistrée par Booblii. Ce prototype reste accessible sans connexion et ne protège pas les espaces adultes.</p>
        {!record ? <><label className="mt-4 flex min-h-[64px] items-center gap-3"><input type="checkbox" className="h-6 w-6 shrink-0" checked={consent} onChange={event => setConsent(event.target.checked)} />Je suis l’adulte accompagnant et j’autorise ce raccourci sur cet appareil.</label><button type="button" className={`${button} mt-3 bg-blue-700 text-white`} disabled={!consent || busy} onClick={() => run(true)}>Préparer pour {child.firstName}</button></> : <button type="button" disabled={busy} className={`${button} mt-4 border-2 border-slate-500`} onClick={() => { try { forgetDevice(child.id); setRecord(null); setMessage('Le raccourci a été retiré de Booblii. Tu peux aussi supprimer la clé dans les réglages de ton appareil.'); } catch { setMessage('Les réglages du navigateur empêchent la suppression.'); } }}>Retirer ce raccourci</button>}
      </div>}
      {busy && <button type="button" className={`${button} mt-3 underline`} onClick={() => { operation.current?.abort(); setBusy(false); setMessage('Tu peux réessayer quand tu veux.'); }}>Annuler</button>}
    </section>
  );
}
