export interface SiteConfig {
  liveAlertConsentText?: string;
  liveAlertConsentVersion?: string;
}

interface SiteEnvironment {
  VITE_LIVE_ALERT_CONSENT_TEXT?: unknown;
  VITE_LIVE_ALERT_CONSENT_VERSION?: unknown;
}

function resolveOptionalConsentText(value: unknown): string | undefined {
  if (value === undefined || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Invalid VITE_LIVE_ALERT_CONSENT_TEXT: received ${String(value)}`);
  }
  const consentText = value.trim();
  if (consentText.length === 0 || consentText.length > 1000) {
    throw new Error(`Invalid VITE_LIVE_ALERT_CONSENT_TEXT: received ${value}`);
  }
  return consentText;
}

function resolveOptionalConsentVersion(value: unknown): string | undefined {
  if (value === undefined || value === '') return undefined;
  if (typeof value !== 'string' || !/^[A-Za-z0-9._-]{1,64}$/u.test(value)) {
    throw new Error(`Invalid VITE_LIVE_ALERT_CONSENT_VERSION: received ${String(value)}`);
  }
  return value;
}

export function resolveSiteConfig(environment: SiteEnvironment): SiteConfig {
  const liveAlertConsentText = resolveOptionalConsentText(
    environment.VITE_LIVE_ALERT_CONSENT_TEXT,
  );
  const liveAlertConsentVersion = resolveOptionalConsentVersion(
    environment.VITE_LIVE_ALERT_CONSENT_VERSION,
  );
  if ((liveAlertConsentText === undefined) !== (liveAlertConsentVersion === undefined)) {
    throw new Error('Invalid VITE_LIVE_ALERT_CONSENT configuration: text and version must be configured together');
  }
  return {
    liveAlertConsentText,
    liveAlertConsentVersion,
  };
}

export const siteConfig = Object.freeze(
  resolveSiteConfig({
    VITE_LIVE_ALERT_CONSENT_TEXT: import.meta.env.VITE_LIVE_ALERT_CONSENT_TEXT,
    VITE_LIVE_ALERT_CONSENT_VERSION: import.meta.env.VITE_LIVE_ALERT_CONSENT_VERSION,
  }),
);
