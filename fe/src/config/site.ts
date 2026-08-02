import { resolveSitePhase } from './sitePhase';

export const siteConfig = Object.freeze({
  phase: resolveSitePhase(import.meta.env.VITE_SITE_PHASE),
});
