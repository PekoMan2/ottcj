import { Handshake } from 'lucide-react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentImageView, ContentLinkView } from './ContentMedia';

export function PartnersSection() {
  const { partners } = siteContent;

  return (
    <Section aria-labelledby="partners-title" className="partners-section" id="partneri">
      <Container>
        <SectionHeading
          annotation={partners.annotation}
          eyebrow={partners.eyebrow}
          id="partners-title"
          title={partners.title}
        />

        <div className="partner-tiers">
          {partners.tiers.map((tier) => (
            <section aria-labelledby={`${tier.id}-title`} className={`partner-tier partner-tier--${tier.id}`} key={tier.id}>
              <div className="partner-tier__heading">
                <h3 id={`${tier.id}-title`}>{tier.title}</h3>
                <p>{tier.annotation}</p>
              </div>

              {tier.partners.length > 0 ? (
                <div className="partner-tier__items">
                  {tier.partners.map((partner) => (
                    <article className="partner-card" key={partner.name}>
                      <ContentImageView image={partner.asset} />
                      <div className="partner-card__body">
                        <span className="partner-card__status">{partner.statusLabel}</span>
                        <h4>{partner.name}</h4>
                        <p>{partner.description}</p>
                        <ContentLinkView className="partner-card__link" link={partner.destination} />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="partner-tier__empty" data-content-status="missing">
                  <Handshake aria-hidden="true" />
                  <p>{tier.emptyMessage}</p>
                </div>
              )}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
