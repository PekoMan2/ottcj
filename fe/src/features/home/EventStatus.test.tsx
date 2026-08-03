import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventStatus } from './EventStatus';

describe('EventStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-02T01:38:00+02:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates the configured pre-event countdown', () => {
    render(
      <EventStatus
        state={{
          data: {
            eventStartAt: '2026-08-13T06:00:00+02:00',
            liveTrackUrl: null,
            phase: 'pre',
            result: null,
            updatedAt: null,
          },
          status: 'ready',
        }}
      />,
    );

    expect(screen.getByText('11d · 04h · 22m')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(60_000));

    expect(screen.getByText('11d · 04h · 21m')).toBeInTheDocument();
  });

  it.each([
    ['live', 'práve beží'],
    ['post', 'fáza behu sa skončila'],
  ] as const)('renders the configured %s status without a countdown', (phase, label) => {
    render(
      <EventStatus
        state={{
          data: {
            eventStartAt: '2026-08-13T06:00:00+02:00',
            liveTrackUrl: null,
            phase,
            result:
              phase === 'post'
                ? {
                    elapsedSeconds: null,
                    finalDonationTotalEur: null,
                    multiplier: 0,
                    resultCopy: null,
                    status: 'dnf',
                  }
                : null,
            updatedAt: null,
          },
          status: 'ready',
        }}
      />,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText('do štartu:')).not.toBeInTheDocument();
  });

  it.each([
    [{ status: 'loading' } as const, 'načítavam'],
    [{ message: 'offline', status: 'error' } as const, 'nedostupný'],
  ])('uses a neutral status while runtime data is %s', (state, label) => {
    render(<EventStatus state={state} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText('do štartu:')).not.toBeInTheDocument();
  });
});
