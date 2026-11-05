import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { DayExample } from './CalendarShortcut';

function savedPreference(key) {
  try { return localStorage.getItem(key) === 'true'; } catch { return false; }
}

export default function ChildCalendarView({ child, selected, tasks, currentTask, currentStep, loading, busy, error,
  dateKey, pictureSrc, pictureFor, verified, onSelectDay, onSelectTask, renderStep, voice, camera }) {
  const [largeText, setLargeText] = useState(() => savedPreference('calendar-large-text'));
  const [showSteps, setShowSteps] = useState(() => savedPreference('calendar-show-steps'));
  useEffect(() => {
    try {
      localStorage.setItem('calendar-large-text', String(largeText));
      localStorage.setItem('calendar-show-steps', String(showSteps));
    } catch { /* Preferences still work when storage is unavailable. */ }
  }, [largeText, showSteps]);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const completed = tasks.filter(task => task.steps.every(verified)).length;
  const currentIndex = currentTask?.steps.findIndex(step => step.id === currentStep?.id) ?? -1;
  const isOtherDay = ![dateKey(today), dateKey(tomorrow)].includes(selected);
  return <div className={`task-calendar child-calendar ${largeText ? 'child-calendar-large' : ''}`}>
    <header className="calendar-topbar"><div className="calendar-topbar-inner">
      <Link className="calendar-button" to="/enfant" aria-label="Retour à mon espace">← <span>Mon espace</span></Link>
      <Logo size="sm" /><span className="child-calendar-name">{child.firstName}</span>
    </div></header>
    <main className="child-calendar-main">
      <div className="child-calendar-heading"><div><h1>Ma journée</h1>
        <p>{new Date(`${selected}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>{!loading && tasks.length > 0 && <p className="child-calendar-progress">{completed} / {tasks.length} activités terminées</p>}</div>
      <nav className="child-calendar-days" aria-label="Choisir une journée">
        <button type="button" aria-pressed={selected === dateKey(today)} disabled={busy} onClick={() => onSelectDay(today)}>Aujourd’hui</button>
        <button type="button" aria-pressed={selected === dateKey(tomorrow)} disabled={busy} onClick={() => onSelectDay(tomorrow)}>Demain</button>
        <details className="child-calendar-other-day"><summary>Autre jour</summary>
          <label>Choisir une date<input type="date" value={selected} disabled={busy} onChange={event => {
            if (/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)) onSelectDay(new Date(`${event.target.value}T12:00:00`));
          }} /></label>
          {isOtherDay && <button className="calendar-button" type="button" disabled={busy} onClick={() => onSelectDay(today)}>Revenir à aujourd’hui</button>}
        </details>
      </nav>
      {error && <p className="calendar-error" role="alert">{error}</p>}
      {loading ? <p role="status">Chargement…</p> : !tasks.length ?
        <section className="calendar-panel child-calendar-empty"><img src="/assets/images/grow/coussin.svg" alt="" />
          <h2>Une journée toute tranquille</h2><p>Pas d’activité prévue pour ce jour.</p><p>Ton parent peut préparer ta journée.</p>
        </section> : <div className="child-calendar-content">
          <aside className="child-calendar-plan" aria-label="Mes activités"><h2>Mes activités</h2>
            <ol>{tasks.map(task => {
              const done = task.steps.every(verified);
              const chosen = currentTask?.id === task.id;
              return <li key={task.id}><button type="button" className={`child-calendar-task ${chosen ? 'selected' : ''}`}
                aria-current={chosen ? 'step' : undefined} disabled={busy || done} onClick={() => onSelectTask(task.id)}>
                <img className="calendar-activity-picture" src={pictureSrc(pictureFor(task))} alt="" />
                <span><small>{done ? '✓ Terminé' : chosen ? 'Maintenant' : 'À suivre'}{task.time && ` · ${task.time}`}</small><strong>{task.title}</strong></span>
              </button></li>;
            })}</ol>
          </aside>
          <section className="child-calendar-focus" aria-label="Mon activité" aria-busy={busy}>
            {currentTask && currentStep ? <article className="calendar-panel calendar-mission">
              <p className="child-calendar-now">Maintenant{currentTask.time && ` · ${currentTask.time}`}</p>
              <h2>{currentTask.title}</h2>
              <p className="child-calendar-step-count">Étape {currentIndex + 1} sur {currentTask.steps.length}</p>
              <ol>{renderStep(currentTask, currentStep, currentIndex)}</ol>
              {showSteps && <section className="child-calendar-overview" aria-label="Toutes les étapes"><h3>Mes étapes</h3><ol>{currentTask.steps.map((step, index) =>
                <li key={step.id} aria-current={currentIndex === index ? 'step' : undefined}><span>{verified(step) ? '✓' : index + 1}</span><span>{step.title}</span></li>
              )}</ol></section>}
            </article> : <section className="calendar-panel child-calendar-finished" role="status"><span aria-hidden="true">✓</span><h2>Bravo !</h2><p>Tu as terminé tes activités.</p></section>}
          </section>
        </div>}
      <div className="child-calendar-extras">
        <details className="child-calendar-disclosure"><summary>Voir un exemple en photos</summary><DayExample /></details>
        <details className="child-calendar-disclosure"><summary>Adapter l’affichage</summary>
          <div className="child-calendar-settings">
            <button type="button" className="calendar-button" aria-pressed={largeText} onClick={() => setLargeText(value => !value)}>Texte plus grand {largeText ? '✓' : ''}</button>
            <button type="button" className="calendar-button" aria-pressed={showSteps} onClick={() => setShowSteps(value => !value)}>Voir toutes les étapes {showSteps ? '✓' : ''}</button>
          </div>
        </details>
        <details className="child-calendar-disclosure"><summary>Aide et informations</summary>
          <div className="child-calendar-settings"><button type="button" className="calendar-button" disabled={busy || !voice.supported} aria-pressed={voice.listening} onClick={voice.listen}>{voice.listening ? 'Arrêter le micro' : 'Parler'}</button>
            <p>Dis « aide », « photo », « aujourd’hui » ou « demain ».</p>
            {!voice.supported && <p>Le micro est indisponible. Utilise les boutons.</p>}
            <p>Les activités et les photos sont enregistrées dans ce navigateur. Le micro peut utiliser le service vocal du navigateur.</p>
          </div>
        </details>
      </div>
      {voice.message && <p className="child-calendar-voice-message" role="status">{voice.message}</p>}
    </main>
    {camera}
  </div>;
}
