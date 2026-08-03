import type { EventPhase, EventResultStatus } from './event-state.entity';

export type EventMultiplier = 0 | 1 | 1.5 | 2 | 2.5;

export interface PublicEventResult {
  elapsedSeconds: number | null;
  finalDonationTotalEur: number | null;
  multiplier: EventMultiplier;
  resultCopy: string | null;
  status: EventResultStatus;
}

export interface PublicEventState {
  eventStartAt: string;
  liveTrackUrl: string | null;
  phase: EventPhase;
  result: PublicEventResult | null;
  updatedAt: string | null;
}

export function calculateEventMultiplier(
  status: EventResultStatus,
  elapsedSeconds: number | null,
): EventMultiplier {
  if (status === 'dnf') return 0;
  if (
    elapsedSeconds === null ||
    !Number.isInteger(elapsedSeconds) ||
    elapsedSeconds < 0
  ) {
    throw new RangeError(
      'A finished result requires non-negative elapsed seconds',
    );
  }

  const elapsedHours = elapsedSeconds / 3600;
  if (elapsedHours > 84) return 0;
  if (elapsedHours >= 76) return 1;
  if (elapsedHours >= 68) return 1.5;
  if (elapsedHours >= 60) return 2;
  return 2.5;
}
