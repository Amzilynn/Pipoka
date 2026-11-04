import React from 'react';

export default function BarChart({ data = [], labels = [], color = 'var(--brand)', soft = '#EFECFF', height = 148, suffix = 'min', highlightIndex }) {
  const max = Math.max(...data, 10);
  const total = data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="bar-chart">
      <div className="bar-chart__grid" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="bar-chart__bars" style={{ height }}>
        {data.map((value, index) => {
          const ratio = Math.max(value / max, value > 0 ? 0.06 : 0.012);
          const active = highlightIndex === index;
          return (
            <div className="bar-chart__col" key={`${labels[index] || index}-${index}`}>
              <div className="bar-chart__track">
                <span
                  className={`bar-chart__value ${value === 0 ? 'is-empty' : ''}`}
                  style={{ bottom: `calc(${ratio * 100}% + 5px)` }}
                >
                  {value > 0 ? value : ''}
                </span>
                <div
                  className={`bar-chart__bar ${active ? 'is-active' : ''}`}
                  style={{
                    height: `${ratio * 100}%`,
                    background: active ? color : soft,
                  }}
                  title={`${labels[index] || ''} : ${value} ${suffix}`}
                />
              </div>
              <span className="bar-chart__label">{labels[index]}</span>
            </div>
          );
        })}
      </div>
      <p className="sr-only">
        {labels.map((label, index) => `${label} : ${data[index]} ${suffix}`).join(', ')}. Total : {total} {suffix}.
      </p>
    </div>
  );
}
