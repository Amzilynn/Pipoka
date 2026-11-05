import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import { summarizeHistory } from '../parent/parentMetrics';
import './ParentDashboard.css';
import { ParentCollaboration } from '../premium/Collaboration';
import { RoutineManager } from '../premium/Routines.jsx';

const DOMAINS = [
  { id: 'learn', name: 'Apprendre', detail: 'Mots, nombres et logique', icon: '📚', color: '#2A6FB5' },
  { id: 'communicate', name: 'Communiquer', detail: 'Émotions et expression', icon: '💬', color: '#B83838' },
  { id: 'move', name: 'Bouger', detail: 'Gestes et repères corporels', icon: '🌿', color: '#187653' },
  { id: 'grow', name: 'Grandir', detail: 'Routines du quotidien', icon: '☀️', color: '#956016' },
];

const SETTINGS = [
  { key: 'answerChoices', label: 'Réponses proposées', help: 'Nombre de choix affichés dans les jeux compatibles.', values: [[2, '2 choix'], [3, '3 choix'], [4, '4 choix']] },
  { key: 'audio', label: 'Lecture des consignes', help: 'Une aide sonore pour accompagner les consignes.', values: [[true, 'Activée'], [false, 'Désactivée']] },
  { key: 'hints', label: 'Indices disponibles', help: 'Nombre maximal d’indices dans les jeux compatibles.', values: [[1, '1 indice'], [2, '2 indices'], [3, '3 indices']] },
  { key: 'difficulty', label: 'Difficulté du jeu', help: 'Un réglage du jeu, sans correspondance avec un âge de développement.', values: [[3, 'Niveau 3'], [4, 'Niveau 4'], [5, 'Niveau 5']] },
];

