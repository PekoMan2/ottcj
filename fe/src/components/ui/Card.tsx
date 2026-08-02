import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  rotation?: 'left' | 'none' | 'right';
  tone?: 'cream' | 'ink' | 'paper';
}

export function Card({
  className,
  rotation = 'none',
  tone = 'paper',
  ...props
}: CardProps) {
  const classes = [
    'paper-card',
    tone === 'cream' ? 'paper-card--cream' : undefined,
    tone === 'ink' ? 'paper-card--ink' : undefined,
    rotation === 'left' ? 'paper-card--left' : undefined,
    rotation === 'right' ? 'paper-card--right' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}
