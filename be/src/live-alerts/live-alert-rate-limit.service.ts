import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isIPv6 } from 'node:net';
import { LiveAlertCryptoService } from './live-alert-crypto.service';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitWindowMilliseconds = 10 * 60 * 1000;
const maximumTrackedClients = 10_000;

// One IPv6 client can rotate a whole /64; IPv4-mapped forms all share one /64.
function clientAddressKey(ipAddress: string): string {
  const address = ipAddress.split('%')[0];
  if (!isIPv6(address) || address.includes('.')) return ipAddress;
  const [head, tail = ''] = address.split('::');
  const headGroups = head === '' ? [] : head.split(':');
  const tailGroups = tail === '' ? [] : tail.split(':');
  const zeroCount = 8 - headGroups.length - tailGroups.length;
  return [
    ...headGroups,
    ...new Array<string>(zeroCount).fill('0'),
    ...tailGroups,
  ]
    .slice(0, 4)
    .map((group) => group.padStart(4, '0'))
    .join(':');
}

@Injectable()
export class LiveAlertRateLimitService {
  private readonly entries = new Map<string, RateLimitEntry>();

  constructor(
    private readonly config: ConfigService,
    private readonly crypto: LiveAlertCryptoService,
  ) {}

  assertAllowed(ipAddress: string): void {
    const now = Date.now();
    const key = this.crypto.fingerprint('rate', clientAddressKey(ipAddress));
    const existing = this.entries.get(key);
    const maximum = this.config.get<number>('LIVE_ALERT_RATE_LIMIT_MAX') ?? 5;

    if (!existing || existing.resetAt <= now) {
      this.entries.delete(key);
      this.entries.set(key, {
        count: 1,
        resetAt: now + rateLimitWindowMilliseconds,
      });
      this.removeExpiredEntries(now);
      this.evictOldestEntries();
      return;
    }

    if (existing.count >= maximum) {
      throw new HttpException(
        'Too many live alert registration attempts',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    existing.count += 1;
  }

  // Delete-before-set keeps the map ordered by ascending resetAt.
  private removeExpiredEntries(now: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt > now) return;
      this.entries.delete(key);
    }
  }

  private evictOldestEntries(): void {
    while (this.entries.size > maximumTrackedClients) {
      const oldest = this.entries.keys().next();
      if (oldest.done) return;
      this.entries.delete(oldest.value);
    }
  }
}
