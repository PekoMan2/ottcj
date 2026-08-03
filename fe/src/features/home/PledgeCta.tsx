interface PledgeCtaProps {
  className?: string;
  compact?: boolean;
  href?: string;
}

export function PledgeCta({ className, compact = false, href }: PledgeCtaProps) {
  const classes = [
    'pledge-cta',
    compact ? 'pledge-cta--compact' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const label = compact ? 'prísľub →' : 'prisľúbiť podporu →';

  if (href) {
    return (
      <a className={classes} href={href}>
        {label}
      </a>
    );
  }

  return (
    <button
      aria-label={`${label.replace(' →', '')} — formulár pripravujeme`}
      className={`${classes} pledge-cta--disabled`}
      disabled
      type="button"
    >
      {compact ? 'prísľub · čoskoro' : 'formulár pripravujeme'}
    </button>
  );
}
