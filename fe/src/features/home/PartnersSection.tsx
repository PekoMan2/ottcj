import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';

export function PartnersSection() {
  const { partners } = siteContent;

  return (
    <section aria-labelledby="partners-title" className="partners-section" id="partneri">
      <Container>
        <h2 className="partners-section__title" id="partners-title">
          {partners.title} <span aria-hidden="true">↓</span>
        </h2>
        <ul className="partner-strip">
          {partners.list.map((partner) => {
            const body = partner.logo ? (
              <img
                alt={partner.logo.alt}
                height={partner.logo.height}
                loading="lazy"
                src={partner.logo.src}
                width={partner.logo.width}
              />
            ) : (
              <strong>{partner.name}</strong>
            );

            return (
              <li
                className={partner.variant ? `partner-strip__item--${partner.variant}` : undefined}
                key={partner.name}
              >
                {partner.label ? (
                  <span className="partner-strip__label">{partner.label}</span>
                ) : null}
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
        </ul>
        <p className="partners-section__open">
          {partners.openSlot.title} →{' '}
          <a href={`mailto:${partners.openSlot.email}`}>{partners.openSlot.email}</a>
        </p>
      </Container>
    </section>
  );
}