const dateLabel = (date) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
}).format(date);

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { activeChild, profiles, switchChild, updateSettings, setCurrentRole } = useBublii();
  const [period, setPeriod] = useState('all');
  const [notice, setNotice] = useState('');
  useEffect(() => { setNotice(''); }, [activeChild.id]);

  const metrics = summarizeHistory(activeChild.history, period);
  const maxDay = Math.max(1, ...metrics.days.map((day) => day.count));
  const openChild = () => { setCurrentRole('enfant'); navigate('/enfant'); };
  const exit = () => { setCurrentRole(null); navigate('/'); };

  return (
    <div className="parent-dashboard">
      <a href="#parent-main" className="parent-skip">Aller au contenu</a>
      <header className="parent-header">
        <div className="parent-header-inner">
          <button type="button" className="parent-brand" onClick={exit} aria-label="Boblii, choisir un espace">
            <span className="parent-brand-dots" aria-hidden="true"><i /><i /><i /><i /></span>
            Boblii <span className="parent-label">Espace Parent</span>
          </button>
          <button type="button" className="parent-button parent-button-quiet" onClick={exit}>← Changer d’espace</button>
        </div>
      </header>

      <main id="parent-main" className="parent-main">
        <div className="parent-welcome">
          <div><p className="parent-eyebrow">LES PETITS PAS COMPTENT</p><h1>Le parcours de {activeChild.firstName}</h1>
            <p>Un regard sur ses activités, à son rythme.</p></div>
          <button type="button" className="parent-button parent-button-primary" onClick={openChild}>Ouvrir l’espace enfant <span aria-hidden="true">↗</span></button>
        </div>

        <section className="parent-profile parent-panel" aria-labelledby="parent-profile-title">
          <div className="parent-profile-heading">
            <div className="parent-identity">
              <span className="parent-avatar" style={{ background: activeChild.avatar.bg, color: activeChild.avatar.color }} aria-hidden="true">{activeChild.avatar.initial}</span>
              <div><h2 id="parent-profile-title">{activeChild.firstName} <span className="parent-age">{activeChild.age} ans</span></h2><p>{activeChild.tagline}</p></div>
            </div>
            <div className="parent-demo-picker"><span className="parent-pill">Démonstration</span><div className="parent-child-picker" role="group" aria-label="Changer de profil de démonstration">
              {profiles.map((child) => <button key={child.id} type="button" aria-pressed={child.id === activeChild.id} onClick={() => switchChild(child.id)}>{child.firstName}</button>)}
            </div></div>
          </div>
          <div className="parent-profile-notes">
            <div><h3>Ses points d’appui</h3><div className="parent-tags">{activeChild.strengths.map((item) => <span key={item}>{item}</span>)}</div></div>
            <div><h3>Pour l’accompagner</h3><p>{activeChild.supportNeeds.join(' · ')}</p></div>
          </div>
        </section>

        <section aria-labelledby="parent-overview-title">
          <div className="parent-section-heading">
            <div><p className="parent-eyebrow">DANS BOBLII</p><h2 id="parent-overview-title">Ses activités en un regard</h2></div>
            <label className="parent-period">Période
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option value="all">Depuis le début</option><option value="week">Les 7 derniers jours</option>
              </select>
            </label>
          </div>
          <p className="parent-caption parent-scope">Ses découvertes et ses jeux préférés, à retrouver au fil des jours.</p>
          <div className="parent-stats">
            {[
              ['Parties terminées', metrics.total, 'Une activité rejouée compte comme une nouvelle partie.'],
              ['Activités différentes', metrics.unique, 'Les répétitions d’un même jeu ne sont comptées qu’une fois.'],
              ['Domaines pratiqués', `${metrics.practicedDomains} / 4`, 'Apprendre, Communiquer, Bouger et Grandir.'],
            ].map(([label, value, help]) => <div className="parent-stat parent-panel" key={label}><h3>{label}</h3><p className="parent-stat-number">{value}</p><p>{help}</p></div>)}
          </div>
          {metrics.total === 0 && <div className="parent-empty"><span aria-hidden="true">🌱</span><div><h3>Le suivi attend ses premiers petits pas</h3><p>Aucune partie enregistrée pour cette période. Terminez un jeu puis validez son écran de fin pour le retrouver ici.</p></div><button type="button" className="parent-button" onClick={openChild}>Choisir une activité</button></div>}
        </section>

        <div className="parent-two-columns">
          <section className="parent-panel" aria-labelledby="parent-domains-title">
            <h2 id="parent-domains-title">Son parcours de découverte</h2><p className="parent-description">Les activités terminées depuis le début. Chaque jeu peut être refait à volonté.</p>
            <ul className="parent-domain-list">
              {DOMAINS.map((domain) => {
                const summary = metrics.domains.find((item) => item.id === domain.id);
                const progress = activeChild.moduleProgress[domain.id];
                return <li key={domain.id} style={{ '--domain-color': domain.color }}>
                  <div className="parent-domain-heading"><span className="parent-domain-icon" aria-hidden="true">{domain.icon}</span><div><h3>{domain.name}</h3><p>{domain.detail}</p></div><strong>{progress.completedCount} / {progress.totalActivities}</strong></div>
                  <div className="parent-track" role="progressbar" aria-label={`${domain.name} : activités découvertes`} aria-valuemin={0} aria-valuemax={progress.totalActivities} aria-valuenow={progress.completedCount}><span style={{ width: `${progress.completedCount / progress.totalActivities * 100}%`, background: domain.color }} /></div>
                  <p className="parent-caption">{summary.count} partie{summary.count > 1 ? 's' : ''} sur la période{progress.completedCount === progress.totalActivities ? ' · Tous les jeux découverts !' : ''}</p>
                </li>;
              })}
            </ul>
          </section>

          <section className="parent-panel" aria-labelledby="parent-chart-title">
            <h2 id="parent-chart-title">La pratique au fil des jours</h2><p className="parent-description">Ses parties terminées ces 7 derniers jours.</p>
            {metrics.days.some((day) => day.count > 0) ? <>
              <div className="parent-chart" aria-hidden="true">
                {metrics.days.map((day) => <div className="parent-chart-column" key={day.key}>
                  <strong>{day.count}</strong><div className="parent-chart-track"><span style={{ height: `${day.count / maxDay * 100}%` }} /></div>
                  <span>{new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short' }).format(day.date)}</span><small>{day.date.getUTCDate()}</small>
                </div>)}
              </div>
              <table className="parent-visually-hidden"><caption>Parties enregistrées au fil des jours</caption><thead><tr><th scope="col">Date</th><th scope="col">Parties</th></tr></thead><tbody>{metrics.days.map((day) => <tr key={day.key}><th scope="row">{new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full' }).format(day.date)}</th><td>{day.count}</td></tr>)}</tbody></table>
            </> : <div className="parent-chart-empty"><p>Pas encore de parties enregistrées ces 7 derniers jours.</p><p>Le graphique apparaîtra après une activité terminée.</p></div>}
          </section>
        </div>

        <section className="parent-panel" aria-labelledby="parent-history-title">
          <div className="parent-section-heading"><div><h2 id="parent-history-title">Les dernières parties</h2><p className="parent-description">Ses 6 dernières parties sur la période choisie.</p></div><span className="parent-pill">{metrics.total} partie{metrics.total > 1 ? 's' : ''}</span></div>
          {metrics.entries.length ? <ul className="parent-history">{metrics.entries.slice(0, 6).map((entry, index) => <li key={`${entry.id}-${index}`}>
            <div><h3>{entry.label || 'Activité terminée'}</h3><p>{DOMAINS.find((domain) => domain.id === entry.module)?.name || 'Autre activité'} · <time dateTime={entry.completedAt.toISOString()}>{dateLabel(entry.completedAt)}</time>{entry.source === 'demo' && <span className="parent-example-label">Exemple</span>}</p></div>
            <div className="parent-result"><span>Partie terminée</span><strong>✓</strong></div>
          </li>)}</ul> : <p className="parent-no-data">Aucun résultat enregistré pour cette période.</p>}
        </section>

        <section className="parent-panel" aria-labelledby="parent-goals-title">
          <div className="parent-section-heading"><div><p className="parent-eyebrow">DES REPÈRES INDIVIDUELS</p><h2 id="parent-goals-title">Ses objectifs d’accompagnement</h2></div></div>
          <p className="parent-description">Des pistes pour accompagner {activeChild.firstName} dans son quotidien.</p>
          <ul className="parent-goals">{(activeChild.objectives || []).map((goal, index) => <li key={goal.id}><span className="parent-goal-number" aria-hidden="true">{index + 1}</span><div><h3>{goal.title}</h3><p>{DOMAINS.find((domain) => domain.id === goal.module)?.name || 'Objectif individuel'}</p></div></li>)}</ul>
          {!activeChild.objectives?.length && <p className="parent-no-data">Aucun objectif renseigné pour cet enfant.</p>}
        </section>

        <RoutineManager key={`routines-${activeChild.id}`} child={activeChild} author="parent" />
        <ParentCollaboration key={`family-${activeChild.id}`} child={activeChild} />

        <details className="parent-panel parent-settings" key={activeChild.id}>
          <summary>Adapter les activités de {activeChild.firstName}<span>Choix, audio et aides</span></summary>
          <p className="parent-description">Personnalisez les aides proposées à {activeChild.firstName} dans les jeux compatibles.</p>
          <div className="parent-settings-grid">{SETTINGS.map((setting) => <div key={setting.key}>
            <label htmlFor={`parent-${setting.key}`}>{setting.label}</label>
            <select id={`parent-${setting.key}`} aria-describedby={`parent-${setting.key}-help`} value={String(activeChild.settings[setting.key])} onChange={(event) => {
              const [value, label] = setting.values.find(([option]) => String(option) === event.target.value);
              updateSettings(activeChild.id, { [setting.key]: value });
              setNotice(`${setting.label} : ${label}. Réglage enregistré pour ${activeChild.firstName}.`);
            }}>{setting.values.map(([value, label]) => <option key={String(value)} value={String(value)}>{label}</option>)}</select>
            <p id={`parent-${setting.key}-help`}>{setting.help}</p>
          </div>)}</div>
          <p className="parent-save-status" role="status">{notice}</p>
        </details>

        <details className="parent-panel parent-method">
          <summary>Comprendre les informations affichées</summary>
          <p>Ce tableau de bord décrit les activités de {activeChild.firstName} dans Boblii, sans comparaison avec d’autres enfants et sans score médical.</p>
          <p>La démonstration contient des parcours d’exemple. Les parties marquées « Exemple » sont fictives ; vos nouvelles parties s’y ajoutent. Les barres comptent les activités différentes terminées, sans évaluer la maîtrise des compétences. Les objectifs du profil sont également des exemples.</p>
          <p>Le parcours et les réglages sont conservés dans ce navigateur, même après fermeture. Ils ne sont pas liés à un compte en ligne et ne passent pas d’un appareil à un autre. Effacer les données du navigateur efface aussi ce suivi.</p>
          <p>Les recommandations ci-dessous soutiennent un accompagnement individualisé et des aides adaptées. Les cinq repères de ce tableau sont des choix de conception ; ils ne constituent pas une échelle d’évaluation validée.</p>
          <ul><li><a href="https://ds-int.org/recommendations-for-the-education-of-learners-with-down-syndrome/" target="_blank" rel="noreferrer">Down Syndrome International — recommandations pour l’éducation (2020)</a></li><li><a href="https://www.has-sante.fr/jcms/p_3148883/en/trisomie-21" target="_blank" rel="noreferrer">PNDS Trisomie 21 — hébergé sur le site de la HAS</a></li></ul>
          <p>Le PNDS a été élaboré par le centre de référence selon une méthodologie proposée par la HAS ; il n’a pas été validé par la HAS.</p>
        </details>
        <footer className="parent-footer">Boblii · Chaque enfant avance à son rythme.</footer>
      </main>
    </div>
  );
}
