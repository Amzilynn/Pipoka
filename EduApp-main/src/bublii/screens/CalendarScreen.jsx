import { accountDatabase } from '../utils/accountStorage';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import Logo from '../components/Logo';
import ChildCalendarView from '../components/ChildCalendarView';
import CalendarCamera from '../components/CalendarCamera';
import useCalendarVoice from '../hooks/useCalendarVoice';
import { checkPhoto } from '../utils/calendarPhoto';
import './CalendarScreen.css';
import '../components/ChildCalendarView.css';

export const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(accountDatabase('bublii-calendar'), 1);
  request.onupgradeneeded = () => request.result.createObjectStore('tasks', { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
export async function taskStorage(mode, task) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction('tasks', mode);
      const store = transaction.objectStore('tasks');
      const request = task ? store.put(task) : store.getAll();
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { database.close(); }
}
const uid = () => crypto.randomUUID();
const blankStep = () => ({ id: uid(), title: '', instruction: '', picture: '' });
const pictures = [
  ['reveil', 'Se réveiller'], ['dejeuner', 'Repas'], ['brush', 'Se brosser les dents'],
  ['habillage', 'S’habiller'], ['chaussures', 'Mettre ses chaussures'], ['cahier', 'Cahier'],
  ['trousse', 'Trousse'], ['gourde', 'Boire de l’eau'], ['ranger', 'Ranger'],
  ['gouter', 'Goûter'], ['console', 'Jouer'], ['histoire', 'Lire'], ['coussin', 'Se reposer'],
  ['pyjama', 'Mettre son pyjama'], ['dodo', 'Dormir'],
  ['transport-card', 'Carte de transport'], ['bus-stop', 'Arrêt de bus'], ['bus', 'Bus'],
  ['bus-seats', 'Sièges du bus'], ['pharmacy', 'Pharmacie'],
];
function pictureFor(item) {
  if (pictures.some(([id]) => id === item.picture)) return item.picture;
  const title = (item.title || '').toLocaleLowerCase('fr');
  return pictures.find(([id, label]) => title.includes(id) || title.includes(label.toLocaleLowerCase('fr')))?.[0] || (title.includes('sac') ? 'cahier' : 'reveil');
}
const pictureSrc = id => ['transport-card', 'bus-stop', 'bus', 'bus-seats', 'pharmacy'].includes(id)
  ? `/assets/images/day-routine/${id}.jpg` : `/assets/images/grow/${id}.svg`;
function ActivityPicture({ item, className = '' }) {
  return <img className={`calendar-activity-picture ${className}`} src={pictureSrc(pictureFor(item))} alt="" />;
}
function PicturePicker({ value, onChange, label }) {
  return <fieldset className="calendar-picture-picker"><legend>{label}</legend>
    <div className="calendar-picture-options">{pictures.map(([id, name]) =>
      <button key={id} type="button" className={`calendar-picture-option ${value === id ? 'selected' : ''}`}
        aria-label={name} aria-pressed={value === id} onClick={() => onChange(id)}>
        <img src={pictureSrc(id)} alt="" /><span>{name}</span>
      </button>)}
    </div>
  </fieldset>;
}
const verified = step => !!step.photo && step.verification?.verdict === 'verified' && step.verification.confidence >= 0.85;
const button = 'calendar-button';
function PhotoStep({ step, index, adult, focused, locked, busy, feedback, inputRef, onPhoto, onRead, onOpenCamera }) {
  const [preview, setPreview] = useState('');
  const localInput = useRef(null);

  const done = verified(step);
  useEffect(() => {
    if (!step.photo) { setPreview(''); return; }
    const url = URL.createObjectURL(step.photo); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [step.photo]);
  return <li className={`calendar-step ${done ? 'is-done' : locked ? 'is-locked' : 'is-active'}`}>
    <ActivityPicture item={step} /><span className="calendar-step-number" aria-hidden="true">{done ? '✓' : locked ? '·' : index + 1}</span>
    <div className="calendar-step-content">
      <div className="calendar-row"><h4>{step.title}</h4>{done && <span className="calendar-success">Vérifiée ✓</span>}</div>
      {adult && <p>{step.instruction}</p>}
      {!adult && !locked && !done && <>
        <p>{step.instruction}</p>
        <div className="calendar-actions">
          <button className={button} onClick={onRead}><span aria-hidden="true">🔊</span> Écouter</button>
          <button className={`${button} calendar-primary`} ref={inputRef} disabled={busy} onClick={onOpenCamera}>
            <span aria-hidden="true">📷</span> {busy ? 'Je vérifie la photo…' : 'Prendre une photo'}
          </button>
          {!focused && <button className={button} disabled={busy} onClick={() => localInput.current?.click()}>Choisir une photo</button>}
          <input ref={localInput} className="calendar-file-input" type="file" accept="image/*" capture="environment"
            aria-label={`Photo : ${step.title}`} disabled={busy} onChange={event => {
              const file = event.target.files?.[0]; event.target.value = '';
              if (file) onPhoto(file);
            }} />
        </div>
        {focused && <details className="calendar-upload-alternative"><summary>Utiliser une photo existante</summary><button className={button} disabled={busy} onClick={() => localInput.current?.click()}>Choisir une photo</button></details>}
        {step.photo && !done && <p className="calendar-note">Cette ancienne photo doit être vérifiée. Prends une nouvelle photo.</p>}
        {feedback && <p className={`calendar-feedback ${feedback.kind}`} role="status">{feedback.text}</p>}
      </>}
      {done && preview && <details className="calendar-proof"><summary>Voir ma photo</summary><a href={preview} target="_blank" rel="noreferrer"><img src={preview} alt={`Photo vérifiée : ${step.title}`} /></a></details>}
      {locked && <p className="calendar-note">À suivre</p>}
    </div>
  </li>;
}

export default function CalendarScreen() {
  const { role } = useParams();
  const { activeChild, profiles, switchChild } = useBublii();
  const adult = role === 'parent' || role === 'specialiste';
  const home = ['parent', 'specialiste', 'enfant'].includes(role) ? `/${role}` : '/enfant';
  const [tasks, setTasks] = useState([]);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const requestRef = useRef(null);
  const photoInput = useRef(null);
  const [error, setError] = useState('');
  const [cameraTarget, setCameraTarget] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [selected, setSelected] = useState(dateKey(new Date()));
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [picture, setPicture] = useState('reveil');
  const [steps, setSteps] = useState(() => [blankStep()]);
  const childTasks = tasks.filter(task => task.childId === activeChild.id);
  const dayTasks = childTasks.filter(task => task.date === selected).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const activeTask = dayTasks.find(task => task.id === focusedTaskId && task.steps.some(step => !verified(step)))
    || dayTasks.find(task => task.steps.some(step => !verified(step)));
  const activeStep = activeTask?.steps.find(step => !verified(step));
  const readCurrent = () => voice.speak(!dayTasks.length ? 'Ton parent n’a pas encore prévu d’activité pour cette journée.' : activeStep ? `${activeStep.title}. ${activeStep.instruction}` : 'Bravo ! Tout est prêt pour ce jour.');
  const selectDay = date => { voice.stop(); setFocusedTaskId(null); setSelected(dateKey(date)); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); };
  const voice = useCalendarVoice(action => {
    if (action === 'read') readCurrent();
    if (action === 'photo') {
      if (!busy && activeStep && !editing && !cameraTarget) photoInput.current?.click();
      else voice.speak(busy ? 'Je vérifie déjà ta photo. Patiente un instant.' : 'Choisis une journée avec une étape à faire.');
    }
    if (!busy && !editing && !cameraTarget && (action === 'today' || action === 'tomorrow')) {
      const date = new Date(); if (action === 'tomorrow') date.setDate(date.getDate() + 1); selectDay(date);
    }
  });
  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    async function loadTasks() {
      const result = await taskStorage('readonly');
      // Ignore the retired automatic demo, including copies already saved locally.
      if (!cancelled) setTasks(result.filter(task => task.id !== `example-schoolbag-${task.childId}`));
    }
    loadTasks().catch(() => { if (!cancelled) setError('Impossible de charger le calendrier. Autorise le stockage du navigateur.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; mounted.current = false; requestRef.current?.abort(); };
  }, []);
  async function persist(task) {
    await taskStorage('readwrite', task);
    if (mounted.current) setTasks(previous => [...previous.filter(item => item.id !== task.id), task]);
  }
  async function createTask(event) {
    event.preventDefault();
    if (inFlight.current || !title.trim() || steps.some(step => !step.title.trim() || !step.instruction.trim())) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      await persist({ id: uid(), childId: activeChild.id, date: selected, title: title.trim(), time, picture,
        steps: steps.map(step => ({ ...step, title: step.title.trim(), instruction: step.instruction.trim() })) });
      setEditing(false); setTitle(''); setTime(''); setPicture('reveil'); setSteps([blankStep()]);
    } catch { setError('Enregistrement impossible. Vérifie l’espace disponible et réessaie.'); }
    finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  async function completeStep(task, stepId, file) {
    const index = task.steps.findIndex(step => step.id === stepId);
    if (inFlight.current || index < 0 || verified(task.steps[index]) || task.steps.slice(0, index).some(step => !verified(step))) return;
    inFlight.current = true; setBusy(true); setError(''); voice.stop();
    requestRef.current = new AbortController();
    const key = `${task.id}:${stepId}`;
    setFeedback(previous => ({ ...previous, [key]: { kind: 'checking', text: 'Je regarde ta photo. Un petit instant…' } }));
    try {
      const result = await checkPhoto(file, task.steps[index], requestRef.current.signal);
      if (!mounted.current) return;
      if (result.verification.verdict === 'verified') {
        await persist({ ...task, steps: task.steps.map(step => step.id === stepId
          ? { ...step, photo: result.photo, verification: result.verification, completedAt: new Date().toISOString() } : step) });
        voice.speak(`Bravo ! ${result.verification.feedback}`);
      } else {
        setFeedback(previous => ({ ...previous, [key]: { kind: 'retry', text: result.verification.feedback } }));
        voice.speak(result.verification.feedback);
      }
    } catch (err) {
      if (mounted.current) {
        const text = err.name === 'AbortError' ? 'La vérification a été arrêtée. Réessaie.' : err.message;
        setFeedback(previous => ({ ...previous, [key]: { kind: 'retry', text } })); voice.speak(text);
      }
    } finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const changeMonth = delta => { voice.stop(); setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1)); };
  const completedToday = dayTasks.filter(task => task.steps.every(verified)).length;
  if (!adult) return <ChildCalendarView child={activeChild} selected={selected} tasks={dayTasks}
    currentTask={activeTask} currentStep={activeStep} loading={loading} busy={busy} error={error}
    dateKey={dateKey} pictureSrc={pictureSrc} pictureFor={pictureFor} verified={verified} voice={voice}
    onSelectDay={selectDay} onSelectTask={id => { voice.stop(); setFocusedTaskId(id); }}
    renderStep={(task, step, index) => <PhotoStep key={`${task.id}:${step.id}`} step={step} index={index} focused busy={busy}
      inputRef={photoInput} feedback={feedback[`${task.id}:${step.id}`]} locked={false}
      onOpenCamera={() => { voice.stop(); setCameraTarget({ task, step }); }}
      onRead={() => voice.speak(`${step.title}. ${step.instruction}`)} onPhoto={file => completeStep(task, step.id, file)} />}
    camera={cameraTarget && <CalendarCamera step={cameraTarget.step} onClose={() => { voice.stop(); setCameraTarget(null); }}
      onRead={() => voice.speak(cameraTarget.step.instruction)}
      onCapture={file => { const target = cameraTarget; setCameraTarget(null); completeStep(target.task, target.step.id, file); }} />}
  />;
  return <div className="task-calendar bublii-bg-canvas">
    <header className="calendar-topbar"><div className="calendar-topbar-inner">
      <Link className={button} to={home} aria-label="Retour à mon espace">← <span>Mon espace</span></Link>
      <Logo size="sm" />
      <span className="calendar-profile"><span style={{ background: activeChild.avatar.color }} aria-hidden="true">{activeChild.avatar.initial}</span>{activeChild.firstName}</span>
    </div></header>
    <main className="calendar-main">
      <section className="calendar-hero">
        <div><p className="calendar-eyebrow">MES PETITS PAS, MES GRANDES VICTOIRES</p><h1>{adult ? "Planifier sa journée" : "Ma journée en images"}<span aria-hidden="true"> ☀</span></h1><p>{adult ? "Prépare des activités avec des images pour guider ton enfant." : "Ton programme, une image et un petit pas à la fois."}</p></div>
        <div className="calendar-hero-badge"><span aria-hidden="true">★</span><strong>{completedToday} / {dayTasks.length}</strong><span>missions terminées</span></div>
      </section>
      <div className="calendar-voice-bar">
        <span><strong>Un coup de pouce ?</strong> Écoute ou parle.</span>
        <div className="calendar-actions">
          <button className={button} onClick={readCurrent} disabled={loading || !voice.canSpeak}><span aria-hidden="true">🔊</span> Écouter</button>
          <button className={`${button} ${voice.listening ? 'is-listening' : ''}`} aria-pressed={voice.listening} disabled={busy} onClick={voice.listen}><span aria-hidden="true">🎙</span> {voice.listening ? 'Arrêter le micro' : 'Parler'}</button>
        </div>
        <p className="calendar-voice-hint">Dis « aide », « photo », « aujourd’hui » ou « demain ».{!voice.supported && ' Le micro vocal nécessite un navigateur compatible, comme Chrome.'}</p>
        {voice.message && <p className="calendar-voice-hint" role="status">{voice.message}</p>}
      </div>
      {error && <p role="alert" className="calendar-error">{error}</p>}
      {adult && <label className="calendar-child-select">Enfant <select disabled={busy || editing} value={activeChild.id} onChange={event => { voice.stop(); switchChild(event.target.value); }}>
        {profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.firstName}</option>)}
      </select></label>}
      <div className="calendar-layout"><aside className="calendar-panel calendar-month-panel" aria-label="Calendrier mensuel">
        <div className="calendar-row"><h2>{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2><div className="calendar-actions">
          <button className={`${button} calendar-arrow`} disabled={busy || editing} aria-label="Mois précédent" onClick={() => changeMonth(-1)}>‹</button>
          <button className={`${button} calendar-arrow`} disabled={busy || editing} aria-label="Mois suivant" onClick={() => changeMonth(1)}>›</button>
        </div></div>
        <div className="calendar-grid">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <span className="calendar-weekday" key={index}>{day}</span>)}
          {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
          {Array.from({ length: days }, (_, index) => {
            const key = dateKey(new Date(month.getFullYear(), month.getMonth(), index + 1));
            const count = childTasks.filter(task => task.date === key).length;
            return <button key={key} disabled={busy || editing} aria-pressed={selected === key} aria-current={key === dateKey(new Date()) ? 'date' : undefined}
              aria-label={`${index + 1} ${month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}, ${count} tâche(s)`}
              className={`calendar-day ${selected === key ? 'selected' : ''}`} onClick={() => { voice.stop(); setSelected(key); }}>
              {index + 1}<span className={count ? 'calendar-dot' : 'calendar-no-dot'} aria-hidden="true" /></button>;
          })}
        </div>
        <button className={`${button} calendar-today`} disabled={busy || editing} onClick={() => selectDay(new Date())}>Revenir à aujourd’hui</button>
        <div className="calendar-tip"><span aria-hidden="true">💡</span><p>{adult ? "Choisis une date et ajoute les activités de la journée." : "Ton parent prépare ta journée. Retrouve ici tes activités en images."}</p></div>
      </aside><section className="calendar-agenda" aria-label="Tâches du jour" aria-busy={busy}>
        <div className="calendar-row calendar-agenda-title"><div><p className="calendar-eyebrow">{selected === dateKey(new Date()) ? 'AUJOURD’HUI' : 'MA JOURNÉE'}</p>
          <h2>{new Date(`${selected}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2></div>
          {adult && !editing && <button className={`${button} calendar-primary`} disabled={loading || busy} onClick={() => { voice.stop(); setEditing(true); }}>+ Ajouter une tâche</button>}
        </div>
        {editing && <form className="calendar-panel calendar-form" onSubmit={createTask}>
          <h3>Nouvelle activité</h3><label>Nom de la tâche<input required disabled={busy} maxLength={120} value={title} onChange={event => setTitle(event.target.value)} placeholder="Préparer mon sac" /></label>
          <label>Heure (facultatif)<input type="time" disabled={busy} value={time} onChange={event => setTime(event.target.value)} /></label>
          <PicturePicker value={picture} onChange={setPicture} label="Image de l’activité" />
          {steps.map((step, index) => <fieldset key={step.id} disabled={busy}><legend>Étape {index + 1}</legend>
            <label>Que faut-il faire ?<input required maxLength={120} value={step.title} onChange={event => setSteps(items => items.map(item => item.id === step.id ? { ...item, title: event.target.value } : item))} /></label>
            <PicturePicker value={step.picture} onChange={picture => setSteps(items => items.map(item => item.id === step.id ? { ...item, picture } : item))} label={`Image de l’étape ${index + 1}`} />
            <label>Que doit-on voir sur la photo ?<textarea required maxLength={1000} value={step.instruction} placeholder="Le cahier est visible à l’intérieur du sac ouvert." onChange={event => setSteps(items => items.map(item => item.id === step.id ? { ...item, instruction: event.target.value } : item))} /></label>
            {steps.length > 1 && <button type="button" className={button} onClick={() => setSteps(items => items.filter(item => item.id !== step.id))}>Retirer cette étape</button>}
          </fieldset>)}
          <button type="button" className={button} disabled={busy || steps.length >= 20} onClick={() => setSteps(items => [...items, blankStep()])}>+ Ajouter une étape</button>
          <p className="calendar-note">L’enfant verra ces images dans sa liste du jour. Décris un résultat visible pour la vérification photo.</p>
          <div className="calendar-actions"><button className={`${button} calendar-primary`} disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button type="button" className={button} disabled={busy} onClick={() => setEditing(false)}>Annuler</button></div>
        </form>}
        {loading ? <p role="status">Chargement…</p> : !dayTasks.length && <div className="calendar-panel calendar-empty"><span aria-hidden="true">🌱</span><h3>Une journée toute tranquille</h3><p>{adult ? 'Ajoute une mission pour cette journée.' : 'Ton parent n’a pas encore prévu d’activité pour ce jour. Tu peux regarder une autre journée.'}</p></div>}
        {dayTasks.map(task => {
          const completed = task.steps.filter(verified).length;
          const done = completed === task.steps.length;
          return <article className={`calendar-panel calendar-mission ${done ? 'mission-done' : ''}`} key={task.id}>
            <div className="calendar-row"><div className="calendar-mission-heading"><ActivityPicture item={task} className="calendar-mission-picture" /><div>
              <p className="calendar-eyebrow">{task.time || 'À MON RYTHME'} · {done ? 'TERMINÉ' : task.id === activeTask?.id ? 'À FAIRE' : 'À SUIVRE'}</p><h3>{task.title.replace(' (exemple)', '')}</h3></div></div>
              <span className="calendar-count">{completed} / {task.steps.length}</span></div>
            <progress value={completed} max={task.steps.length} aria-label={`Progression : ${task.title}`} />
            {done && <p className="calendar-celebration" role="status">Bravo ! Tu as terminé ta mission !</p>}
            <ol>{task.steps.map((step, index) => <PhotoStep key={step.id} step={step} index={index} adult={adult} busy={busy}
              inputRef={task.id === activeTask?.id && step.id === activeStep?.id ? photoInput : undefined}
              feedback={feedback[`${task.id}:${step.id}`]}
              locked={task.steps.slice(0, index).some(previous => !verified(previous))}
              onOpenCamera={() => { voice.stop(); setCameraTarget({ task, step }); }}
              onRead={() => voice.speak(`${step.title}. ${step.instruction}`)}
              onPhoto={file => completeStep(task, step.id, file)} />)}</ol>
          </article>;
        })}
      </section></div>
      <footer className="calendar-footer">Les photos sont vérifiées sur cet ordinateur et enregistrées dans ce navigateur.<br />Le micro peut utiliser le service vocal de ton navigateur.</footer>
    </main>
    {cameraTarget && <CalendarCamera step={cameraTarget.step} onClose={() => { voice.stop(); setCameraTarget(null); }}
      onRead={() => voice.speak(cameraTarget.step.instruction)}
      onCapture={file => { const target = cameraTarget; setCameraTarget(null); completeStep(target.task, target.step.id, file); }} />}
  </div>;
}
