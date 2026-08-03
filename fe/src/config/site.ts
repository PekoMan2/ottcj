import { resolveSitePhase } from './sitePhase';

export const provisionalEventStart = '2026-08-13T06:00:00+02:00';

export interface SiteConfig {
  eventStartAt: string;
  phase: ReturnType<typeof resolveSitePhase>;
  pledgeFormUrl?: string;
}

interface SiteEnvironment {
  VITE_EVENT_START_AT?: unknown;
  VITE_PLEDGE_FORM_URL?: unknown;
  VITE_SITE_PHASE?: unknown;
}

function resolveEventStart(value: unknown): string {
  const eventStart = value === undefined || value === '' ? provisionalEventStart : value;

  if (typeof eventStart !== 'string' || Number.isNaN(Date.parse(eventStart))) {
    throw new Error(`Invalid VITE_EVENT_START_AT: received ${String(value)}`);
  }

  return eventStart;
}

function resolveOptionalGoogleFormUrl(value: unknown): string | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(`Invalid VITE_PLEDGE_FORM_URL: received ${String(value)}`);
  }

  try {
    const url = new URL(value);

    const isLongForm = url.hostname === 'docs.google.com'
      && (url.pathname === '/forms' || url.pathname.startsWith('/forms/'));
    const isShortForm = url.hostname === 'forms.gle' && url.pathname !== '/';

    if (
      url.protocol !== 'https:'
      || url.username !== ''
      || url.password !== ''
      || (!isLongForm && !isShortForm)
    ) throw new Error('unsupported form destination');

    return url.toString();
  } catch {
    throw new Error(`Invalid VITE_PLEDGE_FORM_URL: received ${value}`);
  }
}

export function resolveSiteConfig(environment: SiteEnvironment): SiteConfig {
  return {
    eventStartAt: resolveEventStart(environment.VITE_EVENT_START_AT),
    phase: resolveSitePhase(environment.VITE_SITE_PHASE),
    pledgeFormUrl: resolveOptionalGoogleFormUrl(environment.VITE_PLEDGE_FORM_URL),
  };
}

export const siteConfig = Object.freeze(
  resolveSiteConfig({
    VITE_EVENT_START_AT: import.meta.env.VITE_EVENT_START_AT,
    VITE_PLEDGE_FORM_URL: import.meta.env.VITE_PLEDGE_FORM_URL,
    VITE_SITE_PHASE: import.meta.env.VITE_SITE_PHASE,
  }),
);
