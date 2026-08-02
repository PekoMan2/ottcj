import majoPhotoPlaceholder from '../../assets/majo-photo-placeholder.svg';
import { Container, Stat } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { SiteConfig } from '../../config/site';
import {
  AmbulanceDoodle,
  ArrowDoodle,
  CatDoodle,
  HaluskyDoodle,
  KamzikDoodle,
  MountainsDoodle,
  SlovakiaRouteDoodle,
  SunDoodle,
} from './Doodles';
import { PledgeCta } from './PledgeCta';

interface HeroCollageProps {
  config: SiteConfig;
}

function DistanceWordArt() {
  return (
    <div aria-label="347 kilometrov" className="distance-wordart" role="img">
      <svg aria-hidden="true" className="distance-wordart__scribble" viewBox="0 0 240 100">
        <path d="M40 20Q15 25 15 55t50 35q65 5 125-8 35-10 30-42-10-25-70-28Q80 8 40 20Z" fill="none" stroke="#e51a1a" strokeLinecap="round" strokeWidth="3.5" />
      </svg>
      <span>347km</span>
    </div>
  );
}

function TitleWordArt() {
  return (
    <h1 className="hero-wordart">
      <span className="sr-only">Od Tatier k Dunaju</span>
      <svg aria-hidden="true" preserveAspectRatio="xMidYMid meet" viewBox="0 0 900 150">
        <defs>
          <linearGradient id="hero-rainbow" x1="0" x2="1">
            <stop offset="0%" stopColor="#e51a1a" />
            <stop offset="20%" stopColor="#f7931e" />
            <stop offset="40%" stopColor="#ffd11e" />
            <stop offset="60%" stopColor="#3ab44a" />
            <stop offset="80%" stopColor="#1e90ff" />
            <stop offset="100%" stopColor="#8e44ad" />
          </linearGradient>
          <path d="M25 120Q450 20 875 120" fill="none" id="hero-title-arc" />
        </defs>
        <text fill="url(#hero-rainbow)" fontFamily="Bungee, Prompt, sans-serif" fontSize="84" paintOrder="stroke fill" stroke="#0f1419" strokeWidth="3">
          <textPath href="#hero-title-arc" startOffset="50%" textAnchor="middle">
            Od Tatier k Dunaju
          </textPath>
        </text>
      </svg>
    </h1>
  );
}

export function HeroCollage({ config }: HeroCollageProps) {
  return (
    <section aria-label="347 km sólo pre Zachráňme Vilyho" className="hero-section">
      <div className="hero-collage">
        <SunDoodle className="hero-doodle hero-doodle--sun" />
        <MountainsDoodle className="hero-doodle hero-doodle--mountains" />
        <HaluskyDoodle className="hero-doodle hero-doodle--halusky" />
        <KamzikDoodle className="hero-doodle hero-doodle--kamzik" />
        <SlovakiaRouteDoodle className="hero-doodle hero-doodle--route" />
        <DistanceWordArt />

        <p className="hero-label hero-label--start">
          štart <span>uuultra</span>
        </p>
        <p className="hero-label hero-label--finish">cieľ (?)</p>

        <AmbulanceDoodle className="hero-doodle hero-doodle--ambulance" />
        <CatDoodle className="hero-doodle hero-doodle--cat" />
        <ArrowDoodle className="hero-doodle hero-doodle--arrow" />

        <figure className="hero-photo-placeholder">
          <img
            alt="Zástupná ilustrácia namiesto zatiaľ nedodanej fotografie Maja"
            height="400"
            src={majoPhotoPlaceholder}
            width="320"
          />
          <figcaption>finálne foto čaká na dodanie</figcaption>
        </figure>

        <div className="hero-primary-cta">
          <PledgeCta href={config.pledgeFormUrl} />
        </div>

        <TitleWordArt />
        <p className="hero-date">
          {siteContent.eventDateLabel} <span>termín čaká na potvrdenie</span>
        </p>
      </div>

      <Container>
        <div aria-label="Kľúčové údaje behu" className="hero-stats" role="group">
          {siteContent.runFacts.map((fact, index) => (
            <div className={`hero-stat hero-stat--${index + 1}`} key={fact.label}>
              <Stat label={fact.label} value={fact.value} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
