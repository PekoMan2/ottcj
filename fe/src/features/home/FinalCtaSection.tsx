import { ArrowDownLeft } from 'lucide-react';
import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { SitePhase } from '../../config/sitePhase';
import { DonioCta } from '../donio/DonioCta';

interface FinalCtaSectionProps {
  phase?: SitePhase;
}

export function FinalCtaSection({ phase }: FinalCtaSectionProps) {
  const { finalCta } = siteContent;
  if (phase === 'post') return null;

  return (
    <section aria-labelledby="final-cta-title" className="final-cta-section">
      <Container className="final-cta-section__inner">
        <ArrowDownLeft aria-hidden="true" className="final-cta-section__arrow" />
        <p className="final-cta-section__eyebrow">{finalCta.eyebrow}</p>
        <h2 id="final-cta-title">{finalCta.title}</h2>
        <p className="final-cta-section__body">{finalCta.body}</p>
        <DonioCta size="big" />
        <p className="final-cta-section__annotation">{finalCta.annotation}</p>
      </Container>
    </section>
  );
}
