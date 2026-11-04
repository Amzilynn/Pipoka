import React from 'react';
import Icon from './Icon';

export default function ToastHost({ toasts = [] }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.tone === 'info' ? 'toast--info' : ''}`}>
          <Icon name={toast.tone === 'info' ? 'bulb' : 'check'} size={17} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
