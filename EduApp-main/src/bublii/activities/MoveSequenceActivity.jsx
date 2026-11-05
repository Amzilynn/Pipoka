import React, { useCallback, useEffect, useRef, useState } from 'react';
import { speakText, stopSpeech } from '../utils/speech';
import SequenceCamera from '../components/SequenceCamera';
import DanceDemonstration from '../components/DanceDemonstration';
import { useDanceReward } from '../utils/danceReward';

const STEPS = [
  { id: 'arms', label: 'Lève les bras', hint: 'Les deux mains vers le ciel.' },
  { id: 'clap', label: 'Tape dans tes mains', hint: 'Rapproche tes mains devant toi.' },
  { id: 'head', label: 'Mains sur la tête', hint: 'Pose doucement tes mains sur ta tête.' },
  { id: 'clap', label: 'Tape dans tes mains', hint: 'Rapproche tes mains devant toi.' },
  { id: 'arms', label: 'Lève les bras', hint: 'Les deux mains vers le ciel.' },
];

export default function MoveSequenceActivity({ childSettings, onComplete }) {
  const audioEnabled = childSettings?.audio !== false;
  const [index, setIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [music, setMusic] = useState(true);
  const [voice, setVoice] = useState(true);
  const [still, setStill] = useState(false);
  const [demonstratedIndex, setDemonstratedIndex] = useState(-1);
  const demonstrating = demonstratedIndex !== index;
  const timer = useRef(null);
  const locked = useRef(false);
  const reward = useDanceReward(audioEnabled && music);
  const step = STEPS[index];
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!finished && !paused && !celebrating) speakText(demonstrating ? `Regarde le modèle. ${step.label}` : `À toi ! ${step.label}`, audioEnabled && voice);
    return stopSpeech;
  }, [index, paused, finished, celebrating, demonstrating, audioEnabled, voice, step.label]);
  const finishDemonstration = useCallback(() => {
    if (!paused && !finished) setDemonstratedIndex(index);
  }, [index, paused, finished]);
  const match = gesture => {
    if (locked.current || demonstrating || paused || finished || gesture !== step.id) return;
    locked.current = true;
    setCelebrating(true);
    speakText('Bravo !', audioEnabled && voice);
    reward.play();
    timer.current = setTimeout(() => {
      setCelebrating(false);
      if (index === STEPS.length - 1) setFinished(true);
      else setIndex(value => value + 1);
      locked.current = false;
    }, 4200);
  };
  const togglePause = () => {
    reward.unlock();
    if (!paused) { stopSpeech(); reward.stop(); }
    setPaused(value => !value);
  };
  if (finished) return <div className="mx-auto max-w-xl rounded-3xl border-2 border-emerald-200 bg-white p-8 text-center space-y-5">
    <div className="text-6xl text-emerald-700" aria-hidden="true">✓</div>
    <h2 className="font-['Fredoka'] text-4xl font-bold text-slate-800">Bravo, tu as dansé !</h2>
    <p className="text-xl text-slate-600">Les 5 gestes sont terminés.</p>
    <button type="button" className="btn-tactile btn-tactile--move w-full" onClick={() => onComplete?.({ score: 5, maxScore: 5, label: 'Danser une séquence', module: 'move' })}>Continuer</button>
  </div>;
  return <div className="mx-auto w-full max-w-4xl space-y-4">
    <header className="flex items-center justify-between gap-3">
      <div><p className="text-sm font-bold text-emerald-800">En rythme · Geste {index + 1} sur {STEPS.length}</p><h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-slate-800">On danse ensemble</h2></div>
      <button type="button" onClick={togglePause} disabled={celebrating} className="min-h-[52px] rounded-2xl border-2 border-slate-300 bg-white px-4 font-bold text-slate-700 disabled:opacity-50">{paused ? '▶ Reprendre' : 'Ⅱ Pause'}</button>
    </header>
    <section className="overflow-hidden rounded-3xl border-2 border-[#B8D5C6] bg-white shadow-sm">
      <div className="bg-[#EDF6F0] px-4 py-4 text-center">
        <h3 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#245C46]">{step.label}</h3>
        <p className="mt-1 text-base sm:text-lg text-slate-700">{step.hint}</p>
        <button type="button" disabled={!audioEnabled || !voice || celebrating || paused} onClick={() => speakText(step.label, true)} className="mt-2 min-h-[48px] rounded-xl border-2 border-[#B8D5C6] bg-white px-4 font-bold text-[#245C46] disabled:opacity-50">Écouter la consigne</button>
      </div>
      <SequenceCamera gesture={step.id} disabled={celebrating || paused || demonstrating} paused={paused} demonstrating={demonstrating} celebrating={celebrating} onMatch={match} onInteraction={reward.unlock} model={<DanceDemonstration key={`${index}-${paused}-${still}`} gesture={step.id} still={still || paused || celebrating || !demonstrating} onComplete={demonstrating && !paused ? finishDemonstration : undefined} />} />
      <div role="status" aria-live="polite" className="min-h-[60px] flex items-center justify-center px-4 py-3 text-center text-xl font-bold text-[#245C46] bg-[#EDF6F0]">{paused ? 'On fait une pause.' : celebrating ? '✓ Bravo ! Tu as réussi !' : demonstrating ? 'Regarde le modèle : il te montre le mouvement.' : 'À toi ! Fais le même mouvement, à ton rythme.'}</div>
    </section>
    <div className="flex items-center justify-center gap-3" aria-label={`Progression : ${index} gestes terminés sur 5`}>
      {STEPS.map((item, i) => <span key={i} aria-current={i === index ? 'step' : undefined} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-base font-bold ${i < index ? 'border-emerald-700 bg-emerald-700 text-white' : i === index ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-white text-slate-500'}`}>{i < index ? '✓' : i + 1}</span>)}
    </div>
    <p className="text-center text-base text-slate-600">Assis ou debout. Tu as tout ton temps.</p>
    <details className="rounded-2xl border-2 border-slate-200 bg-white p-4 text-slate-700">
      <summary className="min-h-[48px] cursor-pointer font-bold flex items-center">Aide et réglages</summary>
      <div className="space-y-3 pt-3">
        <p>Si la caméra ne reconnaît pas le mouvement, un adulte peut le valider ici.</p>
        <button type="button" disabled={celebrating || paused || demonstrating} onClick={() => { reward.unlock(); match(step.id); }} className="min-h-[52px] rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 font-bold disabled:opacity-50">Valider le geste avec un adulte</button>
        <label className="flex min-h-[48px] items-center gap-3"><input type="checkbox" className="h-6 w-6" checked={music && audioEnabled} disabled={!audioEnabled} onChange={e => { reward.unlock(); setMusic(e.target.checked); }} />Musique après chaque réussite</label>
        <label className="flex min-h-[48px] items-center gap-3"><input type="checkbox" className="h-6 w-6" checked={voice && audioEnabled} disabled={!audioEnabled} onChange={e => setVoice(e.target.checked)} />Consignes parlées</label>
        <label className="flex min-h-[48px] items-center gap-3"><input type="checkbox" className="h-6 w-6" checked={still} onChange={e => setStill(e.target.checked)} />Afficher le modèle sans animation</label>
        <p className="text-sm">La vidéo reste sur cet appareil. Elle n’est ni enregistrée ni envoyée. Le geste « applaudir » est reconnu lorsque les mains se rapprochent devant le corps.</p>
      </div>
    </details>
  </div>;
}