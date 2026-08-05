import { describe, expect, it } from 'vitest';
import { resolveSiteConfig } from './site';

describe('resolveSiteConfig', () => {
  it('keeps consent disabled by default', () => {
    expect(resolveSiteConfig({})).toEqual({
      liveAlertConsentText: undefined,
      liveAlertConsentVersion: undefined,
    });
  });

  it('accepts a configured consent pair', () => {
    expect(
      resolveSiteConfig({
        VITE_LIVE_ALERT_CONSENT_TEXT: 'Schválený súhlas.',
        VITE_LIVE_ALERT_CONSENT_VERSION: '2026-08-04',
      }),
    ).toEqual({
      liveAlertConsentText: 'Schválený súhlas.',
      liveAlertConsentVersion: '2026-08-04',
    });
  });

  it.each([
    ['invalid consent', { VITE_LIVE_ALERT_CONSENT_TEXT: 42 }],
    ['consent without version', { VITE_LIVE_ALERT_CONSENT_TEXT: 'text' }],
    ['version without consent', { VITE_LIVE_ALERT_CONSENT_VERSION: 'v1' }],
  ])('rejects %s configuration', (_label, environment) => {
    expect(() => resolveSiteConfig(environment)).toThrow(/Invalid VITE_/);
  });
});
