/* ============================================================
   APP LOGO – inline SVG brand mark
   ============================================================ */
interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 28, className }: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Personal Power II Journal"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="15" stroke="url(#logo-gradient)" strokeWidth="2" />
      {/* Lightning bolt */}
      <path
        d="M18.5 4L9 18h7l-2.5 10L23 14h-7l2.5-10z"
        fill="url(#logo-gradient)"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5c842" />
          <stop offset="100%" stopColor="#e8890c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
