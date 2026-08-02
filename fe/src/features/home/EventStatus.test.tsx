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
        eventStartAt="2026-08-13T06:00:00+02:00"
        phase="pre"
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
        eventStartAt="2026-08-13T06:00:00+02:00"
        phase={phase}
      />,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText('do štartu:')).not.toBeInTheDocument();
  });
});
