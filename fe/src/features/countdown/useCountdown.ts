import { useEffect, useState } from 'react';
import { getCountdownParts } from './countdown';

export function useCountdown(startAt: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return getCountdownParts(startAt, now);
}
