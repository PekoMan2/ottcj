import { isSitePhase, type SitePhase } from '../../config/sitePhase';

export type EventMultiplier = 0 | 1 | 1.5 | 2 | 2.5;
export type EventResultStatus = 'finished' | 'dnf';

export interface EventResult {
  elapsedSeconds: number | null;
  finalDonationTotalEur: number | null;
  multiplier: EventMultiplier;
  resultCopy: string | null;
  status: EventResultStatus;
}

export interface EventState {
  eventStartAt: string;
  liveTrackUrl: string | null;
  phase: SitePhase;
  result: EventResult | null;
}

export interface EventEnvironment {
  VITE_EVENT_PHASE?: string;
  VITE_EVENT_START_AT?: string;
  VITE_LIVE_TRACK_URL?: string;
  VITE_RESULT_STATUS?: string;
  VITE_RESULT_ELAPSED_SECONDS?: string;
  VITE_RESULT_FINAL_DONATION_EUR?: string;
  VITE_RESULT_COPY?: string;
}

const defaultEventStartAt = '2026-08-13T08:00:00+02:00';

function cleaned(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseEventStartAt(value: string | undefined): string {
  const eventStartAt = value ?? defaultEventStartAt;
  if (Number.isNaN(Date.parse(eventStartAt))) {
    throw new TypeError('VITE_EVENT_START_AT must be an ISO-8601 date-time');
  }
  return eventStartAt;
}

function parseLiveTrackUrl(value: string | undefined): string | null {
  if (value === undefined) return null;
  try {
    const url = new URL(value);
    const isGarminHost =
      url.hostname === 'garmin.com' || url.hostname.endsWith('.garmin.com');
    if (
      url.protocol !== 'https:' ||
      url.username !== '' ||
      url.password !== '' ||
      !isGarminHost
    ) {
      throw new Error('unsupported URL');
    }
    return url.toString();
  } catch {
    throw new TypeError('VITE_LIVE_TRACK_URL must be a secure Garmin URL');
  }
}

function parseElapsedSeconds(value: string | undefined): number | null {
  if (value === undefined) return null;
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 0) {
    throw new TypeError(
      'VITE_RESULT_ELAPSED_SECONDS must be a non-negative whole number',
    );
  }
  return seconds;
}

function parseDonationTotal(value: string | undefined): number | null {
  if (value === undefined) return null;
  const total = Number(value);
  if (!Number.isFinite(total) || total < 0) {
    throw new TypeError(
      'VITE_RESULT_FINAL_DONATION_EUR must be a non-negative number',
    );
  }
  return total;
}

function calculateEventMultiplier(
  status: EventResultStatus,
  elapsedSeconds: number | null,
): EventMultiplier {
  if (status === 'dnf' || elapsedSeconds === null) return 0;
  const elapsedHours = elapsedSeconds / 3600;
  if (elapsedHours > 84) return 0;
  if (elapsedHours >= 76) return 1;
  if (elapsedHours >= 68) return 1.5;
  if (elapsedHours >= 60) return 2;
  return 2.5;
}

function parseResult(environment: EventEnvironment): EventResult | null {
  const status = cleaned(environment.VITE_RESULT_STATUS);
  if (status === undefined) return null;
  if (status !== 'finished' && status !== 'dnf') {
    throw new TypeError('VITE_RESULT_STATUS must be "finished" or "dnf"');
  }
  const elapsedSeconds = parseElapsedSeconds(
    cleaned(environment.VITE_RESULT_ELAPSED_SECONDS),
  );
  if (status === 'finished' && elapsedSeconds === null) {
    throw new TypeError('a finished result requires VITE_RESULT_ELAPSED_SECONDS');
  }
  if (status === 'dnf' && elapsedSeconds !== null) {
    throw new TypeError('a dnf result must not set VITE_RESULT_ELAPSED_SECONDS');
  }

  return {
    elapsedSeconds,
    finalDonationTotalEur: parseDonationTotal(
      cleaned(environment.VITE_RESULT_FINAL_DONATION_EUR),
    ),
    multiplier: calculateEventMultiplier(status, elapsedSeconds),
    resultCopy: cleaned(environment.VITE_RESULT_COPY) ?? null,
    status,
  };
}

export function buildEventState(environment: EventEnvironment): EventState {
  const phase = cleaned(environment.VITE_EVENT_PHASE) ?? 'pre';
  if (!isSitePhase(phase)) {
    throw new TypeError('VITE_EVENT_PHASE must be "pre", "live" or "post"');
  }
  const result = parseResult(environment);
  const liveTrackUrl = parseLiveTrackUrl(cleaned(environment.VITE_LIVE_TRACK_URL));
  if (phase === 'post' && result === null) {
    throw new TypeError('the post phase requires a configured result');
  }
  if (phase !== 'post' && result !== null) {
    throw new TypeError('a result is only allowed in the post phase');
  }
  if (phase !== 'live' && liveTrackUrl !== null) {
    throw new TypeError('VITE_LIVE_TRACK_URL is only allowed in the live phase');
  }

  return {
    eventStartAt: parseEventStartAt(cleaned(environment.VITE_EVENT_START_AT)),
    liveTrackUrl,
    phase,
    result,
  };
}

export const eventState = buildEventState(import.meta.env as EventEnvironment);
