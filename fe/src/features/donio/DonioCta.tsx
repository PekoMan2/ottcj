import { siteContent } from '../../config/content';

interface DonioCtaProps {
  className?: string;
  size?: 'big' | 'compact' | 'default';
}

export function DonioCta({ className, size = 'default' }: DonioCtaProps) {
  const classes = [
    'donate-cta',
    size === 'compact' ? 'donate-cta--compact' : undefined,
    size === 'big' ? 'donate-cta--big' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      className={classes}
      href={siteContent.charity.campaign.destinationUrl}
      rel="noreferrer"
      target="_blank"
    >
      {size === 'compact' ? 'prispej →' : 'Prispej Vilkovi →'}
    </a>
  );
}
