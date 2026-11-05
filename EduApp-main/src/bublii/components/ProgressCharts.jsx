import React from 'react';
import { summarizeHistory } from '../parent/parentMetrics';
const domains = [['learn', 'Apprendre', '#2a6fb5'], ['communicate', 'Communiquer', '#d65d76'], ['move', 'Bouger', '#22a06b'], ['grow', 'Grandir', '#e3a629']];
export default function ProgressCharts({ child, profiles = [] }) {
  const history = (child ? [child] : profiles).flatMap(profile => profile.history);
  const metrics = summarizeHistory(history, 'week');
  const previous = summarizeHistory(history, 'week', new Date(Date.now() - 7 * 86400000));
  const max = Math.max(1, ...metrics.days.map(day => day.count));
  const difference = metrics.total - previous.total;
  const points = metrics.days.map((day, index) => `${40 + index * 85},${155 - day.count / max * 120}`);
  let cursor = 0;
  const stops = domains.map(([id, , color]) => { const count = metrics.domains.find(domain => domain.id === id).count; const start = cursor; cursor += metrics.total ? count / metrics.total * 100 : 0; return `${color} ${start}% ${cursor}%`; });
  return <section className="progress-story" aria-label={child ? `Les progrès de ${child.firstName}` : 'Activité de la semaine'}>
    <div className="story-stats">{[
      ['Parties cette semaine', metrics.total, `${difference >= 0 ? '+' : ''}${difference} par rapport aux 7 jours précédents`, 'blue'],
      ['Jours actifs', `${metrics.days.filter(day => day.count > 0).length} / 7`, 'Des petits rendez-vous réguliers', 'coral'],
      ['Jeux explorés', metrics.unique, 'Des activités variées cette semaine', 'green'],
    ].map(([label, value, caption, color]) => <article className={`story-stat story-${color}`} key={label}><p>{label}</p><strong>{value}</strong><small>{caption}</small></article>)}</div>
    <div className="story-chart-grid">
      <figure className="story-chart"><figcaption><h2>Un peu chaque jour</h2><p>Les activités terminées au fil de la semaine</p></figcaption>
        <svg viewBox="0 0 600 200" role="img" aria-label={`${metrics.total} activités terminées sur les 7 derniers jours`}>
          {[35, 75, 115, 155].map(y => <line key={y} x1="30" x2="570" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />)}
          <polygon points={`40,155 ${points.join(' ')} 550,155`} fill="#ebf4ff" />
          <polyline points={points.join(' ')} fill="none" stroke="#2a6fb5" strokeWidth="4" strokeLinejoin="round" />
          {metrics.days.map((day, index) => <g key={day.key}><circle cx={40 + index * 85} cy={155 - day.count / max * 120} r="6" fill="#2a6fb5" stroke="white" strokeWidth="3" /><text x={40 + index * 85} y={143 - day.count / max * 120} textAnchor="middle" fill="#1b4c7e" fontSize="14">{day.count}</text><text x={40 + index * 85} y="185" textAnchor="middle" fill="#64748b" fontSize="14">{new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'Europe/Paris' }).format(day.date)}</text></g>)}
        </svg>
        <table className="story-visually-hidden"><caption>Parties par jour</caption><tbody>{metrics.days.map(day => <tr key={day.key}><th>{day.key}</th><td>{day.count}</td></tr>)}</tbody></table>
      </figure>
      <figure className="story-chart"><figcaption><h2>{child ? 'Ses univers de la semaine' : 'Les univers de la semaine'}</h2><p>Apprendre, s’exprimer, bouger et grandir</p></figcaption><div className="story-donut-layout"><div className="story-donut" style={{ background: metrics.total ? `conic-gradient(${stops.join(',')})` : '#e2e8f0' }} aria-hidden="true"><span><strong>{metrics.total}</strong>parties</span></div>
        <ul>{domains.map(([id, label, color]) => <li key={id}><span style={{ background: color }} /><span>{label}</span><strong>{metrics.domains.find(domain => domain.id === id).count}</strong></li>)}</ul></div>
      </figure>
    </div>
  </section>;
}
