import { describe, expect, it } from 'vitest';
import { buildEventState } from './eventState';

const beforeStart = new Date('2026-08-10T12:00:00+02:00');
const afterStart = new Date('2026-08-13T09:00:00+02:00');

describe('buildEventState', () => {
  it('derives the pre phase before the official start', () => {
    expect(buildEventState({}, beforeStart)).toEqual({
      eventStartAt: '2026-08-13T08:00:00+02:00',
      liveTrackUrl: null,
      phase: 'pre',
      result: null,
    });
  });

  it('derives the live phase once the start has passed', () => {
    expect(buildEventState({}, afterStart)).toMatchObject({ phase: 'live' });
  });

  it('derives the phase from a configured start date', () => {
    expect(
      buildEventState({ VITE_EVENT_START_AT: '2026-08-05T21:00:00+02:00' }, beforeStart),
    ).toMatchObject({ phase: 'live' });
  });

  it('treats empty environment values as unset', () => {
    expect(
      buildEventState(
        {
          VITE_EVENT_PHASE: '',
          VITE_EVENT_START_AT: ' ',
          VITE_GARMIN_URL: '',
          VITE_RESULT_STATUS: '',
        },
        beforeStart,
      ),
    ).toMatchObject({ phase: 'pre', result: null });
  });

  it('shows the Garmin link only while live', () => {
    const environment = {
      VITE_GARMIN_URL: 'https://livetrack.garmin.com/session/example',
    };
    expect(buildEventState(environment, beforeStart).liveTrackUrl).toBeNull();
    expect(buildEventState(environment, afterStart).liveTrackUrl).toBe(
      'https://livetrack.garmin.com/session/example',
    );
  });

  it('allows forcing only the post phase in production', () => {
    expect(() =>
      buildEventState({ VITE_EVENT_PHASE: 'live' }, beforeStart),
    ).toThrow(TypeError);
    expect(() =>
      buildEventState({ MODE: 'production', VITE_EVENT_PHASE: 'pre' }, afterStart),
    ).toThrow(TypeError);
    expect(
      buildEventState(
        {
          VITE_EVENT_PHASE: 'post',
          VITE_RESULT_STATUS: 'dnf',
        },
        afterStart,
      ),
    ).toMatchObject({ phase: 'post' });
  });

  it('allows forcing any phase in development', () => {
    expect(
      buildEventState({ MODE: 'development', VITE_EVENT_PHASE: 'pre' }, afterStart),
    ).toMatchObject({ phase: 'pre' });
    expect(
      buildEventState({ MODE: 'development', VITE_EVENT_PHASE: 'live' }, beforeStart),
    ).toMatchObject({ phase: 'live' });
  });

  it('builds a finished result and derives the multiplier', () => {
    expect(
      buildEventState(
        {
          VITE_EVENT_PHASE: 'post',
          VITE_RESULT_STATUS: 'finished',
          VITE_RESULT_ELAPSED_SECONDS: '208800',
          VITE_RESULT_FINAL_DONATION_EUR: '12500',
          VITE_RESULT_COPY: 'Schválený výsledkový text.',
        },
        afterStart,
      ).result,
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
      buildEventState(
        {
          VITE_EVENT_PHASE: 'post',
          VITE_RESULT_STATUS: 'finished',
          VITE_RESULT_ELAPSED_SECONDS: seconds,
        },
        afterStart,
      ).result,
    ).toMatchObject({ multiplier });
  });

  it('builds a dnf result without elapsed time and with a zero multiplier', () => {
    expect(
      buildEventState(
        {
          VITE_EVENT_PHASE: 'post',
          VITE_RESULT_STATUS: 'dnf',
        },
        afterStart,
      ).result,
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
    [{ VITE_GARMIN_URL: 'https://example.com/session' }],
    [{ VITE_GARMIN_URL: 'http://livetrack.garmin.com/x' }],
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
    expect(() => buildEventState(environment, afterStart)).toThrow(TypeError);
  });
});
