import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from 'node:crypto';
import type { LiveAlertChannel } from './live-alert-subscription.entity';

const encryptionVersion = 'v1';

@Injectable()
export class LiveAlertCryptoService {
  constructor(private readonly config: ConfigService) {}

  encrypt(value: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey(), iv);
    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);
    const authenticationTag = cipher.getAuthTag();

    return [
      encryptionVersion,
      iv.toString('base64url'),
      authenticationTag.toString('base64url'),
      encrypted.toString('base64url'),
    ].join(':');
  }

  decrypt(value: string): string {
    const [version, ivValue, authenticationTagValue, encryptedValue] =
      value.split(':');

    if (
      version !== encryptionVersion ||
      !ivValue ||
      !authenticationTagValue ||
      !encryptedValue
    ) {
      throw new Error('Unsupported encrypted contact format');
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey(),
      Buffer.from(ivValue, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(authenticationTagValue, 'base64url'));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  }

  fingerprint(channel: LiveAlertChannel | 'rate', value: string): string {
    return createHmac('sha256', this.fingerprintKey())
      .update(`${channel}\0${value}`)
      .digest('hex');
  }

  private masterKey(): Buffer {
    const configured = this.config.get<string>('LIVE_ALERT_DATA_KEY');
    if (!configured) {
      throw new ServiceUnavailableException('Live alerts are not configured');
    }

    const key = Buffer.from(configured, 'base64');
    if (key.length !== 32) {
      throw new ServiceUnavailableException('Live alert data key is invalid');
    }
    return key;
  }

  private encryptionKey(): Buffer {
    return Buffer.from(
      hkdfSync(
        'sha256',
        this.masterKey(),
        Buffer.alloc(0),
        Buffer.from('majootkd-live-alert-encryption'),
        32,
      ),
    );
  }

  private fingerprintKey(): Buffer {
    return Buffer.from(
      hkdfSync(
        'sha256',
        this.masterKey(),
        Buffer.alloc(0),
        Buffer.from('majootkd-live-alert-fingerprint'),
        32,
      ),
    );
  }
}
