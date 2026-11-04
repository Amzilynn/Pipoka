import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import './CalendarScreen.css';

export const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('bublii-calendar', 1);
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
const blankStep = () => ({ id: uid(), title: '', instruction: '' });
const button = 'calendar-button';

function exampleTask(childId) {
  return {
    id: `example-schoolbag-${childId}`,
    childId,
    date: dateKey(new Date()),
    title: 'Je pr\u00e9pare mon sac (exemple)',
    time: '',
    steps: [
      {
        id: 'example-notebook',
        title: 'Je mets mon cahier dans mon sac',
        instruction: 'Prends un cahier et glisse-le dans ton sac. Prends une photo du cahier dans le sac.',
      },
      {
        id: 'example-pencil-case',
        title: 'Je mets ma trousse dans mon sac',
        instruction: 'Prends ta trousse et place-la avec le cahier. Prends une photo de la trousse dans le sac.',
      },
      {
        id: 'example-close-bag',
        title: 'Je ferme mon sac',
        instruction: 'Ferme ton sac avec la fermeture. Pose-le devant toi et prends une photo du sac ferm\u00e9. Bravo, tu es pr\u00eat !',
      },
    ],
  };
}


function PhotoStep({ step, locked, busy, onPhoto }) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!step.photo) { setPreview(''); return; }
    const url = URL.createObjectURL(step.photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [step.photo]);
  return <li className={`calendar-step ${locked ? 'calendar-locked' : ''}`}>
    <div><strong>{step.title}</strong><p>{step.instruction}</p></div>
    {preview && <a href={preview} target="_blank" rel="noreferrer"><img src={preview} alt={`Photo : ${step.title}`} /></a>}
    {step.photo ? <p className="calendar-success">✓ Étape terminée · {new Date(step.completedAt).toLocaleString('fr-FR')}</p>
      : locked ? <p>Termine d’abord l’étape précédente.</p>
      : <label className={`${button} calendar-photo`}>Prendre une photo pour terminer
        <input type="file" accept="image/*" capture="environment" disabled={busy} onChange={event => {
          const file = event.target.files?.[0];
          if (file) onPhoto(file);
          event.target.value = '';
        }} />
      </label>}
  </li>;
}

