export type PledgeMultiplier = 0 | 1 | 1.5 | 2 | 2.5;

export type RunOutcome =
  | { elapsedHours: number; status: 'finished' }
  | { status: 'dnf' };

export interface PledgeBracket {
  accessibleRange: string;
  displayRange: string;
  multiplier: Exclude<PledgeMultiplier, 0>;
  tone?: 'max';
}

export type PledgeTotals =
  | { status: 'pending' }
  | {
      baseAmountEur: number;
      pledgerCount: number;
      status: 'available';
    };

export const pledgeBrackets: readonly PledgeBracket[] = [
  {
    accessibleRange: 'od 76 do 84 hodín vrátane',
    displayRange: '84h — 76h',
    multiplier: 1,
  },
  {
    accessibleRange: 'od 68 do menej než 76 hodín',
    displayRange: '76h — 68h',
    multiplier: 1.5,
  },
  {
    accessibleRange: 'od 60 do menej než 68 hodín',
    displayRange: '68h — 60h',
    multiplier: 2,
  },
  {
    accessibleRange: 'menej než 60 hodín',
    displayRange: 'pod 60h',
    multiplier: 2.5,
    tone: 'max',
  },
];

export const pledgeTotals: PledgeTotals = { status: 'pending' };

function assertElapsedHours(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Elapsed hours must be a finite non-negative number');
  }
}

export function calculatePledgeMultiplier(outcome: RunOutcome): PledgeMultiplier {
  if (outcome.status === 'dnf') {
    return 0;
  }

  assertElapsedHours(outcome.elapsedHours);

  if (outcome.elapsedHours > 84) return 0;
  if (outcome.elapsedHours >= 76) return 1;
  if (outcome.elapsedHours >= 68) return 1.5;
  if (outcome.elapsedHours >= 60) return 2;
  return 2.5;
}

export function calculatePledgeAmount(
  baseAmountEur: number,
  outcome: RunOutcome,
): number {
  if (!Number.isFinite(baseAmountEur) || baseAmountEur < 0) {
    throw new RangeError('Base pledge amount must be a finite non-negative number');
  }

  return Math.round(baseAmountEur * calculatePledgeMultiplier(outcome) * 100) / 100;
}
