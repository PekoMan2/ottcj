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
