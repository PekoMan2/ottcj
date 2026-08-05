import { Handshake } from 'lucide-react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';

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

        <ul className="partner-wall">
          {partners.list.map((partner, index) => {
            const body = (
              <>
                {partner.logo ? (
                  <img
                    alt={partner.logo.alt}
                    className="partner-chip__logo"
                    height={partner.logo.height}
                    loading="lazy"
                    src={partner.logo.src}
                    width={partner.logo.width}
                  />
                ) : null}
                <strong>{partner.name}</strong>
              </>
            );

            return (
              <li className={`partner-chip partner-chip--${(index % 4) + 1}`} key={partner.name}>
                {partner.href ? (
                  <a href={partner.href} rel="noreferrer" target="_blank">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
          <li className="partner-chip partner-chip--open">
            <Handshake aria-hidden="true" />
            <strong>{partners.openSlot.title}</strong>
            <p>{partners.openSlot.body}</p>
            <a href={`mailto:${partners.openSlot.email}`}>{partners.openSlot.email}</a>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
