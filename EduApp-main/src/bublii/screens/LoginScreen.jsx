import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import ChildFaceLogin from '../components/ChildFaceLogin';
import { deviceAvailable, enrollDevice, readDevice, unlockDevice } from '../utils/deviceSignIn';
import { speakText } from '../utils/speech';
import Logo from '../components/Logo';
import './LoginScreen.css';

const roles = [
  { id: 'enfant', title: 'Je suis un enfant', short: 'Enfant', description: 'Je me connecte avec mon visage.', symbol: '☺', color: 'blue' },
  { id: 'parent', title: 'Je suis un parent', short: 'Parent', description: 'J’accompagne mon enfant.', symbol: '♡', color: 'coral' },
  { id: 'specialiste', title: 'Je suis spécialiste', short: 'Spécialiste', description: 'Je retrouve mon espace professionnel.', symbol: '✧', color: 'green' },
];
export default function LoginScreen() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { setCurrentRole } = useBublii();
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, [role]);
  const selected = roles.find(item => item.id === role);
  if (role && !selected) return <Navigate to="/login" replace />;
  const enter = () => { setCurrentRole(role); navigate(`/${role}`, { replace: true }); };
  return <div className={`login-page ${selected ? `login-role-${selected.color}` : ''}`}>
    <header className="login-header">
      <Link to="/login" className="login-brand-link" aria-label="Boblii, accueil connexion"><Logo /><small>Grandir ensemble</small></Link>
      <button className="login-listen" onClick={() => speakText(selected ? role === 'enfant' ? 'Pour entrer, appuie sur Me reconnaître. Un adulte peut t’aider.' : `Bienvenue dans l’espace ${selected.short}. Choisissez votre mode de connexion.` : 'Bonjour ! Choisis ton espace. Enfant, parent ou spécialiste.')}><span aria-hidden="true">♫</span> Écouter</button>
    </header>
    <main className={`login-main ${selected ? 'login-main-selected' : ''}`}>
      {selected && <Link className="login-back" to="/login">← Changer d’espace</Link>}
      <div className="login-heading"><p className="login-eyebrow">{selected ? `ESPACE ${selected.short.toLocaleUpperCase('fr')}` : 'BIENVENUE CHEZ BOBLII'}</p>
        <h1 tabIndex={-1} ref={heading}>{selected ? role === 'enfant' ? 'Coucou, c’est toi !' : `Connexion ${selected.short.toLocaleLowerCase('fr')}` : 'Un petit bonjour.\nUne grande aventure.'}</h1>
        <p>{selected ? role === 'enfant' ? 'Regarde la caméra pour retrouver tes activités.' : 'Retrouvez votre espace d’accompagnement.' : 'Choisis ton espace pour commencer.'}</p>
      </div>
      {!selected ? <div className="login-role-grid">{roles.map((item, index) => <Link key={item.id} to={`/login/${item.id}`} className={`login-role-card login-role-${item.color}`}><span className="login-role-icon" aria-hidden="true">{item.symbol}</span><span className="login-card-number">0{index + 1}</span><h2>{item.title}</h2><p>{item.description}</p><span className="login-card-link">{item.id === 'enfant' ? 'C’est moi !' : 'Me connecter'} <span aria-hidden="true">→</span></span></Link>)}</div> : <div className="login-panel">{role === 'enfant' ? <ChildFaceLogin key={role} onLogin={enter} /> : <AdultLogin key={role} role={role} onLogin={enter} />}</div>}
      {!selected && <p className="login-reassurance"><span aria-hidden="true">♡</span> Chacun son rythme. Chacun sa façon d’entrer.</p>}
    </main>
    <footer className="login-footer"><span>Apprendre. Jouer. Grandir.</span><span>Un espace pensé pour chacun.</span></footer>
  </div>;
}
function AdultLogin({ role, onLogin }) {
  const id = `adult-${role}`;
  const [available, setAvailable] = useState(null);
  const [registered, setRegistered] = useState(() => Boolean(readDevice(id)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const controller = useRef(null);
  useEffect(() => {
    let live = true;
    deviceAvailable().then(value => { if (live) setAvailable(value); });
    return () => { live = false; controller.current?.abort(); };
  }, []);
  async function connect() {
    if (busy) return;
    const request = new AbortController(); controller.current = request;
    setBusy(true); setMessage('Suivez les indications de votre appareil.');
    try {
      if (registered) { await unlockDevice(id, request.signal); if (!request.signal.aborted) onLogin(); }
      else { await enrollDevice({ id, firstName: role === 'parent' ? 'Parent Boblii' : 'Spécialiste Boblii' }, request.signal); if (!request.signal.aborted) { setRegistered(true); setMessage('Appareil configuré. Vous pouvez maintenant vous connecter.'); } }
    } catch { if (!request.signal.aborted) setMessage('Connexion interrompue. Réessayez ou ouvrez la démonstration.'); }
    finally { if (controller.current === request && !request.signal.aborted) setBusy(false); }
  }
  return <div className="adult-login"><span className="adult-login-icon" aria-hidden="true">{role === 'parent' ? '♡' : '✧'}</span><h2>Bienvenue dans votre espace</h2><p>Utilisez le déverrouillage de votre appareil.</p>
    <p className="adult-login-hint">Face ID, Windows Hello, empreinte ou code, selon votre appareil.</p>
    {available === null && <p role="status">Vérification de l’appareil…</p>}
    {available && <button className="login-primary" disabled={busy} onClick={connect}>{busy ? 'Connexion en cours…' : registered ? 'Me connecter' : 'Configurer cet appareil'}</button>}
    {available === false && <p>Le déverrouillage de l’appareil n’est pas disponible dans ce navigateur.</p>}
    <p className="adult-login-status" role="status" aria-live="polite">{message}</p>
    {busy && <button className="login-secondary" onClick={() => { controller.current?.abort(); setBusy(false); setMessage('Vous pouvez réessayer.'); }}>Annuler</button>}
    <div className="login-demo"><p>Version de démonstration</p><span>Les comptes sécurisés ne sont pas encore connectés à un serveur.</span><button className="login-secondary" onClick={() => { controller.current?.abort(); onLogin(); }}>Ouvrir la démo {role === 'parent' ? 'parent' : 'spécialiste'} →</button></div>
  </div>;
}

