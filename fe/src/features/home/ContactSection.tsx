import { AtSign, Handshake, Mail } from 'lucide-react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentLinkView } from './ContentMedia';

const contactIcons = {
  media: Mail,
  personal: AtSign,
  sponsors: Handshake,
} as const;

export function ContactSection() {
  const { contact } = siteContent;

  return (
    <Section aria-labelledby="contact-title" className="contact-section" id="kontakt">
      <Container>
        <SectionHeading
          annotation={contact.annotation}
          eyebrow={contact.eyebrow}
          id="contact-title"
          title={contact.title}
        />

        <div className="contact-grid">
          {contact.channels.map((channel, index) => {
            const Icon = contactIcons[channel.id as keyof typeof contactIcons] ?? Mail;

            return (
              <article className={`contact-card contact-card--${index + 1}`} key={channel.id}>
                <Icon aria-hidden="true" />
                <h3>{channel.title}</h3>
                <p>{channel.description}</p>
                <div className="contact-card__links">
                  {channel.links.map((link) => (
                    <ContentLinkView className="contact-link" key={link.label} link={link} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
