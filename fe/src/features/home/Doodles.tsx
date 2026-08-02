interface DoodleProps {
  className?: string;
}

const hiddenSvgProps = {
  'aria-hidden': true,
  focusable: false,
} as const;

export function SunDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 130 130">
      <g fill="none" stroke="#f9a825" strokeLinecap="round" strokeWidth="4">
        <path d="M65 10v18m0 74v18M10 65h18m74 0h18M22 22l13 13m60 0 13-13m-86 86 13-13m60 0 13 13" />
      </g>
      <circle cx="65" cy="65" fill="#ffeb3b" r="32" stroke="#f9a825" strokeWidth="3" />
      <circle cx="55" cy="60" fill="#0f1419" r="3" />
      <circle cx="75" cy="60" fill="#0f1419" r="3" />
      <path d="M52 72q13 10 26 0" fill="none" stroke="#0f1419" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

export function MountainsDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 260 130">
      <path d="m10 118 50-96 35 46 35-56 40 43 40-23 40 68v25H10z" fill="#4caf50" stroke="#0f1419" strokeLinejoin="miter" strokeWidth="3" />
      <path d="m60 22-10 12 10-2 8 8 10-10zm70-10-10 14 10-2 10 8 8-8z" fill="#fff" stroke="#0f1419" strokeWidth="1.5" />
    </svg>
  );
}

export function HaluskyDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 100 90">
      <ellipse cx="50" cy="72" fill="#8b7355" rx="42" ry="10" stroke="#0f1419" strokeWidth="2" />
      <path d="M8 65q0-20 42-20t42 20z" fill="#f5f1eb" stroke="#0f1419" strokeWidth="2" />
      <g fill="#fdfcf9" stroke="#0f1419">
        <circle cx="30" cy="52" r="6" /><circle cx="45" cy="48" r="6" /><circle cx="62" cy="50" r="6" /><circle cx="75" cy="55" r="5" />
      </g>
      <circle cx="38" cy="58" fill="#5d4037" r="4" /><circle cx="55" cy="56" fill="#5d4037" r="3" />
      <path d="M30 30q2-10 10-5m10 3q5-13 12-6" fill="none" stroke="#999" strokeWidth="1.5" />
    </svg>
  );
}

export function KamzikDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 150 130">
      <path d="M35 85q-5-25 10-30l10-10 15-2 20 2 15 5 10 10 3 20-3 20-10 5-10 3H55l-15-3z" fill="#8b6f47" stroke="#0f1419" strokeWidth="2.5" />
      <path d="M62 42Q58 25 55 8m25 34q4-17 7-34" fill="none" stroke="#0f1419" strokeLinecap="round" strokeWidth="2.5" />
      <circle cx="60" cy="55" fill="#0f1419" r="2" />
      <path d="m55 105-3 20m18-18-2 18m22-18 2 18m13-20 3 20" stroke="#0f1419" strokeWidth="3" />
      <path d="M50 80q25 10 55 0" fill="#d4b896" />
      <text x="84" y="38" fill="#0f1419" fontFamily="Prompt, sans-serif" fontSize="25" fontStyle="italic" fontWeight="200">uuu</text>
    </svg>
  );
}

export function SlovakiaRouteDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 460 220">
      <path d="M30 90Q25 60 60 55q40-10 90-5 50 5 100 5 50 5 100 10 50 5 80 25 5 20-10 40-20 15-50 15-50 0-90-5-60 5-120 15-60 10-100 0-30-10-30-35z" fill="none" opacity=".6" stroke="#8b7355" strokeLinecap="round" strokeWidth="2" />
      <path d="M340 70q-20 20-40 30-40 10-80 15-40 5-80 10-40 5-70 10" fill="none" opacity=".9" stroke="#e8622d" strokeLinecap="round" strokeWidth="6" />
      <path d="M340 70q-20 20-40 30-40 10-80 15-40 5-80 10-40 5-70 10" fill="none" stroke="#fdfcf9" strokeDasharray="3 5" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="340" cy="70" fill="#e51a1a" r="7" stroke="#0f1419" strokeWidth="2" />
      <circle cx="70" cy="135" fill="#0f1419" r="7" />
    </svg>
  );
}

export function AmbulanceDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 80 60">
      <rect fill="#fdfcf9" height="30" rx="2" stroke="#0f1419" strokeWidth="2.5" width="60" x="8" y="18" />
      <rect fill="#f5f1eb" height="18" stroke="#0f1419" strokeWidth="2" width="20" x="8" y="18" />
      <path d="M65 30V15h10v15" fill="#3ab44a" stroke="#0f1419" strokeWidth="2" />
      <circle cx="20" cy="52" fill="#0f1419" r="6" /><circle cx="55" cy="52" fill="#0f1419" r="6" />
      <path d="M42 24h4v18h-4zm-7 7h18v4H35z" fill="#e51a1a" />
    </svg>
  );
}

export function CatDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 110 110">
      <path d="m30 55-8-30 18 15 15-2 15 2 18-15-8 30q8 13 2 27-7 13-27 13T28 82q-6-14 2-27z" fill="#e8a957" stroke="#0f1419" strokeWidth="2.5" />
      <path d="m25 33 7 12 8-5m45-7-7 12-8-5" fill="#f5c77f" stroke="#0f1419" strokeWidth="1.5" />
      <ellipse cx="42" cy="62" fill="#0f1419" rx="10" ry="7" /><ellipse cx="68" cy="62" fill="#0f1419" rx="10" ry="7" />
      <path d="M52 62h6m-26 0-10-2m56 2 10-2M52 76l3 4 3-4zM55 80v4m-20-4 10 2m-10 4 10-1m30-5-10 2m10 4-10-1" fill="none" stroke="#0f1419" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 90 40">
      <path d="M5 30q25-20 55-15h15l-7-7m7 7-7 7" fill="none" stroke="#e51a1a" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function HeartDoodle({ className }: DoodleProps) {
  return (
    <svg {...hiddenSvgProps} className={className} viewBox="0 0 48 44">
      <path d="M24 40 6 23C-5 11 11-4 24 9 37-4 53 11 42 23z" fill="#e51a1a" stroke="#0f1419" strokeWidth="2.5" />
    </svg>
  );
}
