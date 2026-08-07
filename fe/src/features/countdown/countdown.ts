export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  started: boolean;
  totalMilliseconds: number;
}

export function getCountdownParts(
  startAt: string | Date,
  now: Date = new Date(),
): CountdownParts {
  const start = startAt instanceof Date ? startAt : new Date(startAt);
  const difference = start.getTime() - now.getTime();
  const magnitude = Math.abs(difference);
  const totalMinutes = Math.floor(magnitude / 60_000);

  return {
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
    started: difference <= 0,
    totalMilliseconds: magnitude,
  };
}

export function formatCountdown(parts: CountdownParts): string {
  if (parts.started) {
    const totalHours = parts.days * 24 + parts.hours;
    return `${totalHours}h · ${String(parts.minutes).padStart(2, '0')}m`;
  }

  return `${parts.days}d · ${String(parts.hours).padStart(2, '0')}h · ${String(parts.minutes).padStart(2, '0')}m`;
}
