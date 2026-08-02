import { describe, expect, it } from 'vitest';
import { formatCountdown, getCountdownParts } from './countdown';

describe('countdown', () => {
  it('calculates and formats remaining whole minutes', () => {
    const result = getCountdownParts(
      '2026-08-13T06:00:00+02:00',
      new Date('2026-08-02T01:38:00+02:00'),
    );

    expect(result).toMatchObject({ days: 11, hours: 4, minutes: 22 });
    expect(formatCountdown(result)).toBe('11d · 04h · 22m');
  });

  it('never renders a negative countdown after the start', () => {
    const result = getCountdownParts(
      '2026-08-13T06:00:00+02:00',
      new Date('2026-08-14T06:00:00+02:00'),
    );

    expect(result.totalMilliseconds).toBe(0);
    expect(formatCountdown(result)).toBe('štart je tu');
  });
});
