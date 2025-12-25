import type React from 'react';

interface ContactIconProps {
  fillPct: number; // 0..1
  size?: number; // px
  title: string;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function FilledIcon({
  title,
  fillPct,
  children,
  viewBox = '0 0 24 24',
}: {
  title: string;
  fillPct: number;
  children: React.ReactNode;
  viewBox?: string;
}) {
  const pct = clamp01(fillPct);
  const insetTopPct = (1 - pct) * 100;

  return (
    <svg className="contact-svg" viewBox={viewBox} role="img" aria-label={title}>
      {/* base (серый контур/фон) */}
      <g className="contact-svg-base">{children}</g>

      {/* fill (цветная заливка снизу вверх) */}
      {pct > 0 && (
        <g className="contact-svg-fill" style={{ clipPath: `inset(${insetTopPct}% 0 0 0)` }}>
          {children}
        </g>
      )}
    </svg>
  );
}

export function NoteIcon({ fillPct, title }: ContactIconProps) {
  return (
    <FilledIcon title={title} fillPct={fillPct}>
      {/* Похоже на 📝: лист с загнутым уголком + строки */}
      <path
        d="M7 2.5h8.2L18.5 5.8V21.5H7V2.5zm8.5 1.9V6.5h2.1L15.5 4.4z"
        fill="currentColor"
      />
      <path d="M9 9h7v1.6H9V9zm0 3.3h7v1.6H9v-1.6zm0 3.3h5.2v1.6H9v-1.6z" fill="currentColor" />
    </FilledIcon>
  );
}

export function StepIcon({ fillPct, title }: ContactIconProps) {
  return (
    <FilledIcon title={title} fillPct={fillPct}>
      {/* Похоже на 👣: два отпечатка + пальцы */}
      {/* Левый отпечаток */}
      <path d="M8.2 6.2c1.6 0 2.8 1.4 2.8 3.2 0 2.7-1.7 4.8-3.9 5.1-1.7.3-3.1-.7-3.1-2.2 0-2.0 1.8-6.1 4.2-6.1z" fill="currentColor" />
      <circle cx="6.2" cy="5.4" r="0.85" fill="currentColor" />
      <circle cx="7.4" cy="4.7" r="0.8" fill="currentColor" />
      <circle cx="8.7" cy="4.5" r="0.75" fill="currentColor" />
      <circle cx="10.0" cy="4.9" r="0.7" fill="currentColor" />
      {/* Правый отпечаток */}
      <path d="M16.3 10.7c1.4 0 2.5 1.2 2.5 2.8 0 2.3-1.4 4.0-3.3 4.3-1.4.2-2.6-.6-2.6-1.9 0-1.8 1.2-5.2 3.4-5.2z" fill="currentColor" />
      <circle cx="14.7" cy="9.9" r="0.75" fill="currentColor" />
      <circle cx="15.8" cy="9.4" r="0.7" fill="currentColor" />
      <circle cx="17.0" cy="9.3" r="0.65" fill="currentColor" />
      <circle cx="18.1" cy="9.6" r="0.6" fill="currentColor" />
    </FilledIcon>
  );
}

export function ThoughtIcon({ fillPct, title }: ContactIconProps) {
  return (
    <FilledIcon title={title} fillPct={fillPct}>
      {/* Похоже на 💭: облако мысли + две точки */}
      <path
        d="M9.3 18.8h7.7c1.9 0 3.2-1.1 3.2-2.8 0-1.4-0.9-2.5-2.3-2.7-.3-2.1-2.0-3.8-4.5-3.8-2.1 0-3.9 1.2-4.5 3.1-1.9.2-3.4 1.6-3.4 3.4 0 1.8 1.4 2.8 3.8 2.8z"
        fill="currentColor"
      />
      <circle cx="6.7" cy="20.2" r="1.05" fill="currentColor" />
      <circle cx="5.0" cy="22.0" r="0.75" fill="currentColor" />
    </FilledIcon>
  );
}


