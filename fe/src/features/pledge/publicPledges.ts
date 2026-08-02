export const publicPledgesUrl = '/data/pledges.json';
export const maximumDisplayNameLength = 80;

export interface PublicPledge {
  baseAmountEur: number;
  displayName: string | null;
}

export interface PublicPledgeData {
  pledges: readonly PublicPledge[];
  updatedAt: string | null;
}

export interface PledgeSummary {
  baseTotalEur: number;
  maximumPotentialEur: number;
  participantCount: number;
}

const isoDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertExactKeys(record: Record<string, unknown>, keys: readonly string[], label: string) {
  const actualKeys = Object.keys(record);
  if (actualKeys.length !== keys.length || actualKeys.some((key) => !keys.includes(key))) {
    throw new TypeError(`${label} contains unsupported fields`);
  }
}

function parseUpdatedAt(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new TypeError('updatedAt must be null or a valid ISO-8601 date-time');
  }
  const match = isoDateTimePattern.exec(value);
  if (!match) {
    throw new TypeError('updatedAt must be null or a valid ISO-8601 date-time');
  }
  const [, year, month, day, hour, minute, second, offsetHour = '00', offsetMinute = '00'] = match;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  const daysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate();
  if (
    monthNumber < 1 || monthNumber > 12
    || dayNumber < 1 || dayNumber > daysInMonth
    || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59
    || Number(offsetHour) > 23 || Number(offsetMinute) > 59
    || Number.isNaN(Date.parse(value))
  ) throw new TypeError('updatedAt must be null or a valid ISO-8601 date-time');
  return value;
}

export function eurosToCents(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError('baseAmountEur must be a finite number greater than zero');
  }

  const scaled = value * 100;
  const cents = Math.round(scaled);
  if (Math.abs(scaled - cents) > 1e-8 || !Number.isSafeInteger(cents)) {
    throw new RangeError('baseAmountEur must have at most two decimal places');
  }
  return cents;
}

function parseDisplayName(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new TypeError('displayName must be a string or null');
  }
  const displayName = value.trim();
  if (displayName.length === 0) {
    throw new TypeError('displayName must contain non-whitespace content');
  }
  if (Array.from(displayName).length > maximumDisplayNameLength) {
    throw new TypeError(`displayName must not exceed ${maximumDisplayNameLength} characters`);
  }
  return displayName;
}

function parsePledge(value: unknown, index: number): PublicPledge {
  if (!isRecord(value)) throw new TypeError(`pledges[${index}] must be an object`);
  assertExactKeys(value, ['displayName', 'baseAmountEur'], `pledges[${index}]`);
  const baseAmountEur = value.baseAmountEur;
  if (typeof baseAmountEur !== 'number') {
    throw new TypeError(`pledges[${index}].baseAmountEur must be a number`);
  }
  eurosToCents(baseAmountEur);
  return {
    baseAmountEur,
    displayName: parseDisplayName(value.displayName),
  };
}

export function parsePublicPledgeData(value: unknown): PublicPledgeData {
  if (!isRecord(value)) throw new TypeError('Public pledge data must be an object');
  assertExactKeys(value, ['updatedAt', 'pledges'], 'Public pledge data');
  if (!Array.isArray(value.pledges)) throw new TypeError('pledges must be an array');
  return {
    updatedAt: parseUpdatedAt(value.updatedAt),
    pledges: value.pledges.map(parsePledge),
  };
}

function addSafeCents(total: number, amount: number): number {
  const result = total + amount;
  if (!Number.isSafeInteger(result)) throw new RangeError('Pledge total exceeds safe cent precision');
  return result;
}

export function calculatePledgeSummary(pledges: readonly PublicPledge[]): PledgeSummary {
  let baseTotalCents = 0;
  let maximumPotentialCents = 0;

  for (const pledge of pledges) {
    const baseCents = eurosToCents(pledge.baseAmountEur);
    const scaledPotential = baseCents * 5;
    if (!Number.isSafeInteger(scaledPotential) || !Number.isSafeInteger(scaledPotential + 1)) {
      throw new RangeError('Pledge amount exceeds safe multiplier precision');
    }
    const potentialCents = Math.floor((scaledPotential + 1) / 2);
    baseTotalCents = addSafeCents(baseTotalCents, baseCents);
    maximumPotentialCents = addSafeCents(maximumPotentialCents, potentialCents);
  }

  return {
    participantCount: pledges.length,
    baseTotalEur: baseTotalCents / 100,
    maximumPotentialEur: maximumPotentialCents / 100,
  };
}

export function calculateMaximumPotentialEur(pledge: PublicPledge): number {
  return calculatePledgeSummary([pledge]).maximumPotentialEur;
}

export function publicDisplayName(pledge: PublicPledge): string {
  return pledge.displayName ?? 'Anonym';
}
