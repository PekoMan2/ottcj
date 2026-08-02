import { ArrowLeft } from 'lucide-react';
import { Link, Outlet, Route, Routes } from 'react-router';
import { Card, Container, HandwrittenAnnotation, Section } from './components/ui';
import { siteConfig, type SiteConfig } from './config/site';
import { CharitySection } from './features/home/CharitySection';
import { ContactSection } from './features/home/ContactSection';
import { FinalPledgeSection } from './features/home/FinalPledgeSection';
import { HeroCollage } from './features/home/HeroCollage';
import { PartnersSection } from './features/home/PartnersSection';
import { RunOverview } from './features/home/RunOverview';
import { SiteHeader } from './features/home/SiteHeader';
import { SiteFooter } from './features/home/SiteFooter';
import { StorySection } from './features/home/StorySection';
import { TeamSection } from './features/home/TeamSection';

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

      <SiteFooter />
    </div>
  );
}

function HomePage({ config }: SiteLayoutProps) {
  return (
    <>
      <HeroCollage config={config} />
      <CharitySection config={config} />
      <RunOverview />
      <StorySection />
      <TeamSection />
      <PartnersSection />
      <ContactSection />
      <FinalPledgeSection config={config} />
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
