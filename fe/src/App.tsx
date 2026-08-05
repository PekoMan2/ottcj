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
import type { DonioCampaign } from "./features/donio/donioCampaign";
import { DonioCampaignProvider } from "./features/donio/DonioCampaignProvider";
import { EventStateProvider } from "./features/event/EventStateProvider";
import type { EventState } from "./features/event/eventState";
import { useEventState } from "./features/event/eventStateContext";
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
import { TeamSection } from "./features/home/TeamSection";
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

function SiteLayout() {
  const eventState = useEventState();
  const phase =
    eventState.status === "ready" ? eventState.data.phase : "unknown";
  return (
    <div className="site-shell" data-site-phase={phase}>
      <a className="skip-link" href="#main-content">
        preskočiť na obsah
      </a>
      <SiteHeader />

      <main className="site-shell__main" id="main-content">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}

function HomePage() {
  const eventState = useEventState();
  const runtimeState = eventState.status === "ready" ? eventState.data : null;
  return (
    <>
      <HeroCollage eventState={runtimeState} />
      {runtimeState?.phase === "post" && runtimeState.result ? (
        <RunResultPanel result={runtimeState.result} />
      ) : null}
      <CharitySection />
      <RunOverview />
      <JoinRunSection eventState={runtimeState} />
      <StorySection />
      <TeamSection />
      <PartnersSection />
      <ContactSection />
      <FinalCtaSection phase={runtimeState?.phase} />
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
  initialDonioCampaign?: DonioCampaign;
  initialEventState?: EventState;
}

export default function App({
  initialDonioCampaign,
  initialEventState,
}: AppProps) {
  return (
    <EventStateProvider initialState={initialEventState}>
      <DonioCampaignProvider initialData={initialDonioCampaign}>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="press" element={<PressPage />} />
            <Route path="vily" element={<VilyPage />} />
            <Route path="gdpr" element={<GdprPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </DonioCampaignProvider>
    </EventStateProvider>
  );
}
