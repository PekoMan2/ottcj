import { Radio } from 'lucide-react';
import { siteContent } from '../../config/content';
import type { EventState } from '../event/eventState';

interface TrackingPanelProps {
  eventState: EventState | null;
}

export function TrackingPanel({ eventState }: TrackingPanelProps) {
  const { tracking } = siteContent;
  const liveTrackUrl =
    eventState?.phase === 'live' ? eventState.liveTrackUrl : null;

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
        {eventState?.phase === 'pre' ? (
          <button
            className="sticker-button sticker-button--dark tracking-panel__notify"
            type="button"
          >
            {tracking.notifyLabel}
          </button>
        ) : null}
      </div>
      <p className="tracking-panel__note">
        {liveTrackUrl ? tracking.runningNote : tracking.pendingNote}
      </p>
    </aside>
  );
}
