import { Flag, MapPinned } from 'lucide-react';
import { Container, Section, SectionHeading, Stat } from '../../components/ui';
import { siteContent } from '../../config/content';
import { RouteMapPanel } from '../route/RouteMapPanel';

export function RunOverview() {
  const { runOverview } = siteContent;

  return (
    <Section aria-labelledby="route-title" className="run-overview" id="trasa">
      <Container>
        <div className="run-overview__editorial">
          <SectionHeading
            annotation={runOverview.annotation}
            eyebrow={runOverview.eyebrow}
            id="route-title"
            title={runOverview.title}
          />
          <p className="run-overview__lead">{runOverview.introduction}</p>
        </div>

        <div aria-label="Základné údaje trasy" className="run-overview__route">
          <div className="route-point route-point--start">
            <MapPinned aria-hidden="true" />
            <span>štart</span>
            <strong>{runOverview.route.start}</strong>
          </div>
          <div aria-hidden="true" className="route-line">
            <span>{runOverview.route.distance}</span>
          </div>
          <div className="route-point route-point--finish">
            <Flag aria-hidden="true" />
            <span>cieľ</span>
            <strong>{runOverview.route.finish}</strong>
          </div>
        </div>

        <div aria-label="Kredibilita behu" className="run-overview__facts" role="list">
          {runOverview.facts.map((fact, index) => (
            <div className={`run-fact run-fact--${index + 1}`} key={fact.label} role="listitem">
              <Stat label={fact.label} value={fact.value} />
            </div>
          ))}
        </div>

        <RouteMapPanel />
      </Container>
    </Section>
  );
}
