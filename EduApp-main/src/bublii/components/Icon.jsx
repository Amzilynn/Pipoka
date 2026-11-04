import React from 'react';

const paths = {
  home: (
    <>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6.5h4V21h3.5a1 1 0 0 0 1-1V9.5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.6C10 5 6.8 4.4 3.5 5v13.4c3.3-.6 6.5 0 8.5 1.6 2-1.6 5.2-2.2 8.5-1.6V5C17.2 4.4 14 5 12 6.6Z" />
      <path d="M12 6.6V20" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.6a8.5 8.5 0 0 1-8.5 8.4H8.4L4 23v-5.6A8.5 8.5 0 1 1 21 11.6Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  move: (
    <>
      <circle cx="12" cy="5" r="2.4" />
      <path d="M9.5 21v-3.4L7 15.2M14.5 21v-3.4L17 15" />
      <path d="M8 10.5 12 9l4 1.5" />
      <path d="m12 9-1 5 3.5 3.5" />
      <path d="M4 7.5h2M18 7.5h2M3 12h1.5M19.5 12H21" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-7.5" />
      <path d="M12 14C12 9 8.2 6 2.8 6 2.8 11 6.5 14 12 14Z" />
      <path d="M12 14c0-4.4 3.2-7.5 8.2-7.5 0 4.5-3.2 7.5-8.2 7.5Z" />
      <path d="M7.5 21h9" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1.1 6.1-5.5-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9Z" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4V7a3.5 3.5 0 0 0 3.5 3.5M17 5.5h3V7a3.5 3.5 0 0 1-3.5 3.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h7M15 6h5M4 12h2M10 12h10M4 18h10M18 18h2" />
      <circle cx="13" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M16 3v4M8 3v4M3 10.5h18" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 3v18h17" />
      <path d="m7.5 15 3.5-4 3 3 4.5-6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  volume: (
    <>
      <path d="M11 5 6.5 9H2.5v6h4L11 19V5Z" />
      <path d="M15.5 8.6a5 5 0 0 1 0 6.8M18.4 5.7a9 9 0 0 1 0 12.6" />
    </>
  ),
  volumeOff: (
    <>
      <path d="M11 5 6.5 9H2.5v6h4L11 19V5Z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </>
  ),
  check: <path d="m5 13 4.5 4.5L19.5 7" />,
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.9 4.9L19 9.8l-5.1 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9Z" />
      <path d="M19 15.5 19.8 18l2.2.8-2.2.9-.8 2.3-.9-2.3-2.1-.9 2.1-.8Z" />
    </>
  ),
  spark: <path d="m12 4 1.7 5.3L19 11l-5.3 1.7L12 18l-1.7-5.3L5 11l5.3-1.7Z" />,
  flame: (
    <path d="M12 22c4 0 7-2.9 7-6.8 0-3-2-5.8-4-7.9 0 2-1 3.2-2.1 4.1.1-3-2-6.2-4.2-8.4.1 4.2-3.7 6.9-3.7 12.2C5 19.1 8 22 12 22Z" />
  ),
  heart: (
    <path d="M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.7Z" />
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4.4 12.4c.7.6 1.2 1.5 1.2 2.4V18h6.4v-1.2c0-.9.5-1.8 1.2-2.4A7 7 0 0 0 12 2Z" />
    </>
  ),
  arrowRight: <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />,
  arrowLeft: <path d="M19.5 12h-15M11 5.5 4.5 12l6.5 6.5" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 5.5 6.5 6.5L9 18.5" />,
  chevronLeft: <path d="M15 5.5 8.5 12l6.5 6.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  play: <path d="M8 5.2v13.6L19 12 8 5.2Z" />,
  pause: (
    <>
      <path d="M8 5v14M16 5v14" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
      <path d="M20.5 3.5V9H15" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14.2c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3.6 8-9.5V5.2L12 2.5 4 5.2v7.3C4 18.4 12 22 12 22Z" />
      <path d="m8.8 12 2.2 2.2 4.4-4.4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18s-3-1.5-3-8.5" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  hand: (
    <>
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v8" />
      <path d="M17 13.5V10a1.5 1.5 0 0 1 3 0v4.5A7.5 7.5 0 0 1 12.5 22h-1a6 6 0 0 1-4.2-1.8L3.5 16a1.6 1.6 0 0 1 2.4-2.1L8 16" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7" />
    </>
  ),
  puzzle: (
    <path d="M9.5 4.5a2.5 2.5 0 0 1 5 0V6h3a2 2 0 0 1 2 2v3h-1.5a2.5 2.5 0 0 0 0 5H19.5v3a2 2 0 0 1-2 2h-3v-1.5a2.5 2.5 0 0 0-5 0V21h-3a2 2 0 0 1-2-2v-3h1.5a2.5 2.5 0 0 0 0-5H4.5V8a2 2 0 0 1 2-2h3V4.5Z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </>
  ),
  school: (
    <>
      <path d="M3 21V9.5L12 3l9 6.5V21" />
      <path d="M9 21v-6h6v6M3 21h18" />
    </>
  ),
};

export default function Icon({ name, size = 20, strokeWidth = 2, className = '', filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}
