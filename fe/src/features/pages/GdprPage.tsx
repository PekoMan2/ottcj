import { Card, Container, Section } from '../../components/ui';
import { supportingContent } from '../../config/supportingContent';
import { PageIntro } from './PageIntro';

export function GdprPage() {
  const content = supportingContent.gdpr;
  return (
    <>
      <PageIntro eyebrow={content.eyebrow} title={content.title}><p>{content.introduction}</p></PageIntro>
      <Section aria-labelledby="gdpr-missing-title" className="subpage-section legal-page">
        <Container>
          <Card rotation="left">
            <p className="legal-warning">{content.warning}</p>
            <h2 id="gdpr-missing-title">Čo musí obsahovať finálna verzia.</h2>
            <ul>{content.missingItems.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>Tento zoznam nie je právnym stanoviskom ani finálnou informáciou o spracovaní osobných údajov.</p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
