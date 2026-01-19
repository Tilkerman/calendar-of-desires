import './Header.css';

export default function LogoIcon() {
  return (
    <svg
      className="logo-icon-svg"
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mandala icon (line art) */}
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.98"
      >
        <circle cx="50" cy="50" r="44" opacity="0.55" />
        <circle cx="50" cy="50" r="36" opacity="0.65" />
        <circle cx="50" cy="50" r="28" opacity="0.85" />

        <g opacity="0.9">
          <path d="M50 10 C44 22, 44 30, 50 38 C56 30, 56 22, 50 10 Z" />
          <path d="M50 90 C44 78, 44 70, 50 62 C56 70, 56 78, 50 90 Z" />
          <path d="M10 50 C22 44, 30 44, 38 50 C30 56, 22 56, 10 50 Z" />
          <path d="M90 50 C78 44, 70 44, 62 50 C70 56, 78 56, 90 50 Z" />

          <path d="M22 22 C32 28, 36 32, 40 40 C32 36, 28 32, 22 22 Z" />
          <path d="M78 22 C68 28, 64 32, 60 40 C68 36, 72 32, 78 22 Z" />
          <path d="M22 78 C28 68, 32 64, 40 60 C36 68, 32 72, 22 78 Z" />
          <path d="M78 78 C72 68, 68 64, 60 60 C64 68, 68 72, 78 78 Z" />
        </g>

        <g opacity="0.95">
          <path d="M50 30 C45 38, 45 44, 50 50 C55 44, 55 38, 50 30 Z" />
          <path d="M50 70 C45 62, 45 56, 50 50 C55 56, 55 62, 50 70 Z" />
          <path d="M30 50 C38 45, 44 45, 50 50 C44 55, 38 55, 30 50 Z" />
          <path d="M70 50 C62 45, 56 45, 50 50 C56 55, 62 55, 70 50 Z" />
        </g>

        <circle cx="50" cy="50" r="6" />
        <path d="M50 44 L50 56" opacity="0.6" />
        <path d="M44 50 L56 50" opacity="0.6" />
      </g>
    </svg>
  );
}

