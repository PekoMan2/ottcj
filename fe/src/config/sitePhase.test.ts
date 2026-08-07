import { describe, expect, it } from 'vitest';
import { isSitePhase } from './sitePhase';

describe('isSitePhase', () => {
  it.each(['pre', 'live', 'post'] as const)('accepts the %s phase', (phase) => {
    expect(isSitePhase(phase)).toBe(true);
  });

  it.each([undefined, 'automatic', 1])('rejects invalid phase %s', (phase) => {
    expect(isSitePhase(phase)).toBe(false);
  });
});
