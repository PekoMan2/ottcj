import { ExternalLink } from 'lucide-react';
import { Card, Container, Section } from '../../components/ui';
import { siteContent } from '../../config/content';
import { supportingContent } from '../../config/supportingContent';
import { PageIntro } from './PageIntro';

export function VilyPage() {
  const { charity } = siteContent;
  const content = supportingContent.vily;
  return (
    <>
      <PageIntro annotation="dva ľudia · dve cesty · jeden spoločný cieľ" eyebrow={content.eyebrow} title={content.title} />
      <Section aria-labelledby="vily-story-title" className="subpage-section vily-page">
        <Container>
          <Card rotation="left" tone="cream">
            <h2 id="vily-story-title">Prečo táto cesta pokračuje.</h2>
            <p>{charity.story.introduction}</p>
            <p className="vily-page__accent">{charity.story.accent}</p>
            <a className="sticker-button" href={charity.campaign.destinationUrl}>{charity.campaign.destinationLabel} <ExternalLink aria-hidden="true" size={18} /></a>
          </Card>
          {content.additionalSections.map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.body}</p></article>)}
        </Container>
      </Section>
    </>
  );
}
