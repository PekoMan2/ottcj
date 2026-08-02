import { ArrowLeft } from 'lucide-react';
import { Link, Outlet, Route, Routes } from 'react-router';
import { Card, Container, HandwrittenAnnotation, Section } from './components/ui';
import { siteConfig, type SiteConfig } from './config/site';
import { CharitySection } from './features/home/CharitySection';
import { HeroCollage } from './features/home/HeroCollage';
import { SiteHeader } from './features/home/SiteHeader';

interface SiteLayoutProps {
  config: SiteConfig;
}

function SiteLayout({ config }: SiteLayoutProps) {
  return (
    <div className="site-shell" data-site-phase={config.phase}>
      <a className="skip-link" href="#main-content">preskočiť na obsah</a>
      <SiteHeader config={config} />

      <main className="site-shell__main" id="main-content">
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

function HomePage({ config }: SiteLayoutProps) {
  return (
    <>
      <HeroCollage config={config} />
      <CharitySection config={config} />
    </>
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

interface AppProps {
  config?: SiteConfig;
}

export default function App({ config = siteConfig }: AppProps) {
  return (
    <Routes>
      <Route element={<SiteLayout config={config} />}>
        <Route index element={<HomePage config={config} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
