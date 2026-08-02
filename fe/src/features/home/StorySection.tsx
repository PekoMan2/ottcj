import { ArrowUpRight } from 'lucide-react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentLinkView } from './ContentMedia';

export function StorySection() {
  const { story } = siteContent;

  return (
    <Section aria-labelledby="story-title" className="story-section" id="pribeh">
      <Container>
        <SectionHeading
          annotation={story.annotation}
          eyebrow={story.eyebrow}
          id="story-title"
          title={story.title}
        />

        <div className="story-section__grid">
          <article className="story-biography" data-content-status={story.biography.status}>
            <p className="story-biography__label">BIO ČAKÁ NA DODANIE</p>
            <p>{story.biography.placeholder}</p>
          </article>

          <figure className="interview-card">
            <p className="interview-card__source">Refresher rozhovor</p>
            <blockquote>
              <p>{story.quote}</p>
            </blockquote>
            <figcaption>
              <strong>— {story.quoteAttribution}</strong>
              <span>{story.quoteStatus}</span>
            </figcaption>
            <ContentLinkView className="interview-card__cta" link={story.interview} />
            <ArrowUpRight aria-hidden="true" className="interview-card__arrow" />
          </figure>
        </div>
      </Container>
    </Section>
  );
}
