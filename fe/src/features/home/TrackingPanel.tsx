import { BellRing, Radio } from 'lucide-react';
import { siteContent } from '../../config/content';
import { useCountdown } from '../countdown/useCountdown';
import type { EventState } from '../event/eventState';

interface TrackingPanelProps {
  eventState: EventState;
}

export function TrackingPanel({ eventState }: TrackingPanelProps) {
  const { tracking } = siteContent;
  const countdown = useCountdown(eventState.eventStartAt);
  const liveTrackUrl =
    eventState.phase === 'live' ? eventState.liveTrackUrl : null;
  const beforeStart = eventState.phase === 'pre' && !countdown.started;

  if (beforeStart) {
    return (
      <aside
        aria-label="Upozornenie na štart behu"
        className="tracking-panel tracking-panel--notify"
      >
        <BellRing aria-hidden="true" />
        <div>
          <h2>{tracking.notify.title}</h2>
          <p>{tracking.notify.body}</p>
          <a
            className="sticker-button"
            href={tracking.notify.formUrl}
            rel="noreferrer"
            target="_blank"
          >
            {tracking.notify.label}
          </a>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Sledovanie behu naživo" className="tracking-panel">
      <div className="tracking-panel__heading">
        <Radio aria-hidden="true" />
        <div>
          <p>{tracking.eyebrow}</p>
          <h2>{tracking.title}</h2>
        </div>
      </div>
      <div className="tracking-panel__buttons">
        <a
          className="sticker-button"
          href={tracking.officialHref}
          rel="noreferrer"
          target="_blank"
        >
          {tracking.officialLabel}
        </a>
        {liveTrackUrl ? (
          <a
            className="sticker-button sticker-button--dark"
            href={liveTrackUrl}
            rel="noreferrer"
            target="_blank"
          >
            {tracking.unofficialLabel} →
          </a>
        ) : (
          <button
            aria-label={`${tracking.unofficialLabel} — ${tracking.pendingNote}`}
            className="sticker-button"
            disabled
            type="button"
          >
            {tracking.unofficialLabel}
          </button>
        )}
      </div>
      <p className="tracking-panel__note">
        {liveTrackUrl ? tracking.runningNote : tracking.pendingNote}
      </p>
    </aside>
  );
}
