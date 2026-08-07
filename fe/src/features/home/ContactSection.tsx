import { Footprints, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';

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

        <div className="contact-panel">
          <div className="contact-panel__mail">
            <Mail aria-hidden="true" />
            <a className="contact-panel__address" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <p>{contact.emailNote}</p>
            <Link className="text-link" to={contact.press.href}>
              {contact.press.label}
            </Link>
          </div>

          <aside className="contact-panel__personal">
            <Footprints aria-hidden="true" />
            <h3>{contact.personal.heading}</h3>
            <p>{contact.personal.body}</p>
            <div className="contact-panel__socials">
              {contact.socialLinks.map((link) => (
                <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
