import type { EventStateLoadState } from '../event/eventStateContext';
import { formatCountdown } from '../countdown/countdown';
import { useCountdown } from '../countdown/useCountdown';

interface EventStatusProps {
  state: EventStateLoadState;
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

export function EventStatus({ state }: EventStatusProps) {
  if (state.status !== 'ready') {
    return (
      <div className="event-status" data-event-status={state.status}>
        <span className="event-status__label">stav behu:</span>
        <strong>{state.status === 'loading' ? 'načítavam' : 'nedostupný'}</strong>
      </div>
    );
  }

  if (state.data.phase === 'post') {
    return (
      <div className="event-status" data-event-status="post">
        <span className="event-status__label">stav podujatia:</span>
        <strong>fáza behu sa skončila</strong>
      </div>
    );
  }

  return (
    <CountdownStatus
      eventStartAt={state.data.eventStartAt}
      status={state.data.phase}
    />
  );
}
