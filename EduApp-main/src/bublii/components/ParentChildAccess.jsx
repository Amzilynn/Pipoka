import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChildFaceLogin from './ChildFaceLogin';
import { registerChildAccess } from '../utils/childAccess';
import { readFaces } from '../utils/faceLogin';
import '../screens/LoginScreen.css';

export default function ParentChildAccess({ child }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [camera, setCamera] = useState(false);
  const save = (rotate = false) => {
    try { setCode(registerChildAccess(child, rotate)); setMessage(''); }
    catch { setMessage('Le navigateur empêche l’enregistrement. Autorisez le stockage du site puis réessayez.'); }
  };
  useEffect(() => { save(); }, [child.id, child.firstName, child.age, child.settings]);
  return <section className="story-panel parent-child-access" aria-labelledby="child-access-heading">
    <p className="story-eyebrow">SON ACCÈS</p>
    <h2 id="child-access-heading">Entrer dans l’espace de {child.firstName}</h2>
    <p>Enregistrez son visage une fois. Ensuite, votre enfant regarde la caméra et son espace s’ouvre automatiquement.</p>
    <p>Cet accès fonctionne dans ce navigateur, sur cet appareil. Sur un autre appareil, connectez-vous à votre espace parent pour le préparer.</p>
    <div className="child-access-code"><span>Son code personnel</span><strong>{code ? `${code.slice(0, 4)} ${code.slice(4)}` : 'Indisponible'}</strong><p>Utilisez ce code sur la page enfant pour ouvrir son espace sans caméra.</p><button type="button" onClick={() => save(true)}>Créer un nouveau code</button></div>
    {message && <p role="alert">{message}</p>}
    <div className="story-actions"><button type="button" disabled={!code} onClick={() => setCamera(!camera)}>{camera ? 'Fermer la caméra' : readFaces()[child.id] ? 'Gérer son visage enregistré' : 'Enregistrer son visage'}</button><Link to="/connexion/enfant">Tester son accès enfant →</Link></div>
    {camera && <ChildFaceLogin key={child.id} enrollment />}
  </section>;
}
