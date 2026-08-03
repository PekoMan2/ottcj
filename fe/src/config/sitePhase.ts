export const sitePhases = ['pre', 'live', 'post'] as const;

export type SitePhase = (typeof sitePhases)[number];

export function isSitePhase(value: unknown): value is SitePhase {
  return typeof value === 'string' && sitePhases.includes(value as SitePhase);
}
