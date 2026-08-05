import { ExternalLink } from 'lucide-react';
import { Container, Stat } from '../../components/ui';
import { siteContent } from '../../config/content';
import { DonioCta } from '../donio/DonioCta';
import type { EventState } from '../event/eventState';
import {
  AmbulanceDoodle,
  ArrowDoodle,
  MountainsDoodle,
  SunDoodle,
} from './Doodles';
import { TrackingPanel } from './TrackingPanel';

interface HeroCollageProps {
  eventState: EventState | null;
}

interface HeroArtworkProps {
  className: string;
  height: number;
  src: string;
  width: number;
}

function HeroArtwork({ className, height, src, width }: HeroArtworkProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`hero-artwork ${className}`}
      draggable="false"
      height={height}
      src={src}
      width={width}
    />
  );
}

function HeroMapArtwork() {
  const routePath = 'M449 292C430 350 374 390 323 430S239 511 195 540S165 564 150 580';

  return (
    <div
      aria-label="Orientačný náčrt trasy z Jasnej na Tyršovo nábrežie"
      className="hero-map-artwork"
      role="img"
    >
      <img
        alt=""
        aria-hidden="true"
        className="hero-map-artwork__image"
        draggable="false"
        height="488"
        src="/mapatrans.png"
        width="548"
      />
      <svg
        aria-hidden="true"
        className="hero-map-artwork__route"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 938 835"
      >
        <path className="hero-map-artwork__route-line" d={routePath} />
        <path className="hero-map-artwork__route-dash" d={routePath} />
        <circle className="hero-map-artwork__point hero-map-artwork__point--start" cx="449" cy="292" r="17" />
        <circle className="hero-map-artwork__point hero-map-artwork__point--finish" cx="150" cy="580" r="17" />
      </svg>
      <span aria-hidden="true" className="hero-map-artwork__label hero-map-artwork__label--start">
        štart <small>uuultra</small>
      </span>
      <span aria-hidden="true" className="hero-map-artwork__label hero-map-artwork__label--finish">
        cieľ <small>Tyršovo nábrežie</small>
      </span>
    </div>
  );
}

function TitleWordArt() {
  return (
    <h1 className="hero-wordart">
      <span className="sr-only">Od Tatier k Dunaju</span>
      <img
        alt=""
        aria-hidden="true"
        draggable="false"
        height="835"
        src="/OTKD_LOGO_CRAZY.png"
        width="1789"
      />
    </h1>
  );
}

export function HeroCollage({ eventState }: HeroCollageProps) {
  const isLive = eventState?.phase === 'live';
  const isPost = eventState?.phase === 'post';

  return (
    <section aria-label="347 km sólo pre Zachráňme Vilyho" className="hero-section">
      <div className="hero-collage">
        <SunDoodle className="hero-doodle hero-doodle--sun" />
        <MountainsDoodle className="hero-doodle hero-doodle--mountains" />
        <HeroArtwork className="hero-artwork--halusky" height={614} src="/halusky.png" width={501} />
        <HeroArtwork className="hero-artwork--suhaj" height={489} src="/suhajtransparent.png" width={366} />
        <HeroMapArtwork />
        <HeroArtwork className="hero-artwork--distance" height={461} src="/347km.png" width={1069} />

        <AmbulanceDoodle className="hero-doodle hero-doodle--ambulance" />
        <HeroArtwork className="hero-artwork--lynx" height={444} src="/rysostrovid.png" width={585} />
        <ArrowDoodle className="hero-doodle hero-doodle--arrow" />

        <figure className="hero-photo">
          <img
            alt="Majo s vlajkou Slovenska po pretekoch"
            fetchPriority="high"
            height="656"
            src="/majo.jpg"
            width="438"
          />
        </figure>

        <div className="hero-primary-cta">
          {isLive && eventState.liveTrackUrl ? (
            <a
              className="live-track-cta"
              href={eventState.liveTrackUrl}
              rel="noreferrer"
              target="_blank"
            >
              sledovať Maja naživo <ExternalLink aria-hidden="true" size={18} />
            </a>
          ) : null}
          {isLive && !eventState.liveTrackUrl ? (
            <span className="live-track-pending">LiveTrack odkaz sa pripravuje</span>
          ) : null}
          {!isPost ? <DonioCta /> : null}
        </div>

        <TitleWordArt />
        <p className="hero-date">
          {siteContent.eventDateLabel}
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
        {eventState?.phase !== 'post' ? (
          <TrackingPanel eventState={eventState} />
        ) : null}
      </Container>
    </section>
  );
}
