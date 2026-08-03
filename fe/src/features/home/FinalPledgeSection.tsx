import { ArrowDownLeft } from 'lucide-react';
import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { SiteConfig } from '../../config/site';
import type { SitePhase } from '../../config/sitePhase';
import { PledgeCta } from './PledgeCta';

interface FinalPledgeSectionProps {
  config: SiteConfig;
  phase?: SitePhase;
}

export function FinalPledgeSection({ config, phase }: FinalPledgeSectionProps) {
  const { finalPledge } = siteContent;
  if (phase === 'post') return null;

  return (
    <section aria-labelledby="final-pledge-title" className="final-pledge-section">
      <Container className="final-pledge-section__inner">
        <ArrowDownLeft aria-hidden="true" className="final-pledge-section__arrow" />
        <p className="final-pledge-section__eyebrow">{finalPledge.eyebrow}</p>
        <h2 id="final-pledge-title">{finalPledge.title}</h2>
        <p className="final-pledge-section__body">{finalPledge.body}</p>
        <PledgeCta href={config.pledgeFormUrl} />
        <p className="final-pledge-section__annotation">{finalPledge.annotation}</p>
      </Container>
    </section>
  );
}
