import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBublii } from '../context/BubliiContext';
import { summarizeHistory } from '../parent/parentMetrics';
import ChildAvatar from './ChildAvatar';
import ChildManager from './ChildManager';
import ProgressCharts from './ProgressCharts';
import Logo from './Logo';
import '../screens/FamilyWorkspace.css';
export default function SpecialistDirectory() {
  const { user } = useAuth();
  const { profiles, switchChild } = useBublii();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const matches = profiles.filter(child => `${child.firstName} ${child.lastName || ''}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
  return <div className="esms-dashboard adult-dashboard bublii-bg-canvas family-workspace">
    <header className="esms-header"><div className="esms-header-inner"><button type="button" className="esms-brand" onClick={() => navigate('/')} aria-label="Boblii, accueil"><Logo size="sm" /><span>Espace Spécialiste</span></button><span className="family-account">{user.name}</span></div></header>
    <main className="esms-main"><section className="directory-hero"><div><p className="story-eyebrow">UN ACCOMPAGNEMENT POUR CHACUN</p><h1>Les enfants, au cœur de chaque journée.</h1><p>Retrouvez leurs parcours, leurs repères et les petits pas accomplis cette semaine.</p></div><span className="directory-count"><strong>{profiles.length}</strong> enfants accompagnés</span></section>
      <section className="directory-section" aria-labelledby="directory-title"><div className="story-section-heading"><div><p className="story-eyebrow">VOS DOSSIERS</p><h2 id="directory-title">Chaque enfant, son parcours</h2><p>Choisissez un enfant pour ouvrir son profil et son suivi.</p></div><label className="directory-search">Rechercher un enfant<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Prénom ou nom" /></label></div>
        <div className="directory-grid">{matches.map(child => {
          const week = summarizeHistory(child.history, 'week');
          const discovered = Object.values(child.moduleProgress).reduce((total, progress) => total + progress.completedCount, 0);
          return <button type="button" className="directory-card" key={child.id} aria-label={`Ouvrir le dossier de ${child.firstName}`} onClick={() => { switchChild(child.id); navigate(`/specialiste?child=${child.id}`); }}>
            <div className="directory-card-top"><ChildAvatar child={child} size={70} /><span className="directory-status">Suivi actif</span></div><h3>{child.firstName} {child.lastName}</h3><p>{child.age} ans</p>
            <div className="directory-tags">{child.strengths.slice(0, 2).map((strength, index) => <span key={index}>{strength}</span>)}</div>
            <div className="directory-card-stats"><span><strong>{week.total}</strong> parties cette semaine</span><span><strong>{discovered}/16</strong> jeux découverts</span></div>
            <div className="directory-mini-bars" aria-hidden="true">{week.days.map(day => <span key={day.key} style={{ height: `${Math.max(8, day.count / Math.max(1, ...week.days.map(item => item.count)) * 100)}%` }} />)}</div><span className="directory-open">Ouvrir son profil <span aria-hidden="true">→</span></span>
          </button>;
        })}</div>{!matches.length && <p>Aucun enfant ne correspond à cette recherche.</p>}
      </section>
      <ProgressCharts profiles={profiles} />
      <details className="story-panel"><summary>Ajouter ou associer un enfant</summary><ChildManager showList={false} /></details>
      <footer className="esms-footer">Boblii · Observer, comprendre, accompagner.</footer>
    </main>
  </div>;
}
