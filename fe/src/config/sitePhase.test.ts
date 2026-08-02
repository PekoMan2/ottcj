import { describe, expect, it } from 'vitest';
import { resolveSitePhase } from './sitePhase';

describe('resolveSitePhase', () => {
  it('defaults missing configuration to pre', () => {
    expect(resolveSitePhase(undefined)).toBe('pre');
  });

  it.each(['pre', 'live', 'post'] as const)('accepts the %s phase', (phase) => {
    expect(resolveSitePhase(phase)).toBe(phase);
  });

  it('rejects an invalid phase', () => {
    expect(() => resolveSitePhase('automatic')).toThrow(
      'Invalid VITE_SITE_PHASE',
    );
  });
});
