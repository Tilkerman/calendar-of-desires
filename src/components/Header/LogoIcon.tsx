import './Header.css';

export default function LogoIcon() {
  return (
    <svg
      className="logo-icon-svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Хвост звезды (падающая звезда - градиентный эффект) */}
      <path
        d="M6 20L11 15L9 13L4 18L6 20Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M4 18L9 13L7 11L2 16L4 18Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M2 16L7 11L5 9L0 14L2 16Z"
        fill="currentColor"
        opacity="0.2"
      />
      
      {/* Звезда (в центре) */}
      <path
        d="M14 6L15.5 10L19.5 11.5L15.5 13L14 17L12.5 13L8.5 11.5L12.5 10L14 6Z"
        fill="currentColor"
      />
      
      {/* Буква C (Calendar) - стилизованная */}
      <path
        d="M20 9C20 9 22.5 9 22.5 11.5C22.5 14 20 14 20 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Буква D (Desires) - стилизованная */}
      <path
        d="M22.5 9V15.5M22.5 9C22.5 9 25 9 25 11.5C25 14 22.5 14 22.5 14V15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

