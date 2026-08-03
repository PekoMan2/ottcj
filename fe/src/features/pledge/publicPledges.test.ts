import { describe, expect, it } from 'vitest';
import {
  calculateMaximumPotentialEur,
  calculatePledgeSummary,
  maximumDisplayNameLength,
  parsePublicPledgeData,
  publicDisplayName,
} from './publicPledges';

const data = (overrides: Record<string, unknown> = {}) => ({
  updatedAt: null,
  pledges: [],
  ...overrides,
});

describe('parsePublicPledgeData', () => {
  it('accepts safe fields, trims display names, and accepts an ISO date-time', () => {
    expect(parsePublicPledgeData(data({
      updatedAt: '2026-08-02T12:30:45+02:00',
      pledges: [{ displayName: '  Jana N.  ', baseAmountEur: 12.34 }],
    }))).toEqual({
      updatedAt: '2026-08-02T12:30:45+02:00',
      pledges: [{ displayName: 'Jana N.', baseAmountEur: 12.34 }],
    });
  });

  it.each([
    ['whitespace name', { displayName: '   ', baseAmountEur: 10 }],
    ['overlong name', { displayName: 'x'.repeat(maximumDisplayNameLength + 1), baseAmountEur: 10 }],
    ['zero amount', { displayName: null, baseAmountEur: 0 }],
    ['negative amount', { displayName: null, baseAmountEur: -1 }],
    ['three decimals', { displayName: null, baseAmountEur: 1.001 }],
    ['non-finite amount', { displayName: null, baseAmountEur: Number.POSITIVE_INFINITY }],
    ['private field', { displayName: null, baseAmountEur: 10, email: 'private@example.test' }],
  ])('rejects %s', (_label, pledge) => {
    expect(() => parsePublicPledgeData(data({ pledges: [pledge] }))).toThrow();
  });

  it.each([
    '2026-08-02',
    '2026-02-30T12:00:00Z',
    'not-a-date',
  ])('rejects invalid timestamp %s', (updatedAt) => {
    expect(() => parsePublicPledgeData(data({ updatedAt }))).toThrow(/ISO-8601/u);
  });

  it('rejects unexpected top-level fields', () => {
    expect(() => parsePublicPledgeData({ ...data(), sheetUrl: 'private' })).toThrow(/unsupported fields/u);
  });
});

describe('calculatePledgeSummary', () => {
  it('counts anonymous entries and performs cent-safe per-pledge rounding before aggregation', () => {
    const pledges = [
      { displayName: null, baseAmountEur: 0.01 },
      { displayName: 'Jana', baseAmountEur: 0.03 },
      { displayName: 'Miro', baseAmountEur: 12.34 },
    ];
    expect(calculatePledgeSummary(pledges)).toEqual({
      participantCount: 3,
      baseTotalEur: 12.38,
      maximumPotentialEur: 30.96,
    });
    expect(calculateMaximumPotentialEur(pledges[0])).toBe(0.03);
    expect(calculateMaximumPotentialEur(pledges[1])).toBe(0.08);
  });

  it('does not drift while accumulating decimal euro values', () => {
    const pledges = Array.from({ length: 100 }, () => ({ displayName: null, baseAmountEur: 0.1 }));
    expect(calculatePledgeSummary(pledges)).toEqual({
      participantCount: 100,
      baseTotalEur: 10,
      maximumPotentialEur: 25,
    });
  });

  it('renders null display names as Anonym', () => {
    expect(publicDisplayName({ displayName: null, baseAmountEur: 5 })).toBe('Anonym');
  });
});
