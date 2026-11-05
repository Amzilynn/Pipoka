import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutines } from '../premium/Routines.jsx';
import { makeRoutine, routineDay, routineKey, routinesOn } from '../premium/routines';
import { useBublii } from '../context/BubliiContext';
import './ParentTaskCalendar.css';

const dayDate = value => new Date(`${value}T12:00:00Z`);
function shiftDay(value, offset) {
  const day = dayDate(value);
  day.setUTCDate(day.getUTCDate() + offset);
  return day.toISOString().slice(0, 10);
}
const formatDate = (value, options) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', ...options }).format(dayDate(value));

export default function ParentTaskCalendar({ child }) {
  const { data, commit, error } = useRoutines();
  const { setCurrentRole } = useBublii();
  const navigate = useNavigate();
  const [date, setDate] = useState(routineDay());
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const titleInput = useRef(null);
  useEffect(() => { if (editing) titleInput.current?.focus(); }, [editing]);
  const today = routineDay();
  const items = routinesOn(data.routines, child.id, date).sort((a, b) => (a.time || '24:00').localeCompare(b.time || '24:00'));
  const countFor = item => Math.min(data.progress[routineKey(item, date)] || 0, item.steps.length);
  const completed = items.filter(item => countFor(item) === item.steps.length).length;
  const totalSteps = items.reduce((sum, item) => sum + item.steps.length, 0);
  const finishedSteps = items.reduce((sum, item) => sum + countFor(item), 0);
  const visible = items.filter(item => filter === 'all' || (filter === 'done' ? countFor(item) === item.steps.length : countFor(item) < item.steps.length));
  const monday = shiftDay(date, -((dayDate(date).getUTCDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, index) => shiftDay(monday, index));
  const changeDate = value => { if (value) { setDate(value); setEditing(null); setMessage(''); } };
  function save(event) {
    event.preventDefault();
    const input = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const task = { ...makeRoutine({ ...input, icon: input.icon || '⭐', repeat: input.repeat === 'on' ? 'daily' : 'once' }, child.id, 'parent', editing.id ? editing : undefined), time: input.time || '' };
      commit(old => ({ ...old, routines: editing.id ? old.routines.map(item => item.id === editing.id ? task : item) : [...old.routines, task] }));
      setEditing(null); setFilter('all'); setMessage('Tâche enregistrée dans le calendrier de votre enfant.');
    } catch (problem) { setMessage(problem.message); }
  }
  return <section className="story-panel task-calendar" aria-labelledby="task-calendar-heading">
    <div className="story-section-heading task-calendar-heading"><div><p className="story-eyebrow">SON QUOTIDIEN, PAS À PAS</p><h2 id="task-calendar-heading">Le calendrier de {child.firstName}</h2><p>Une journée à son rythme, une petite étape à la fois.</p></div><div className="story-actions"><button className="task-add" type="button" onClick={() => { setEditing({}); setMessage(''); }}>+ Ajouter une tâche</button></div></div>
    <div className="task-calendar-toolbar">
      <div className="task-week-navigation"><button type="button" aria-label="Semaine précédente" onClick={() => changeDate(shiftDay(date, -7))}>←</button><p>{formatDate(monday, { day: 'numeric', month: 'short' })} — {formatDate(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}</p><button type="button" aria-label="Semaine suivante" onClick={() => changeDate(shiftDay(date, 7))}>→</button></div>
      <div className="task-date-controls"><button type="button" onClick={() => changeDate(today)}>Aujourd’hui</button><label className="task-date-label"><span className="story-visually-hidden">Choisir une date</span><input aria-label="Choisir une date" type="date" value={date} onChange={event => changeDate(event.target.value)} /></label></div>
    </div>
    <div className="task-week" role="group" aria-label="Jours de la semaine">{days.map(day => {
      const scheduled = routinesOn(data.routines, child.id, day).length;
      return <button key={day} type="button" aria-pressed={day === date} aria-current={day === today ? 'date' : undefined} aria-label={`${formatDate(day, { dateStyle: 'full' })}, ${scheduled} tâche${scheduled > 1 ? 's' : ''}`} onClick={() => changeDate(day)}><small>{formatDate(day, { weekday: 'short' })}</small><strong>{Number(day.slice(-2))}</strong><span className="task-day-count">{scheduled ? `${scheduled} tâche${scheduled > 1 ? 's' : ''}` : 'Libre'}</span></button>;
    })}</div>
    <div className="task-day-summary"><div><p className="story-eyebrow">{date === today ? 'AUJOURD’HUI' : 'LA JOURNÉE PRÉVUE'}</p><h3>{formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</h3><p>{items.length ? `${completed} sur ${items.length} tâches terminées · ${finishedSteps} sur ${totalSteps} étapes` : 'Une journée à imaginer ensemble.'}</p></div><div className="task-day-total"><strong>{completed}<span> / {items.length}</span></strong><span>tâches terminées</span></div></div>
    {error && <p className="task-notice" role="alert">{error}</p>}
    <p className={message ? 'task-notice' : 'story-visually-hidden'} role="status" aria-live="polite">{message}</p>
    {editing && <form className="task-editor" key={editing.id || 'new'} onSubmit={save} aria-label={editing.id ? 'Modifier la tâche' : 'Ajouter une tâche'}><h3>{editing.id ? 'Modifier la tâche' : 'Une nouvelle tâche pour ' + child.firstName}</h3><div className="task-form-grid"><label>Titre de la tâche<input ref={titleInput} name="title" required maxLength={100} defaultValue={editing.title || ''} placeholder="Préparer mes affaires de piscine" /></label><label>Heure, facultative<input name="time" type="time" defaultValue={editing.time || ''} /></label><label>Repère visuel<select name="icon" defaultValue={editing.icon || '⭐'}><option value="⭐">⭐ Étoile</option><option value="🎒">🎒 Sac</option><option value="☀️">☀️ Matin</option><option value="🌙">🌙 Soir</option><option value="🪥">🪥 Dents</option></select></label></div><label>Date prévue<input name="date" type="date" required defaultValue={editing.date || date} /></label><label>Les petites étapes<textarea name="steps" rows={4} required aria-describedby="task-steps-help" defaultValue={editing.steps?.join('\n') || ''} placeholder={'Je prends ma serviette.\nJe mets mon maillot dans mon sac.\nJe prends ma gourde.'} /></label><p id="task-steps-help">Une consigne courte par ligne, de 1 à 15 étapes.</p><label className="task-repeat"><input name="repeat" type="checkbox" defaultChecked={editing.repeat === 'daily'} />Répéter chaque jour</label>{editing.id && <p>Enregistrer une modification remet le suivi de cette tâche à zéro.</p>}<div className="story-actions"><button type="submit">Enregistrer la tâche</button><button type="button" onClick={() => setEditing(null)}>Annuler</button></div></form>}
    <div className="task-list-heading"><h3>Ses petites missions <span>({items.length})</span></h3><div className="task-filters" role="group" aria-label="Filtrer les tâches">{[['all', 'Toutes'], ['pending', 'À faire'], ['done', 'Terminées']].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
    <ul className="task-list">{visible.map(item => {
      const count = countFor(item), done = count === item.steps.length;
      return <li className={done ? 'task-card is-complete' : 'task-card'} key={item.id}>
        <div className="task-time"><span>{item.time || 'À son rythme'}</span><small>{item.repeat === 'daily' ? 'Chaque jour' : 'Ce jour'}</small></div>
        <span className={`task-icon ${done ? 'task-complete' : ''}`} aria-hidden="true">{done ? '✓' : item.icon}</span>
        <div className="task-copy"><div className="task-title"><h3>{item.title}</h3><span className={`task-status ${done ? 'is-done' : count ? 'is-started' : ''}`}>{done ? 'Terminée' : count ? 'En cours' : 'À faire'}</span></div><p>{done ? 'Toutes les étapes sont terminées' : `${count} sur ${item.steps.length} étapes terminées`}</p><div className="task-progress" role="progressbar" aria-label={`Étapes de ${item.title}`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={item.steps.length}><span style={{ width: `${count / item.steps.length * 100}%` }} /></div><details className="task-steps"><summary>Voir les {item.steps.length} étapes</summary><ol>{item.steps.map((step, index) => <li className={index < count ? 'is-checked' : ''} key={index}><span className="task-step-number" aria-hidden="true">{index < count ? '✓' : index + 1}</span><span>{step}{index < count && <span className="story-visually-hidden"> — terminée</span>}</span></li>)}</ol></details></div><button type="button" className="task-edit" onClick={() => { setEditing(item); setMessage(''); }} aria-label={`Modifier ${item.title}`}>Modifier</button>
      </li>;
    })}</ul>
    {!visible.length && <div className="task-empty"><span aria-hidden="true">{items.length ? '✓' : '☀️'}</span><h3>{!items.length ? 'De la place pour ses petits pas' : filter === 'done' ? 'Chaque petit pas compte' : 'Tout est terminé pour cette journée'}</h3><p>{!items.length ? 'Ajoutez une première tâche avec des étapes simples pour préparer sa journée.' : filter === 'done' ? 'Les tâches terminées apparaîtront ici au fil de la journée.' : 'Retrouvez toutes ses petites victoires dans les tâches terminées.'}</p>{!items.length && <div className="story-actions"><button type="button" onClick={() => { setEditing({}); setMessage(''); }}>+ Ajouter sa première tâche</button></div>}</div>}
    <div className="task-calendar-footer"><div><strong>Les mêmes repères, côté enfant</strong><p>Votre enfant retrouve ces tâches et suit ses étapes dans son calendrier.</p></div><button type="button" className="task-child-link" onClick={() => { setCurrentRole('enfant'); navigate('/enfant/routines'); }}>Voir son calendrier enfant →</button></div>
  </section>;
}
