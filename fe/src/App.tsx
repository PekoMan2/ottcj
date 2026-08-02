import { ArrowLeft } from 'lucide-react';
import { Link, Outlet, Route, Routes } from 'react-router';
import {
  Card,
  Container,
  HandwrittenAnnotation,
  Section,
  SectionHeading,
  Stat,
  StickerButton,
} from './components/ui';
import { siteConfig } from './config/site';
import type { SitePhase } from './config/sitePhase';

const phaseLabels: Record<SitePhase, string> = {
  live: 'práve beží',
  post: 'po behu',
  pre: 'pred behom',
};

interface SiteLayoutProps {
  phase: SitePhase;
}

function SiteLayout({ phase }: SiteLayoutProps) {
  return (
    <div className="site-shell" data-site-phase={phase}>
      <header className="site-shell__header">
        <Container className="site-shell__header-inner">
          <Link aria-label="Majo · Od Tatier k Dunaju — domov" className="brand" to="/">
            <span className="brand__uuu">uuu</span>
            <span className="brand__name">MAJO · OTKD</span>
          </Link>
          <p className="phase-label">
            <span className="phase-label__caption">fáza webu:</span>
            <span>{phaseLabels[phase]}</span>
          </p>
        </Container>
      </header>

      <main className="site-shell__main">
        <Outlet />
      </main>

      <footer className="site-shell__footer">
        <Container>
          <p>347 km sólo · verejný prísľub pre Zachráňme Vilyho</p>
        </Container>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <Section aria-labelledby="page-title">
      <Container>
        <div className="foundation-layout">
          <div className="foundation-intro">
            <SectionHeading
              annotation="347 km sólo pre Vilyho"
              eyebrow="verejný prísľub · charitatívny beh"
              level="h1"
              title={<span id="page-title">Od Tatier k Dunaju.</span>}
            />

            <div className="foundation-cta">
              <StickerButton disabled>prisľúbiť podporu →</StickerButton>
              <HandwrittenAnnotation>
                ↳ odkaz na Google formulár čaká na dodanie
              </HandwrittenAnnotation>
            </div>
          </div>

          <Card className="foundation-purpose" rotation="right" tone="cream">
            <p className="foundation-purpose__label">hlavný cieľ</p>
            <h2>Verejný prísľub pre Zachráňme Vilyho.</h2>
            <p>
              Kompletná výzva, príbeh a prísľubový formulár sa pripravujú podľa
              schváleného návrhu a doplneného obsahu.
            </p>
          </Card>
        </div>

        <div aria-label="Kľúčové údaje behu" className="foundation-stats">
          <Stat label="kilometrov" value="347" />
          <Stat label="časový limit" value="84 h" />
          <Stat label="odovzdávok" value="36" />
          <Stat label="bežec" value="1" />
        </div>
      </Container>
    </Section>
  );
}

function NotFoundPage() {
  return (
    <Section aria-labelledby="not-found-title">
      <Container className="not-found">
        <Card rotation="left">
          <HandwrittenAnnotation>chyba 404</HandwrittenAnnotation>
          <h1 id="not-found-title">Táto stránka tu nie je.</h1>
          <Link className="text-link" to="/">
            <ArrowLeft aria-hidden="true" size={18} />
            späť na domovskú stránku
          </Link>
        </Card>
      </Container>
    </Section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout phase={siteConfig.phase} />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
