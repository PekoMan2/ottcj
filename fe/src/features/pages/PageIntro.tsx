import type { ReactNode } from 'react';
import { Container, SectionHeading } from '../../components/ui';

interface PageIntroProps {
  actions?: ReactNode;
  annotation?: ReactNode;
  children?: ReactNode;
  eyebrow: string;
  title: string;
}

export function PageIntro({ actions, annotation, children, eyebrow, title }: PageIntroProps) {
  return (
    <section className="subpage-hero">
      <Container className="subpage-hero__inner">
        <SectionHeading annotation={annotation} eyebrow={eyebrow} level="h1" title={title} />
        {children ? <div className="subpage-hero__copy">{children}</div> : null}
        {actions ? <div className="subpage-actions">{actions}</div> : null}
      </Container>
    </section>
  );
}
