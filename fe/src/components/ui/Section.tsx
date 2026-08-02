import type { HTMLAttributes } from 'react';

export type SectionProps = HTMLAttributes<HTMLElement>;

export function Section({ className, ...props }: SectionProps) {
  const classes = ['layout-section', className].filter(Boolean).join(' ');

  return <section className={classes} {...props} />;
}
