import { describe, expect, it } from 'vitest';
import { calculatePledgeAmount, calculatePledgeMultiplier } from './pledge';

describe('calculatePledgeMultiplier', () => {
  it.each([
    [{ status: 'dnf' as const }, 0],
    [{ elapsedHours: 84.01, status: 'finished' as const }, 0],
    [{ elapsedHours: 84, status: 'finished' as const }, 1],
    [{ elapsedHours: 76, status: 'finished' as const }, 1],
    [{ elapsedHours: 75.99, status: 'finished' as const }, 1.5],
    [{ elapsedHours: 68, status: 'finished' as const }, 1.5],
    [{ elapsedHours: 67.99, status: 'finished' as const }, 2],
    [{ elapsedHours: 60, status: 'finished' as const }, 2],
    [{ elapsedHours: 59.99, status: 'finished' as const }, 2.5],
  ])('returns the agreed multiplier for %o', (outcome, multiplier) => {
    expect(calculatePledgeMultiplier(outcome)).toBe(multiplier);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid elapsed time %s',
    (elapsedHours) => {
      expect(() =>
        calculatePledgeMultiplier({ elapsedHours, status: 'finished' }),
      ).toThrow(RangeError);
    },
  );
});

describe('calculatePledgeAmount', () => {
  it.each([
    [58, 50],
    [70, 30],
    [80, 20],
  ])('calculates the €20 example at %s hours', (elapsedHours, amount) => {
    expect(calculatePledgeAmount(20, { elapsedHours, status: 'finished' })).toBe(amount);
  });

  it('returns zero for DNF', () => {
    expect(calculatePledgeAmount(20, { status: 'dnf' })).toBe(0);
  });

  it('rejects invalid base amounts', () => {
    expect(() => calculatePledgeAmount(-1, { status: 'dnf' })).toThrow(RangeError);
  });
});
