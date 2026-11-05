import React, { useId, useState } from 'react';
import { useBublii } from '../context/BubliiContext';
import { prepareProfilePhoto } from '../utils/profilePhoto';
import ChildAvatar from './ChildAvatar';
import './ChildProfile.css';

const fields = [
  ['behavior', 'Comportement observé', 'Par exemple : prend son temps pour rejoindre une activité de groupe.', 2000],
  ['communication', 'Sa façon de communiquer', 'Mots, gestes, images ou autres moyens qui l’aident à s’exprimer.', 1000],
  ['interests', 'Ce qu’il aime', 'Jeux, activités, sujets ou objets préférés.', 1000],
  ['calmingStrategies', 'Ce qui l’apaise', 'Repères, pauses ou gestes qui l’aident à se sentir bien.', 1000],
  ['notes', 'Autres informations utiles', 'Habitudes et repères pour l’accompagner au quotidien.', 2000],
];
function ProfileEditor({ child, onCancel, onSaved }) {
  const { updateChildProfile } = useBublii();
  const id = useId();
  const [draft, setDraft] = useState(() => ({ ...child, strengths: child.strengths.join('\n'), supportNeeds: child.supportNeeds.join('\n') }));
  const [photo, setPhoto] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const change = event => setDraft(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const preview = photo === undefined ? child.photoUrl : photo;
  async function selectPhoto(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setReadingPhoto(true); setError('');
    try { setPhoto(await prepareProfilePhoto(file)); }
    catch (problem) { setError(problem.message); }
    finally { setReadingPhoto(false); }
  }
  async function save(event) {
    event.preventDefault();
    if (busy || readingPhoto) return;
    setBusy(true); setError('');
    const values = { firstName: draft.firstName, lastName: draft.lastName || '', age: draft.age === '' || draft.age === null ? null : Number(draft.age), revision: draft.revision || 0,
      strengths: draft.strengths.split('\n').map(value => value.trim()).filter(Boolean), supportNeeds: draft.supportNeeds.split('\n').map(value => value.trim()).filter(Boolean), ...Object.fromEntries(fields.map(([key]) => [key, draft[key] || ''])), ...(photo !== undefined ? { photo } : {}) };
    try { await updateChildProfile(child.id, values); onSaved(); }
    catch (problem) { setError(problem.message); setBusy(false); }
  }
  return <form className="child-profile-editor" onSubmit={save}>
    <fieldset disabled={busy || readingPhoto}>
      <legend>Modifier le profil de {child.firstName}</legend>
      <div className="child-profile-photo-editor">
        <ChildAvatar child={{ ...child, photoUrl: preview }} size={112} decorative={false} />
        <div><label htmlFor={`${id}-photo`}>Photo de l’enfant<input id={`${id}-photo`} type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} /></label>
          <p>JPEG, PNG ou WebP, 5 Mo maximum.</p>{preview && <button type="button" onClick={() => setPhoto(null)}>Retirer la photo</button>}</div>
      </div>
      <div className="child-profile-fields">
        <label htmlFor={`${id}-firstName`}>Prénom<input id={`${id}-firstName`} name="firstName" value={draft.firstName} onChange={change} required maxLength={60} /></label>
        <label htmlFor={`${id}-lastName`}>Nom (facultatif)<input id={`${id}-lastName`} name="lastName" value={draft.lastName || ''} onChange={change} maxLength={60} /></label>
        <label htmlFor={`${id}-age`}>Âge (facultatif)<input id={`${id}-age`} name="age" value={draft.age ?? ''} onChange={change} type="number" min={0} max={25} step={1} /></label>
      </div>
      <div className="child-profile-fields child-profile-fields-two">
        <label htmlFor={`${id}-strengths`}>Ses points d’appui<textarea id={`${id}-strengths`} aria-label="Ses points d’appui" name="strengths" value={draft.strengths} onChange={change} rows={3} placeholder="Décrivez librement ses forces et ce qui l’aide." /></label>
        <label htmlFor={`${id}-supportNeeds`}>Ses besoins d’accompagnement<textarea id={`${id}-supportNeeds`} aria-label="Ses besoins d’accompagnement" name="supportNeeds" value={draft.supportNeeds} onChange={change} rows={3} placeholder="Décrivez librement ses besoins et les aides utiles." /></label>
        {fields.map(([key, label, placeholder, max]) => <label key={key} htmlFor={`${id}-${key}`}>{label}<textarea id={`${id}-${key}`} aria-label={label} name={key} value={draft[key] || ''} onChange={change} rows={3} maxLength={max} placeholder={placeholder} /></label>)}
      </div>
      <p className="child-profile-shared-note">Ces informations et cette photo sont visibles par les adultes associés à cet enfant. Décrivez des faits et les aides utiles.</p>
      <div className="child-profile-actions"><button type="submit">{busy ? 'Enregistrement…' : 'Enregistrer le profil'}</button><button type="button" onClick={onCancel}>Annuler</button></div>
    </fieldset>
    {readingPhoto && <p role="status">Préparation de la photo…</p>}
    {error && <p className="child-manager-error" role="alert">{error}</p>}
  </form>;
}
export default function ChildProfile({ child }) {
  const { refreshChildren, childrenLoading } = useBublii();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const id = useId();
  return <section className="child-profile" aria-labelledby={`${id}-title`}>
    <div className="child-profile-heading"><div><p className="child-manager-eyebrow">POUR MIEUX L’ACCOMPAGNER</p><h2 id={`${id}-title`}>Profil de {child.firstName}</h2></div>
      {!editing && <div className="child-profile-actions"><button type="button" disabled={childrenLoading} onClick={() => { setNotice(''); setEditing(true); }}>Modifier le profil</button><button type="button" disabled={childrenLoading} onClick={() => refreshChildren()}>Actualiser le profil</button></div>}
    </div>
    {childrenLoading && <p role="status">Actualisation du profil…</p>}
    {notice && <p className="child-manager-notice" role="status">{notice}</p>}
    {editing ? <ProfileEditor child={child} onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); setNotice('Profil enregistré et disponible pour les adultes associés.'); }} /> : <>
      <div className="child-profile-identity"><ChildAvatar child={child} size={112} decorative={false} /><div><h3>{child.firstName} {child.lastName}</h3><p>{child.age === null ? 'Âge non renseigné' : `${child.age} ans`}</p><p className="child-profile-shared-note">Profil partagé avec les adultes associés.</p></div></div>
      <div className="child-profile-details">
        <article><h3>Ses points d’appui</h3>{child.strengths.length ? <ul>{child.strengths.map((text, index) => <li key={index}>{text}</li>)}</ul> : <p className="child-profile-empty">À compléter</p>}</article>
        <article><h3>Ses besoins d’accompagnement</h3>{child.supportNeeds.length ? <ul>{child.supportNeeds.map((text, index) => <li key={index}>{text}</li>)}</ul> : <p className="child-profile-empty">À compléter</p>}</article>
        {fields.map(([key, label]) => <article key={key}><h3>{label}</h3><p className={child[key] ? '' : 'child-profile-empty'}>{child[key] || 'À compléter'}</p></article>)}
      </div>
      {child.updatedAt && <p className="child-profile-updated">Mis à jour le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(child.updatedAt))}</p>}
    </>}
  </section>;
}
