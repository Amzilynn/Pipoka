import React from 'react';

export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className="switch"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
    />
  );
}

export function SettingRow({ title, description, checked, onChange, control }) {
  return (
    <div className="setting-row">
      <div className="setting-row__text">
        <strong>{title}</strong>
        {description && <span>{description}</span>}
      </div>
      {control || <Switch checked={checked} onChange={onChange} label={title} />}
    </div>
  );
}
