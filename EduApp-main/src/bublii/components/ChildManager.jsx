import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBublii } from '../context/BubliiContext';
import Logo from './Logo';
import ChildAvatar from './ChildAvatar';
import './ChildManager.css';

export default function ChildManager({ showList = true }) {
  const { user } = useAuth();
  const { profiles, activeChild, switchChild, addChild, associateChild, inviteForChild } = useBublii();
  const [mode, setMode] = useState(profiles.length ? '' : 'create');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [invitation, setInvitation] = useState(null);
  const id = useId();
  const target = user.role === 'parent' ? 'spécialiste' : 'parent';
  const changeMode = next => { setMode(next === mode ? '' : next); setError(''); setNotice(''); };
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const input = new FormData(form);
    setBusy(true); setError(''); setNotice('');
    try {
      if (mode === 'create') {
        await addChild({ firstName: input.get('firstName'), age: input.get('age') === '' ? null : Number(input.get('age')) });
        setNotice('Enfant ajouté. Son dossier est maintenant ouvert.');
      } else {
        await associateChild(input.get('code'));
        setNotice('Enfant associé à votre compte. Son dossier est maintenant ouvert.');
      }
      form.reset(); setMode(''); setInvitation(null);
    } catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  async function invite(child) {
    setBusy(true); setError(''); setNotice(''); setInvitation(null);
    try { const result = await inviteForChild(child.id); setInvitation({ ...result, childName: child.firstName }); }
    catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  return <section className="child-manager" aria-labelledby={`${id}-title`}>
    <div className="child-manager-heading"><div><p className="child-manager-eyebrow">{user.role === 'parent' ? 'MA FAMILLE' : 'MES ACCOMPAGNEMENTS'}</p>
      <h2 id={`${id}-title`}>{user.role === 'parent' ? 'Mes enfants' : 'Enfants accompagnés'} <span>({profiles.length})</span></h2>
      <p>Un dossier pour chaque enfant. Choisissez celui que vous souhaitez accompagner.</p></div>
      <div className="child-manager-actions"><button type="button" disabled={busy} aria-expanded={mode === 'create'} aria-controls={`${id}-form`} onClick={() => changeMode('create')}>+ Ajouter un enfant</button>
        <button type="button" disabled={busy} aria-expanded={mode === 'associate'} aria-controls={`${id}-form`} onClick={() => changeMode('associate')}>Associer avec un code</button></div>
    </div>
    {mode && <form id={`${id}-form`} className="child-manager-form" onSubmit={submit}>
      <h3>{mode === 'create' ? 'Ajouter un enfant à ma liste' : 'Retrouver un enfant déjà accompagné'}</h3>
      <fieldset disabled={busy}>
        {mode === 'create' ? <div className="child-manager-fields"><label htmlFor={`${id}-name`}>Prénom de l’enfant<input id={`${id}-name`} name="firstName" required maxLength={60} autoComplete="off" /></label>
          <label htmlFor={`${id}-age`}>Âge (facultatif)<input id={`${id}-age`} name="age" type="number" min={0} max={25} step={1} inputMode="numeric" /></label></div> : <>
          <p>Demandez un code au {target} qui a créé le profil. Le même enfant apparaîtra dans vos deux listes.</p>
          <label htmlFor={`${id}-code`}>Code d’association<input id={`${id}-code`} name="code" required maxLength={40} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" /></label></>}
        <div className="child-manager-actions"><button type="submit">{busy ? 'Enregistrement…' : mode === 'create' ? 'Enregistrer cet enfant' : 'Associer cet enfant'}</button><button type="button" onClick={() => setMode('')}>Annuler</button></div>
      </fieldset>
    </form>}
    {error && <p className="child-manager-error" role="alert">{error}</p>}
    {notice && <p className="child-manager-notice" role="status">{notice}</p>}
    {profiles.length ? showList ? <ul className="child-manager-list">{profiles.map(child => <li key={child.id} className={activeChild.id === child.id ? 'is-selected' : ''}>
      <button type="button" className="child-manager-select" aria-pressed={activeChild.id === child.id} onClick={() => { switchChild(child.id); setNotice(`Dossier de ${child.firstName} ouvert.`); }}>
        <ChildAvatar child={child} className="child-manager-avatar" />
        <span><strong>{child.firstName}</strong><small>{child.age === null ? 'Âge non renseigné' : `${child.age} ans`}</small><small>{activeChild.id === child.id ? 'Dossier ouvert' : 'Ouvrir le dossier'}</small></span>
      </button>
      {child.canInvite ? <button type="button" className="child-manager-share" disabled={busy} onClick={() => invite(child)}>Associer un {target}</button> : <span className="child-manager-linked">Profil associé</span>}
    </li>)}</ul> : null : <p className="child-manager-empty">Votre liste est vide. Ajoutez votre premier enfant ou utilisez un code reçu d’un autre adulte.</p>}
    {invitation && <div className="child-manager-invitation" role="status"><h3>Associer {invitation.childName} avec un {target}</h3>
      <p>Transmettez ce code au {target}, qui pourra le saisir dans « Associer avec un code » sur son compte.</p>
      <label htmlFor={`${id}-invite`}>Code à transmettre<input id={`${id}-invite`} readOnly value={invitation.code} onFocus={event => event.target.select()} /></label>
      <div className="child-manager-actions"><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(invitation.code); setNotice('Code copié.'); } catch { setNotice('Sélectionnez le code pour le copier.'); } }}>Copier le code</button><button type="button" onClick={() => setInvitation(null)}>Masquer le code</button></div>
      <p>Valable 24 heures, une seule utilisation. Un nouveau code remplace le précédent.</p>
    </div>}
    <p className="child-manager-footnote">La liste et les associations sont enregistrées sur votre compte. Le suivi, les routines et les observations restent propres à chaque compte dans ce navigateur.</p>
  </section>;
}
export function ChildRosterGate({ children }) {
  const { user } = useAuth();
  const { profiles, childrenLoading, childrenError, refreshChildren } = useBublii();
  if (!childrenError && profiles.length) return children;
  return <div className="adult-dashboard bublii-bg-canvas child-roster-page"><header><Link to="/" aria-label="Boblii, accueil"><Logo size="sm" /></Link><Link to="/connexion">Changer d’espace</Link></header>
    <main>{childrenLoading ? <p role="status">Chargement de vos enfants…</p> : childrenError ? <section className="child-manager"><p role="alert">{childrenError}</p><button type="button" onClick={refreshChildren}>Réessayer</button></section> : <><h1>Bienvenue {user.name}</h1><ChildManager /></>}</main>
  </div>;
}
