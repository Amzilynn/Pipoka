import React, { useEffect, useId, useState } from 'react';
import { speakText, stopSpeech } from '../utils/speech';
import { Link } from 'react-router-dom';
import './CalendarShortcut.css';

const exampleDay = [
  { title: 'Je prends ma carte', photo: 'transport-card', alt: 'Une carte de transport rouge.',
    instruction: 'Je prends ma carte de transport.' },
  { title: 'Je vais à l’arrêt', photo: 'bus-stop', alt: 'Un arrêt de bus avec un abri et un banc.',
    instruction: 'Je vais à l’arrêt avec mon adulte.' },
  { title: 'Je monte dans le bus', photo: 'bus', alt: 'Un bus bleu vu de devant.',
    instruction: 'Je monte avec mon adulte.' },
  { title: 'Je m’assieds', photo: 'bus-seats', alt: 'Des sièges bleus à l’intérieur du bus.',
    instruction: 'Je m’assieds près de mon adulte.' },
  { title: 'Je vais à la pharmacie', photo: 'pharmacy', alt: 'L’entrée d’une pharmacie avec une croix verte.',
    instruction: 'J’entre avec mon adulte.' },
];

export function DayExample({ compact = false }) {
  const [opened, setOpened] = useState(null);
  const id = useId();
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const visibleSteps = compact ? exampleDay.slice(0, 3) : exampleDay;
  useEffect(() => () => stopSpeech(), []);
  const selectStep = index => { stopSpeech(); setOpened(previous => previous === index ? null : index); };
  return <section className="day-example" aria-label="Exemple de sortie">
    <span className="day-example-label">EXEMPLE</span>
    <h3>Je vais à la pharmacie</h3>
    <p>Avec mon adulte. Touche une étape.</p>
    <ol>{visibleSteps.map((item, index) => {
      const expanded = opened === index;
      const panelId = `${id}-step-${index}`;
      return <li key={item.photo}>
        <div className={`day-example-step ${expanded ? 'is-open' : ''}`}>
          <button type="button" className="day-example-step-button" aria-expanded={expanded} aria-controls={panelId}
            aria-label={`Étape ${index + 1} : ${item.title}`} onClick={() => selectStep(index)}>
            <img className="day-example-thumb" src={`/assets/images/day-routine/${item.photo}.jpg`} alt="" width="72" height="72" loading="lazy" />
            <span className="day-example-step-copy"><strong>Étape {index + 1}</strong><span>{item.title}</span></span>
            <svg className="day-example-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
          <div id={panelId} className="day-example-detail" hidden={!expanded}>
            {expanded && <>
              <img src={`/assets/images/day-routine/${item.photo}.jpg`} alt={item.alt} width="600" height="400" />
              <p>{item.instruction}</p>
              <button type="button" className="day-example-listen" disabled={!canSpeak}
                aria-label={`Écouter l’étape ${index + 1}`} onClick={() => speakText(item.instruction, true)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></svg>
                Écouter
              </button>
              {!canSpeak && <p>La lecture audio est indisponible sur ce navigateur.</p>}
            </>}
          </div>
        </div>
      </li>;
    })}</ol>
    {compact && <Link className="day-example-all" to="/enfant/calendrier">Voir les 5 étapes →</Link>}
    <p className="day-example-note">Un exemple pour découvrir. Ton parent prépare ta sortie.</p>
    <details className="day-example-credits"><summary>Crédits photo</summary><p>Carte : <a href="https://commons.wikimedia.org/wiki/File:Navigo_card.jpg" target="_blank" rel="noreferrer">Hawkeye7</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Autres photos : Pexels.</p></details>
  </section>;
}

export default function CalendarShortcut({ role = 'enfant', compact = false }) {
  return <Link to={`/${role}/calendrier`} className={`calendar-shortcut ${compact ? 'calendar-shortcut-compact' : ''}`}>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="4" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2" />
    </svg>
    <span><strong>Mon calendrier</strong>{!compact && <small>Ma journée en images</small>}</span>
    <span aria-hidden="true">→</span>
  </Link>;
}
