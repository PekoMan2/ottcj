import { describe, expect, it } from 'vitest';
import { parseEventState } from './eventState';

const preState = {
  eventStartAt: '2026-08-13T04:00:00.000Z',
  liveTrackUrl: null,
  phase: 'pre',
  result: null,
  updatedAt: null,
};

describe('parseEventState', () => {
  it('accepts pre, live and complete post states', () => {
    expect(parseEventState(preState)).toEqual(preState);
    expect(
      parseEventState({
        ...preState,
        liveTrackUrl: 'https://livetrack.garmin.com/session/example',
        phase: 'live',
      }),
    ).toMatchObject({ phase: 'live' });
    expect(
      parseEventState({
        ...preState,
        phase: 'post',
        result: {
          elapsedSeconds: 208800,
          finalDonationTotalEur: 12500,
          multiplier: 2.5,
          resultCopy: null,
          status: 'finished',
        },
      }),
    ).toMatchObject({ phase: 'post', result: { multiplier: 2.5 } });
  });

  it.each([
    { ...preState, extra: true },
    {
      ...preState,
      liveTrackUrl: 'https://livetrack.garmin.com/session/example',
    },
    { ...preState, liveTrackUrl: 'https://example.com/session', phase: 'live' },
    {
      ...preState,
      phase: 'post',
      result: null,
    },
    {
      ...preState,
      phase: 'post',
      result: {
        elapsedSeconds: 100,
        finalDonationTotalEur: null,
        multiplier: 1,
        resultCopy: null,
        status: 'dnf',
      },
    },
  ])('rejects an unsafe or inconsistent state', (value) => {
    expect(() => parseEventState(value)).toThrow(TypeError);
  });
});
