import { Card, Container, Section } from '../../components/ui';
import { supportingContent } from '../../config/supportingContent';
import { PageIntro } from './PageIntro';

export function PressPage() {
  const content = supportingContent.press;
  return (
    <>
      <PageIntro annotation="tlačová správa · fotografie · logá · kontakt" eyebrow={content.eyebrow} title={content.title}><p>{content.introduction}</p></PageIntro>
      <Section aria-labelledby="press-assets-title" className="subpage-section">
        <Container>
          <h2 className="subpage-section__title" id="press-assets-title">Materiály na stiahnutie.</h2>
          <div className="asset-grid">
            {content.assets.map((asset) => <Card className="missing-asset" data-content-status="missing" key={asset.label} rotation="left"><strong>{asset.label}</strong><span>{asset.note}</span></Card>)}
          </div>
          <Card className="media-contact" rotation="right" tone="ink"><p>Kontakt pre médiá</p><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></Card>
        </Container>
      </Section>
    </>
  );
}
