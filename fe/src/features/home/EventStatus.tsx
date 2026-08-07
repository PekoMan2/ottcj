import type { EventState } from '../event/eventState';
import { formatCountdown } from '../countdown/countdown';
import { useCountdown } from '../countdown/useCountdown';

interface EventStatusProps {
  eventState: EventState;
}

function CountdownStatus({
  eventStartAt,
  status,
}: {
  eventStartAt: string;
  status: 'live' | 'pre';
}) {
  const countdown = useCountdown(eventStartAt);

  return (
    <div className="event-status" data-event-status={status}>
      <span className="event-status__label">
        {countdown.started ? 'Majo behá už:' : 'do štartu:'}
      </span>
      <time dateTime={eventStartAt}>{formatCountdown(countdown)}</time>
    </div>
  );
}

export function EventStatus({ eventState }: EventStatusProps) {
  if (eventState.phase === 'post') {
    return (
      <div className="event-status" data-event-status="post">
        <span className="event-status__label">stav podujatia:</span>
        <strong>fáza behu sa skončila</strong>
      </div>
    );
  }

  return (
    <CountdownStatus
      eventStartAt={eventState.eventStartAt}
      status={eventState.phase}
    />
  );
}