export default function CalendarScreen() {
  const { role } = useParams();
  const { activeChild, profiles, switchChild } = useBublii();
  const adult = role === 'parent' || role === 'specialiste';
  const home = ['parent', 'specialiste', 'enfant'].includes(role) ? `/${role}` : '/enfant';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(dateKey(new Date()));
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [steps, setSteps] = useState(() => [blankStep()]);
  useEffect(() => {
    let cancelled = false;
    async function loadTasks() {
      const result = await taskStorage('readonly');
      // Seed one example per child without changing existing tasks or photos.
      for (const profile of profiles) {
        const example = exampleTask(profile.id);
        if (!result.some(task => task.id === example.id)) {
          await taskStorage('readwrite', example);
          result.push(example);
        }
      }
      if (!cancelled) setTasks(result);
    }
    loadTasks()
      .catch(() => { if (!cancelled) setError('Impossible de charger le calendrier. Vérifie que le stockage du navigateur est autorisé.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  async function save(task) {
    setBusy(true); setError('');
    try {
      await taskStorage('readwrite', task);
      setTasks(previous => [...previous.filter(item => item.id !== task.id), task]);
      return true;
    } catch { setError('Enregistrement impossible. Vérifie l’espace disponible et réessaie.'); return false; }
    finally { setBusy(false); }
  }
  async function createTask(event) {
    event.preventDefault();
    if (!title.trim() || steps.some(step => !step.title.trim() || !step.instruction.trim())) return;
    const saved = await save({ id: uid(), childId: activeChild.id, date: selected, title: title.trim(), time,
      steps: steps.map(step => ({ ...step, title: step.title.trim(), instruction: step.instruction.trim() })) });
    if (saved) { setEditing(false); setTitle(''); setTime(''); setSteps([blankStep()]); }
  }
  async function completeStep(task, stepId, file) {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setError('Choisis une photo de moins de 10 Mo.'); return;
    }
    try { const bitmap = await createImageBitmap(file); bitmap.close(); }
    catch { setError('Cette photo ne peut pas être lue. Essaie une image JPEG ou PNG.'); return; }
    const index = task.steps.findIndex(step => step.id === stepId);
    if (index < 0 || task.steps[index].photo || task.steps.slice(0, index).some(step => !step.photo)) return;
    await save({ ...task, steps: task.steps.map(step => step.id === stepId
      ? { ...step, photo: file, completedAt: new Date().toISOString() } : step) });
  }
  const childTasks = tasks.filter(task => task.childId === activeChild.id);
  const dayTasks = childTasks.filter(task => task.date === selected).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const changeMonth = delta => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  return <main className="task-calendar">
    <header className="calendar-header"><Link className={button} to={home}>← Retour</Link>
      <div><p>Un petit pas à la fois</p><h1>Mon calendrier</h1></div>
      {adult && <label>Enfant<select disabled={busy || editing} value={activeChild.id} onChange={event => switchChild(event.target.value)}>
        {profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.firstName}</option>)}
      </select></label>}
    </header>
    <p>Les tâches de {activeChild.firstName}. Une photo à chaque étape pour montrer tes progrès.</p>
    {error && <p role="alert" className="calendar-error">{error}</p>}
    <div className="calendar-layout"><section className="calendar-panel" aria-label="Calendrier mensuel">
      <div className="calendar-month"><button className={button} aria-label="Mois précédent" onClick={() => changeMonth(-1)}>←</button>
        <h2>{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
        <button className={button} aria-label="Mois suivant" onClick={() => changeMonth(1)}>→</button></div>
      <button className={button} disabled={editing} onClick={() => { const today = new Date(); setSelected(dateKey(today)); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); }}>Aujourd’hui</button>
      <div className="calendar-grid">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => <span className="calendar-weekday" key={day}>{day}</span>)}
        {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
        {Array.from({ length: days }, (_, index) => {
          const key = dateKey(new Date(month.getFullYear(), month.getMonth(), index + 1));
          const count = childTasks.filter(task => task.date === key).length;
          return <button key={key} disabled={editing} aria-pressed={selected === key} aria-current={key === dateKey(new Date()) ? 'date' : undefined}
            aria-label={`${index + 1} ${month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}, ${count} tâche(s)`}
            className={`calendar-day ${selected === key ? 'selected' : ''}`} onClick={() => setSelected(key)}>
            {index + 1}<small>{count ? `${count} •` : '\u00a0'}</small></button>;
        })}
      </div><p className="calendar-note">Les tâches et les photos restent dans ce navigateur, sur cet appareil.</p>
    </section><section className="calendar-agenda" aria-label="Tâches du jour">
      <div className="calendar-month"><h2>{new Date(`${selected}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
        {adult && !editing && <button className={button} disabled={loading || busy} onClick={() => setEditing(true)}>+ Ajouter une tâche</button>}</div>
      {editing && <form className="calendar-panel calendar-form" onSubmit={createTask}>
        <h3>Nouvelle tâche</h3><label>Nom de la tâche<input required maxLength={120} value={title} onChange={event => setTitle(event.target.value)} placeholder="Préparer mon sac" /></label>
        <label>Heure (facultatif)<input type="time" value={time} onChange={event => setTime(event.target.value)} /></label>
        {steps.map((step, index) => <fieldset key={step.id}><legend>étape {index + 1}</legend>
          <label>Que faut-il faire ?<input required maxLength={120} value={step.title} onChange={event => setSteps(items => items.map(item => item.id === step.id ? { ...item, title: event.target.value } : item))} /></label>
          <label>Comment le faire ?<textarea required maxLength={1000} value={step.instruction} onChange={event => setSteps(items => items.map(item => item.id === step.id ? { ...item, instruction: event.target.value } : item))} /></label>
          {steps.length > 1 && <button type="button" className={button} disabled={busy} onClick={() => setSteps(items => items.filter(item => item.id !== step.id))}>Retirer cette étape</button>}
        </fieldset>)}
        <button type="button" className={button} disabled={busy || steps.length >= 20} onClick={() => setSteps(items => [...items, blankStep()])}>+ Ajouter une étape</button>
        <p>Chaque étape demande une photo avant de passer à la suivante.</p>
        <div className="calendar-actions"><button className={button} disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer la tâche'}</button>
          <button type="button" className={button} disabled={busy} onClick={() => setEditing(false)}>Annuler</button></div>
      </form>}
      {loading ? <p role="status">Chargement…</p> : !dayTasks.length && <div className="calendar-panel"><h3>Aucune tâche pour ce jour</h3><p>{adult ? 'Ajoute une tâche et explique chaque étape.' : 'Choisis un autre jour ou demande à un adulte de préparer une tâche.'}</p></div>}
      {dayTasks.map(task => {
        const completed = task.steps.filter(step => step.photo).length;
        return <article className="calendar-panel" key={task.id}><div className="calendar-month"><h3>{task.time && <span>{task.time} · </span>}{task.title}</h3>
          <span className="calendar-success">{completed === task.steps.length ? '✓ Bravo, tâche terminée !' : `${completed} / ${task.steps.length} étapes`}</span></div>
          <progress value={completed} max={task.steps.length} aria-label={`Progression : ${task.title}`} />
          <ol>{task.steps.map((step, index) => <PhotoStep key={step.id} step={step} busy={busy}
            locked={task.steps.slice(0, index).some(previous => !previous.photo)} onPhoto={file => completeStep(task, step.id, file)} />)}</ol>
        </article>;
      })}
    </section></div>
  </main>;
}
