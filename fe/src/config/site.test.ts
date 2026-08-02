import { describe, expect, it } from 'vitest';
import { provisionalEventStart, resolveSiteConfig } from './site';

describe('resolveSiteConfig', () => {
  it('uses safe provisional defaults', () => {
    expect(resolveSiteConfig({})).toEqual({
      eventStartAt: provisionalEventStart,
      phase: 'pre',
      pledgeFormUrl: undefined,
    });
  });

  it('accepts configured event and form URLs', () => {
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

  it.each([
    ['invalid date', { VITE_EVENT_START_AT: 'not-a-date' }],
    ['invalid form URL', { VITE_PLEDGE_FORM_URL: 'javascript:alert(1)' }],
  ])('rejects %s configuration', (_label, environment) => {
    expect(() => resolveSiteConfig(environment)).toThrow(/Invalid VITE_/);
  });
});
