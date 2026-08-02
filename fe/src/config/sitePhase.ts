export const sitePhases = ['pre', 'live', 'post'] as const;

export type SitePhase = (typeof sitePhases)[number];

export function isSitePhase(value: unknown): value is SitePhase {
  return typeof value === 'string' && sitePhases.includes(value as SitePhase);
}

export function resolveSitePhase(value: unknown): SitePhase {
  if (value === undefined) {
    return 'pre';
  }

  if (isSitePhase(value)) {
    return value;
  }

  throw new Error(
    `Invalid VITE_SITE_PHASE: expected ${sitePhases.join(', ')}, received ${String(value)}`,
  );
}
