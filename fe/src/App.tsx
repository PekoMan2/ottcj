import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router";
import {
  Card,
  Container,
  HandwrittenAnnotation,
  Section,
} from "./components/ui";
import {
  eventState as configuredEventState,
  type EventState,
} from "./features/event/eventState";
import { CharitySection } from "./features/home/CharitySection";
import { ContactSection } from "./features/home/ContactSection";
import { FinalCtaSection } from "./features/home/FinalCtaSection";
import { HeroCollage } from "./features/home/HeroCollage";
import { JoinRunSection } from "./features/home/JoinRunSection";
import { PartnersSection } from "./features/home/PartnersSection";
import { RunOverview } from "./features/home/RunOverview";
import { SiteHeader } from "./features/home/SiteHeader";
import { SiteFooter } from "./features/home/SiteFooter";
import { StorySection } from "./features/home/StorySection";
import { RunResultPanel } from "./features/home/RunResultPanel";
import { GdprPage } from "./features/pages/GdprPage";
import { PressPage } from "./features/pages/PressPage";
import { VilyPage } from "./features/pages/VilyPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // POP is back/forward navigation, the browser restores scroll itself
    if (navigationType === "POP") return;
    window.scrollTo({ behavior: "instant", left: 0, top: 0 });
  }, [navigationType, pathname]);

  return null;
}

function SiteLayout({ eventState }: { eventState: EventState }) {
  return (
    <div className="site-shell" data-site-phase={eventState.phase}>
      <a className="skip-link" href="#main-content">
        preskočiť na obsah
      </a>
      <SiteHeader eventState={eventState} />

      <main className="site-shell__main" id="main-content">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}

function HomePage({ eventState }: { eventState: EventState }) {
  return (
    <>
      <HeroCollage eventState={eventState} />
      {eventState.phase === "post" && eventState.result ? (
        <RunResultPanel result={eventState.result} />
      ) : null}
      <CharitySection />
      <RunOverview />
      <JoinRunSection eventState={eventState} />
      <StorySection />
      <PartnersSection />
      <ContactSection />
      <FinalCtaSection phase={eventState.phase} />
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
  eventState?: EventState;
}

export default function App({ eventState = configuredEventState }: AppProps) {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout eventState={eventState} />}>
          <Route index element={<HomePage eventState={eventState} />} />
          <Route path="press" element={<PressPage />} />
          <Route path="vily" element={<VilyPage />} />
          <Route path="gdpr" element={<GdprPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
