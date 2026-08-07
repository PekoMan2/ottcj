import { describe, expect, it } from 'vitest';
import { formatCountdown, getCountdownParts } from './countdown';

describe('countdown', () => {
  it('calculates and formats remaining whole minutes before the start', () => {
    const result = getCountdownParts(
      '2026-08-13T06:00:00+02:00',
      new Date('2026-08-02T01:38:00+02:00'),
    );

    expect(result).toMatchObject({ days: 11, hours: 4, minutes: 22, started: false });
    expect(formatCountdown(result)).toBe('11d · 04h · 22m');
  });

  it('counts elapsed hours up after the start', () => {
    const result = getCountdownParts(
      '2026-08-13T06:00:00+02:00',
      new Date('2026-08-14T08:05:00+02:00'),
    );

    expect(result.started).toBe(true);
    expect(formatCountdown(result)).toBe('26h · 05m');
  });

  it('treats the exact start moment as started', () => {
    const result = getCountdownParts(
      '2026-08-13T06:00:00+02:00',
      new Date('2026-08-13T06:00:00+02:00'),
    );

    expect(result.started).toBe(true);
    expect(formatCountdown(result)).toBe('0h · 00m');
  });
});
