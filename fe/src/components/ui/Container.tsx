import type { HTMLAttributes } from 'react';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  const classes = ['layout-container', className].filter(Boolean).join(' ');

  return <div className={classes} {...props} />;
}
