import { isSitePhase, type SitePhase } from '../../config/sitePhase';

export const eventStateUrl = '/api/event-state';

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
  updatedAt: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertExactKeys(
  record: Record<string, unknown>,
  keys: readonly string[],
  label: string,
): void {
  const actual = Object.keys(record);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    throw new TypeError(`${label} contains unsupported fields`);
  }
}

function parseIsoDate(value: unknown, label: string): string {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${label} must be an ISO-8601 date-time`);
  }
  return value;
}

function parseGarminUrl(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new TypeError('liveTrackUrl must be a string or null');
  }
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
    throw new TypeError('liveTrackUrl must be a secure Garmin URL');
  }
}

function parseNullableString(value: unknown, label: string): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') throw new TypeError(`${label} must be a string or null`);
  return value;
}

function parseResult(value: unknown): EventResult | null {
  if (value === null) return null;
  if (!isRecord(value)) throw new TypeError('result must be an object or null');
  assertExactKeys(
    value,
    [
      'elapsedSeconds',
      'finalDonationTotalEur',
      'multiplier',
      'resultCopy',
      'status',
    ],
    'result',
  );
  if (value.status !== 'finished' && value.status !== 'dnf') {
    throw new TypeError('result.status is invalid');
  }
  const allowedMultipliers: readonly unknown[] = [0, 1, 1.5, 2, 2.5];
  if (!allowedMultipliers.includes(value.multiplier)) {
    throw new TypeError('result.multiplier is invalid');
  }
  if (
    value.elapsedSeconds !== null &&
    (typeof value.elapsedSeconds !== 'number' ||
      !Number.isInteger(value.elapsedSeconds) ||
      value.elapsedSeconds < 0)
  ) {
    throw new TypeError('result.elapsedSeconds is invalid');
  }
  if (
    value.finalDonationTotalEur !== null &&
    (typeof value.finalDonationTotalEur !== 'number' ||
      !Number.isFinite(value.finalDonationTotalEur) ||
      value.finalDonationTotalEur < 0)
  ) {
    throw new TypeError('result.finalDonationTotalEur is invalid');
  }
  if (value.status === 'finished' && value.elapsedSeconds === null) {
    throw new TypeError('finished result requires elapsedSeconds');
  }
  if (value.status === 'dnf' && (value.elapsedSeconds !== null || value.multiplier !== 0)) {
    throw new TypeError('dnf result contains inconsistent values');
  }

  return {
    elapsedSeconds: value.elapsedSeconds,
    finalDonationTotalEur: value.finalDonationTotalEur,
    multiplier: value.multiplier as EventMultiplier,
    resultCopy: parseNullableString(value.resultCopy, 'result.resultCopy'),
    status: value.status,
  };
}

export function parseEventState(value: unknown): EventState {
  if (!isRecord(value)) throw new TypeError('Event state must be an object');
  assertExactKeys(
    value,
    ['eventStartAt', 'liveTrackUrl', 'phase', 'result', 'updatedAt'],
    'Event state',
  );
  if (!isSitePhase(value.phase)) throw new TypeError('Event phase is invalid');
  const result = parseResult(value.result);
  const liveTrackUrl = parseGarminUrl(value.liveTrackUrl);
  if (value.phase === 'post' && result === null) {
    throw new TypeError('post phase requires a result');
  }
  if (value.phase !== 'post' && result !== null) {
    throw new TypeError('result is only public during post phase');
  }
  if (value.phase !== 'live' && liveTrackUrl !== null) {
    throw new TypeError('liveTrackUrl is only public during live phase');
  }

  return {
    eventStartAt: parseIsoDate(value.eventStartAt, 'eventStartAt'),
    liveTrackUrl,
    phase: value.phase,
    result,
    updatedAt:
      value.updatedAt === null
        ? null
        : parseIsoDate(value.updatedAt, 'updatedAt'),
  };
}
