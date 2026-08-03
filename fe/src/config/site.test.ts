import { describe, expect, it } from 'vitest';
import { resolveSiteConfig } from './site';

describe('resolveSiteConfig', () => {
  it('keeps externally supplied forms and consent disabled by default', () => {
    expect(resolveSiteConfig({})).toEqual({
      liveAlertConsentText: undefined,
      liveAlertConsentVersion: undefined,
      pledgeFormUrl: undefined,
    });
  });

  it('accepts a shortened Google Forms URL', () => {
    expect(
      resolveSiteConfig({
        VITE_LIVE_ALERT_CONSENT_TEXT: 'Schválený súhlas.',
        VITE_LIVE_ALERT_CONSENT_VERSION: '2026-08-04',
        VITE_PLEDGE_FORM_URL: 'https://forms.gle/example',
      }),
    ).toEqual({
      liveAlertConsentText: 'Schválený súhlas.',
      liveAlertConsentVersion: '2026-08-04',
      pledgeFormUrl: 'https://forms.gle/example',
    });
  });

  it('accepts a long Google Forms URL without requiring one exact path shape', () => {
    expect(resolveSiteConfig({
      VITE_PLEDGE_FORM_URL: 'https://docs.google.com/forms/d/e/example/viewform?usp=sharing',
    }).pledgeFormUrl).toBe('https://docs.google.com/forms/d/e/example/viewform?usp=sharing');
  });

  it.each([
    ['unsafe form URL', { VITE_PLEDGE_FORM_URL: 'javascript:alert(1)' }],
    ['insecure form URL', { VITE_PLEDGE_FORM_URL: 'http://forms.gle/example' }],
    ['unrelated URL', { VITE_PLEDGE_FORM_URL: 'https://example.com/forms/example' }],
    ['credential-bearing URL', { VITE_PLEDGE_FORM_URL: 'https://user:secret@forms.gle/example' }],
    ['malformed URL', { VITE_PLEDGE_FORM_URL: 'not a url' }],
    ['invalid consent', { VITE_LIVE_ALERT_CONSENT_TEXT: 42 }],
    ['consent without version', { VITE_LIVE_ALERT_CONSENT_TEXT: 'text' }],
    ['version without consent', { VITE_LIVE_ALERT_CONSENT_VERSION: 'v1' }],
  ])('rejects %s configuration', (_label, environment) => {
    expect(() => resolveSiteConfig(environment)).toThrow(/Invalid VITE_/);
  });
});
