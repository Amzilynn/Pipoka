import React from 'react';
import { Link } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import { useRoutines } from '../premium/Routines.jsx';
import { routinesOn, routineDay, routineKey } from '../premium/routines';
export default function ChildDayPreview() {
  const { activeChild } = useBublii();
  const { data } = useRoutines();
  const date = routineDay();
  const tasks = routinesOn(data.routines, activeChild.id, date);
  return <section className="child-day-preview"><h2>Ma journée</h2><p>Un petit pas à la fois.</p>{tasks.map(task => <Link key={task.id} to="/enfant/routines"><span aria-hidden="true">{task.icon}</span><span><strong>{task.title}</strong><small>{task.time} · {Math.min(data.progress[routineKey(task, date)] || 0, task.steps.length)}/{task.steps.length} étapes</small></span></Link>)}{!tasks.length && <p>Ta journée est libre.</p>}</section>;
}
