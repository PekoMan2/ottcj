import { describe, expect, it } from 'vitest';
import { buildEventState } from './eventState';

describe('buildEventState', () => {
  it('defaults to the pre phase with the official start', () => {
    expect(buildEventState({})).toEqual({
      eventStartAt: '2026-08-13T08:00:00+02:00',
      liveTrackUrl: null,
      phase: 'pre',
      result: null,
    });
  });

  it('treats empty environment values as unset', () => {
    expect(
      buildEventState({
        VITE_EVENT_PHASE: '',
        VITE_EVENT_START_AT: ' ',
        VITE_LIVE_TRACK_URL: '',
        VITE_RESULT_STATUS: '',
      }),
    ).toMatchObject({ phase: 'pre', result: null });
  });

  it('accepts a live phase with a Garmin link', () => {
    expect(
      buildEventState({
        VITE_EVENT_PHASE: 'live',
        VITE_LIVE_TRACK_URL: 'https://livetrack.garmin.com/session/example',
      }),
    ).toMatchObject({
      liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      phase: 'live',
    });
  });

  it('accepts a live phase while the Garmin link is still pending', () => {
    expect(buildEventState({ VITE_EVENT_PHASE: 'live' })).toMatchObject({
      liveTrackUrl: null,
      phase: 'live',
    });
  });

  it('builds a finished result and derives the multiplier', () => {
    expect(
      buildEventState({
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'finished',
        VITE_RESULT_ELAPSED_SECONDS: '208800',
        VITE_RESULT_FINAL_DONATION_EUR: '12500',
        VITE_RESULT_COPY: 'Schválený výsledkový text.',
      }).result,
    ).toEqual({
      elapsedSeconds: 208_800,
      finalDonationTotalEur: 12_500,
      multiplier: 2.5,
      resultCopy: 'Schválený výsledkový text.',
      status: 'finished',
    });
  });

  it.each([
    ['215999', 2.5],
    ['216000', 2],
    ['244800', 1.5],
    ['273600', 1],
    ['302401', 0],
  ] as const)('maps %s elapsed seconds to a %s multiplier', (seconds, multiplier) => {
    expect(
      buildEventState({
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'finished',
        VITE_RESULT_ELAPSED_SECONDS: seconds,
      }).result,
    ).toMatchObject({ multiplier });
  });

  it('builds a dnf result without elapsed time and with a zero multiplier', () => {
    expect(
      buildEventState({
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'dnf',
      }).result,
    ).toEqual({
      elapsedSeconds: null,
      finalDonationTotalEur: null,
      multiplier: 0,
      resultCopy: null,
      status: 'dnf',
    });
  });

  it.each([
    [{ VITE_EVENT_PHASE: 'unknown' }],
    [{ VITE_EVENT_START_AT: 'zajtra' }],
    [{ VITE_EVENT_PHASE: 'live', VITE_LIVE_TRACK_URL: 'https://example.com/session' }],
    [{ VITE_EVENT_PHASE: 'live', VITE_LIVE_TRACK_URL: 'http://livetrack.garmin.com/x' }],
    [{ VITE_LIVE_TRACK_URL: 'https://livetrack.garmin.com/session/example' }],
    [{ VITE_EVENT_PHASE: 'post' }],
    [{ VITE_RESULT_STATUS: 'finished', VITE_RESULT_ELAPSED_SECONDS: '100' }],
    [{ VITE_EVENT_PHASE: 'post', VITE_RESULT_STATUS: 'finished' }],
    [{ VITE_EVENT_PHASE: 'post', VITE_RESULT_STATUS: 'won' }],
    [
      {
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'finished',
        VITE_RESULT_ELAPSED_SECONDS: '12.5',
      },
    ],
    [
      {
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'dnf',
        VITE_RESULT_ELAPSED_SECONDS: '100',
      },
    ],
    [
      {
        VITE_EVENT_PHASE: 'post',
        VITE_RESULT_STATUS: 'dnf',
        VITE_RESULT_FINAL_DONATION_EUR: '-1',
      },
    ],
  ])('rejects an unsafe or inconsistent environment %#', (environment) => {
    expect(() => buildEventState(environment)).toThrow(TypeError);
  });
});
