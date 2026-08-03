import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LiveAlertCryptoService } from './live-alert-crypto.service';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitWindowMilliseconds = 10 * 60 * 1000;

@Injectable()
export class LiveAlertRateLimitService {
  private readonly entries = new Map<string, RateLimitEntry>();

  constructor(
    private readonly config: ConfigService,
    private readonly crypto: LiveAlertCryptoService,
  ) {}

  assertAllowed(ipAddress: string): void {
    const now = Date.now();
    const key = this.crypto.fingerprint('rate', ipAddress);
    const existing = this.entries.get(key);
    const maximum = this.config.get<number>('LIVE_ALERT_RATE_LIMIT_MAX') ?? 5;

    if (!existing || existing.resetAt <= now) {
      this.entries.set(key, {
        count: 1,
        resetAt: now + rateLimitWindowMilliseconds,
      });
      this.removeExpiredEntries(now);
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

  private removeExpiredEntries(now: number): void {
    if (this.entries.size < 500) return;
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
  }
}
