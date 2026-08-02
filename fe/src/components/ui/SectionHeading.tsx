import type { ReactNode } from 'react';
import { HandwrittenAnnotation } from './HandwrittenAnnotation';

export interface SectionHeadingProps {
  annotation?: ReactNode;
  eyebrow?: ReactNode;
  level?: 'h1' | 'h2' | 'h3';
  title: ReactNode;
}

export function SectionHeading({
  annotation,
  eyebrow,
  level: Heading = 'h2',
  title,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <Heading className="section-heading__title">{title}</Heading>
      {annotation ? (
        <HandwrittenAnnotation>{annotation}</HandwrittenAnnotation>
      ) : null}
    </div>
  );
}
