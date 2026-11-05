import ParentChildAccess from '../components/ParentChildAccess';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBublii } from '../context/BubliiContext';
import { summarizeHistory } from '../parent/parentMetrics';
import { ParentCollaboration } from '../premium/Collaboration';
import Logo from '../components/Logo';
import ChildAvatar from '../components/ChildAvatar';
import ChildProfile from '../components/ChildProfile';
import ProgressCharts from '../components/ProgressCharts';
import ParentTaskCalendar from '../components/ParentTaskCalendar';
import './ParentDashboard.css';
import './FamilyWorkspace.css';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { activeChild: child, setCurrentRole, updateSettings, inviteForChild } = useBublii();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [message, setMessage] = useState('');
  const view = ['calendar', 'profile', 'settings', 'access'].includes(params.get('view')) ? params.get('view') : 'overview';
  const metrics = summarizeHistory(child.history, 'week');
  const setView = value => setParams(value === 'overview' ? {} : { view: value });
  const openChild = () => { setCurrentRole('enfant'); navigate('/enfant'); };
  return <div className="parent-dashboard adult-dashboard bublii-bg-canvas family-workspace">
    <a href="#parent-main" className="parent-skip">Aller au contenu</a>
    <header className="parent-header"><div className="parent-header-inner"><button type="button" className="parent-brand" onClick={() => navigate('/')} aria-label="Boblii, accueil"><Logo size="sm" /><span className="parent-label">Espace Parent</span></button><span className="family-account">Bonjour {user.name.split(' ')[0]} <span aria-hidden="true">☀</span></span></div></header>
    <main id="parent-main" className="parent-main">
      <section className="family-hero"><div><p className="story-eyebrow">CHAQUE PETIT PAS COMPTE</p><h1>Le monde de {child.firstName}</h1><p>Ses découvertes, son quotidien et ses belles avancées. Tout est ici, pour l’accompagner à son rythme.</p><div className="story-actions"><button type="button" onClick={() => setView('calendar')}>Préparer sa journée →</button><button type="button" onClick={openChild}>Ouvrir son espace de jeux</button></div></div><button type="button" className="family-child-card" onClick={() => setView('profile')}><ChildAvatar child={child} size={92} /><strong>{child.firstName}</strong><span>{child.age} ans</span><small>Voir son profil →</small></button></section>
      <nav className="family-tabs" aria-label="Rubriques parent">{[['overview', 'Vue d’ensemble'], ['calendar', 'Son calendrier'], ['profile', 'Son profil'], ['access', 'Son accès'], ['settings', 'Ses réglages']].map(([value, label]) => <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}</nav>
      {view === 'overview' && <>
        <div className="family-highlight"><span aria-hidden="true">✦</span><div><h2>Une belle semaine pour {child.firstName}</h2><p>{metrics.total} parties terminées et {metrics.practicedDomains} univers explorés. Les petites habitudes font de grandes découvertes.</p></div></div>
        <ProgressCharts child={child} />
        <section className="story-panel"><div className="story-section-heading"><div><p className="story-eyebrow">ON AVANCE ENSEMBLE</p><h2>Ses prochains petits pas</h2></div><button type="button" onClick={() => setView('profile')}>Mieux le connaître →</button></div><div className="family-goals">{child.objectives.map((goal, index) => <article key={goal.id}><span>0{index + 1}</span><h3>{goal.title}</h3><p>{['Observer, essayer, recommencer.', 'Un repère visuel pour chaque étape.', 'Encourager chaque tentative.'][index % 3]}</p></article>)}</div></section>
        <section className="story-panel"><h2>Ses dernières découvertes</h2><ul className="family-recent">{metrics.entries.slice(0, 5).map(entry => <li key={entry.id}><span aria-hidden="true">✓</span><div><h3>{entry.label}</h3><p>{new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'medium', timeStyle: 'short' }).format(entry.completedAt)}</p></div><strong>+{entry.score} ★</strong></li>)}</ul></section>
        <details className="story-panel"><summary>Les échanges avec l’équipe</summary><ParentCollaboration key={child.id} child={child} /></details>
      </>}
      {view === 'access' && <ParentChildAccess key={child.id} child={child} />}
      {view === 'calendar' && <ParentTaskCalendar key={child.id} child={child} />}
      {view === 'profile' && <><ChildProfile key={child.id} child={child} /><section className="story-panel"><h2>Son accompagnement</h2><p>Retrouvez le même profil avec le spécialiste qui accompagne votre enfant.</p>{child.canInvite && <button type="button" onClick={async () => { try { setInvitation(await inviteForChild(child.id)); setMessage(''); } catch (error) { setMessage(error.message); } }}>Associer son spécialiste</button>}{invitation && <p className="family-invitation">Code à transmettre : <strong>{invitation.code}</strong><small>Valable 24 heures, une seule utilisation.</small></p>}{message && <p role="alert">{message}</p>}</section></>}
      {view === 'settings' && <section className="story-panel"><h2>Un espace adapté à {child.firstName}</h2><p>Ajustez ses aides pour qu’il joue avec confiance.</p><div className="family-settings">{[
        ['audio', 'Lecture des consignes', [[true, 'Activée'], [false, 'Désactivée']]], ['answerChoices', 'Nombre de réponses', [[2, '2 choix'], [3, '3 choix'], [4, '4 choix']]], ['hints', 'Indices disponibles', [[1, '1 indice'], [2, '2 indices'], [3, '3 indices']]], ['difficulty', 'Niveau des jeux', [[3, 'Niveau 3'], [4, 'Niveau 4'], [5, 'Niveau 5']]],
      ].map(([key, label, options]) => <label key={key} htmlFor={`parent-${key}`}>{label}<select id={`parent-${key}`} value={String(child.settings[key])} onChange={event => { const value = options.find(([option]) => String(option) === event.target.value)[0]; updateSettings(child.id, { [key]: value }); setMessage('Réglage enregistré.'); }}>{options.map(([value, text]) => <option key={String(value)} value={String(value)}>{text}</option>)}</select></label>)}</div><p role="status">{message}</p></section>}
      <footer className="parent-footer">Boblii · Grandir ensemble, un petit pas à la fois.</footer>
    </main>
  </div>;
}
