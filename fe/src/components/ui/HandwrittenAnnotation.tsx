import type { HTMLAttributes } from 'react';

export type HandwrittenAnnotationProps = HTMLAttributes<HTMLParagraphElement>;

export function HandwrittenAnnotation({
  className,
  ...props
}: HandwrittenAnnotationProps) {
  const classes = ['handwritten-annotation', className]
    .filter(Boolean)
    .join(' ');

  return <p className={classes} {...props} />;
}
