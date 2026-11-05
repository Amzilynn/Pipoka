import React, { useState } from 'react';
export default function ChildAvatar({ child, className = '', size, decorative = true }) {
  const [failed, setFailed] = useState(null);
  const photo = child.photoUrl && failed !== child.photoUrl;
  return <span className={`child-avatar ${className}`} style={{ background: child.avatar.bg, color: child.avatar.color, ...(size ? { width: size, height: size } : {}) }} aria-hidden={decorative || undefined}>
    {photo ? <img src={child.photoUrl} alt={decorative ? '' : `Photo de ${child.firstName}`} onError={() => setFailed(child.photoUrl)} /> : child.avatar.initial}
  </span>;
}
