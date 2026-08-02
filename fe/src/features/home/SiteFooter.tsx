import { AtSign } from 'lucide-react';
import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentLinkView } from './ContentMedia';

export function SiteFooter() {
  const { footer, navigation } = siteContent;

  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="site-footer__brand">
          <a aria-label="Majo · Od Tatier k Dunaju — domov" href="/">
            <span>{footer.brandPrefix}</span>
            <strong>{footer.brandName}</strong>
          </a>
          <p>{footer.summary}</p>
        </div>

        <nav aria-label={footer.navigationLabel} className="site-footer__nav">
          {navigation.footer.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>

        <div aria-label={footer.socialLabel} className="site-footer__socials" role="group">
          <AtSign aria-hidden="true" />
          {footer.socialLinks.map((link) => (
            <ContentLinkView key={link.label} link={link} />
          ))}
        </div>
      </Container>
    </footer>
  );
}
