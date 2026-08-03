import { describe, expect, it } from 'vitest';
import { confirmedEventStart, resolveSiteConfig } from './site';

describe('resolveSiteConfig', () => {
  it('uses the confirmed event defaults', () => {
    expect(resolveSiteConfig({})).toEqual({
      eventStartAt: confirmedEventStart,
      phase: 'pre',
      pledgeFormUrl: undefined,
    });
  });

  it('accepts a shortened Google Forms URL', () => {
    expect(
      resolveSiteConfig({
        VITE_EVENT_START_AT: '2026-08-13T07:30:00+02:00',
        VITE_PLEDGE_FORM_URL: 'https://forms.gle/example',
        VITE_SITE_PHASE: 'live',
      }),
    ).toEqual({
      eventStartAt: '2026-08-13T07:30:00+02:00',
      phase: 'live',
      pledgeFormUrl: 'https://forms.gle/example',
    });
  });

  it('accepts a long Google Forms URL without requiring one exact path shape', () => {
    expect(resolveSiteConfig({
      VITE_PLEDGE_FORM_URL: 'https://docs.google.com/forms/d/e/example/viewform?usp=sharing',
    }).pledgeFormUrl).toBe('https://docs.google.com/forms/d/e/example/viewform?usp=sharing');
  });

  it.each([
    ['invalid date', { VITE_EVENT_START_AT: 'not-a-date' }],
    ['unsafe form URL', { VITE_PLEDGE_FORM_URL: 'javascript:alert(1)' }],
    ['insecure form URL', { VITE_PLEDGE_FORM_URL: 'http://forms.gle/example' }],
    ['unrelated URL', { VITE_PLEDGE_FORM_URL: 'https://example.com/forms/example' }],
    ['credential-bearing URL', { VITE_PLEDGE_FORM_URL: 'https://user:secret@forms.gle/example' }],
    ['malformed URL', { VITE_PLEDGE_FORM_URL: 'not a url' }],
  ])('rejects %s configuration', (_label, environment) => {
    expect(() => resolveSiteConfig(environment)).toThrow(/Invalid VITE_/);
  });
});
