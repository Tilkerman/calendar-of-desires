import './Header.css';

export default function LogoIcon() {
  return (
    <svg
      className="logo-icon-svg"
      width="260"
      height="100"
      viewBox="0 0 260 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Full header logo: mandala + LUMI wordmark (single SVG so it doesn't disappear on mobile) */}
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Mandala (left) */}
        <g transform="translate(2.5 7.5) scale(0.85)" opacity="0.98" strokeWidth="2.4">
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

        {/* LUMI wordmark (handwritten-like strokes) */}
        <g transform="translate(95 18) skewX(-10)" opacity="0.95" strokeWidth="6.5">
          <path d="M10 8 C8 20, 8 40, 9 58 C9 65, 15 66, 20 65 C35 62, 46 60, 55 58" />
          <path d="M68 14 C67 28, 66 40, 66 48 C66 64, 78 68, 88 66 C98 64, 104 58, 104 48 C104 38, 104 28, 105 14" />
          <path d="M120 62 C119 48, 118 30, 118 18 C118 10, 126 12, 130 18 C138 30, 144 40, 150 48 C156 38, 162 28, 170 18 C174 12, 182 10, 182 18 C182 30, 182 48, 182 62" />
          <path d="M205 18 C205 30, 205 46, 205 62" />
          <circle cx="206" cy="6" r="2.2" fill="currentColor" stroke="none" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}

