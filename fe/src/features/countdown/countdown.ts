export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  totalMilliseconds: number;
}

export function getCountdownParts(
  startAt: string | Date,
  now: Date = new Date(),
): CountdownParts {
  const start = startAt instanceof Date ? startAt : new Date(startAt);
  const difference = Math.max(0, start.getTime() - now.getTime());
  const totalMinutes = Math.floor(difference / 60_000);

  return {
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
    totalMilliseconds: difference,
  };
}

export function formatCountdown(parts: CountdownParts): string {
  if (parts.totalMilliseconds === 0) {
    return 'štart je tu';
  }

  return `${parts.days}d · ${String(parts.hours).padStart(2, '0')}h · ${String(parts.minutes).padStart(2, '0')}m`;
}
