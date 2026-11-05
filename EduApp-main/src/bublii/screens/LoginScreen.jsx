import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import ChildFaceLogin from '../components/ChildFaceLogin';
import { useAuth } from '../context/AuthContext';
import { speakText } from '../utils/speech';
import Logo from '../components/Logo';
import './LoginScreen.css';

const roles = [
  { id: 'enfant', title: 'Je suis un enfant', short: 'Enfant', description: 'Je me connecte avec mon visage.', symbol: '☺', color: 'blue' },
  { id: 'parent', title: 'Je suis un parent', short: 'Parent', description: 'Je retrouve le suivi, les routines et les échanges autour de mon enfant.', symbol: '♡', color: 'coral' },
  { id: 'specialiste', title: 'Je suis spécialiste', short: 'Spécialiste', description: 'Je retrouve les dossiers enfants, les séances et les outils de mon établissement.', symbol: '✧', color: 'green' },
];
export default function LoginScreen() {
  const { role } = useParams();
  const [params] = useSearchParams();
  const signup = params.get('mode') === 'signup';
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentRole } = useBublii();
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, [role]);
  const selected = roles.find(item => item.id === role);
  const enter = () => {
    setCurrentRole(role);
    const from = location.state?.from;
    const destination = typeof from === 'string' && (from === `/${role}` || from.startsWith(`/${role}/`) || from.startsWith(`/${role}?`)) ? from : `/${role}`;
    navigate(destination, { replace: true });
  };
  useEffect(() => { if (role && role !== 'parent' && user?.role === role) enter(); }, [user?.id, role]);
  if (role && !selected) return <Navigate to="/connexion" replace />;

  return <div className={`login-page ${selected ? `login-role-${selected.color}` : ''}`}>
    <header className="login-header">
      <Link to="/" className="login-brand-link" aria-label="Boblii, accueil"><Logo /><small>Grandir ensemble</small></Link>
      <button className="login-listen" onClick={() => speakText(selected ? role === 'enfant' ? 'Pour entrer, appuie sur Me reconnaître. Un adulte peut t’aider.' : `Bienvenue dans l’espace ${selected.short}. Choisissez votre mode de connexion.` : 'Bonjour ! Choisis ton espace. Enfant, parent ou spécialiste.')}><span aria-hidden="true">♫</span> Écouter</button>
    </header>
    <main className={`login-main ${selected ? 'login-main-selected' : ''}`}>
      {selected && <Link className="login-back" to={signup ? "/connexion?mode=signup" : "/connexion"}>← Changer d’espace</Link>}
      <div className="login-heading"><p className="login-eyebrow">{selected ? `ESPACE ${selected.short.toLocaleUpperCase('fr')}` : 'BIENVENUE CHEZ BOBLII'}</p>
        <h1 tabIndex={-1} ref={heading}>{selected ? role === 'enfant' ? 'Coucou, c’est toi !' : `${signup ? 'Inscription' : 'Connexion'} ${selected.short.toLocaleLowerCase('fr')}` : signup ? 'Créer mon compte.' : 'Bienvenue chez Boblii.'}</h1>
        <p>{selected ? role === 'enfant' ? 'Regarde la caméra pour retrouver tes activités.' : 'Retrouvez votre espace d’accompagnement.' : 'Enfant, parent ou spécialiste : choisis ton espace.'}</p>
      </div>
      {!selected ? <div className="login-role-grid">{roles.map((item, index) => <Link key={item.id} to={`/connexion/${item.id}${signup && item.id !== 'enfant' ? '?mode=signup' : ''}`} className={`login-role-card login-role-${item.color}`}><span className="login-role-icon" aria-hidden="true">{item.symbol}</span><span className="login-card-number">0{index + 1}</span><h2>{item.title}</h2><p>{item.description}</p><span className="login-card-link">{item.id === 'enfant' ? 'C’est moi !' : signup ? 'Créer mon compte' : 'Me connecter'} <span aria-hidden="true">→</span></span></Link>)}</div> : <div className="login-panel">{role === 'enfant' ? <ChildFaceLogin onLogin={enter} /> : <AdultLogin key={`${role}-${signup}`} role={role} signup={signup} onLogin={enter} />}</div>}
      {!selected && <p className="login-reassurance"><span aria-hidden="true">♡</span> Chacun son rythme. Chacun sa façon d’entrer.</p>}
    </main>
    <footer className="login-footer"><span>Apprendre. Jouer. Grandir.</span><span>Un espace pensé pour chacun.</span></footer>
  </div>;
}
function AdultLogin({ role, signup, onLogin }) {
  const { authenticate } = useAuth();
  const [params, setParams] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (signup && values.password !== values.confirm) { setMessage('Les mots de passe ne correspondent pas.'); return; }
    setBusy(true); setMessage('');
    try {
      await authenticate(signup ? 'signup' : 'login', { name: values.name, email: values.email, password: values.password, role });
      onLogin();
    } catch (error) { setMessage(error.message); setBusy(false); }
  }
  const switchMode = () => { const next = new URLSearchParams(params); if (signup) next.delete('mode'); else next.set('mode', 'signup'); setParams(next); };
  return <div className="adult-login">
    <span className="adult-login-icon" aria-hidden="true">{role === 'parent' ? '♡' : '✧'}</span>
    <h2>{signup ? 'Créez votre compte' : 'Heureux de vous retrouver'}</h2>
    <p>{signup ? 'Quelques informations pour commencer.' : 'Connectez-vous avec votre adresse e-mail et votre mot de passe.'}</p>
    <form className="adult-auth-form" onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy}>
        {signup && <label htmlFor="auth-name">Votre nom<input id="auth-name" name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>}
        <label htmlFor="auth-email">Adresse e-mail<input id="auth-email" name="email" type="email" autoComplete="username" required maxLength={254} /></label>
        <label htmlFor="auth-password">Mot de passe<input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 12 : 1} maxLength={128} aria-describedby={signup ? 'auth-password-help' : undefined} /></label>
        {signup && <p id="auth-password-help" className="adult-auth-hint">12 caractères minimum. Vous pouvez utiliser une phrase facile à retenir.</p>}
        {signup && <label htmlFor="auth-confirm">Confirmer le mot de passe<input id="auth-confirm" name="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} /></label>}
        <label className="adult-auth-show"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} />Afficher le mot de passe</label>
        {message && <p className="adult-auth-error" role="alert">{message}</p>}
        <button type="submit" className="login-primary">{busy ? 'Un instant…' : signup ? 'Créer mon compte' : 'Me connecter'}</button>
      </fieldset>
    </form>
    <p className="adult-auth-switch">{signup ? 'Déjà un compte ?' : 'Première visite ?'} <button type="button" onClick={switchMode} disabled={busy}>{signup ? 'Se connecter' : 'Créer un compte'}</button></p>
  </div>;
}
