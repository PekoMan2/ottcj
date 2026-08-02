import type { SitePhase } from '../../config/sitePhase';
import { formatCountdown } from '../countdown/countdown';
import { useCountdown } from '../countdown/useCountdown';

interface EventStatusProps {
  eventStartAt: string;
  phase: SitePhase;
}

function CountdownStatus({ eventStartAt }: Pick<EventStatusProps, 'eventStartAt'>) {
  const countdown = useCountdown(eventStartAt);

  return (
    <div className="event-status" data-event-status="pre">
      <span className="event-status__label">do štartu:</span>
      <time dateTime={eventStartAt}>{formatCountdown(countdown)}</time>
    </div>
  );
}

export function EventStatus({ eventStartAt, phase }: EventStatusProps) {
  if (phase === 'live') {
    return (
      <div className="event-status" data-event-status="live">
        <span className="event-status__label">stav behu:</span>
        <strong>práve beží</strong>
      </div>
    );
  }

  if (phase === 'post') {
    return (
      <div className="event-status" data-event-status="post">
        <span className="event-status__label">stav podujatia:</span>
        <strong>fáza behu sa skončila</strong>
      </div>
    );
  }

  return <CountdownStatus eventStartAt={eventStartAt} />;
}
