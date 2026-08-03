export const liveAlertConfigUrl = '/api/live-alert-subscriptions/config';
export const liveAlertSubscriptionUrl = '/api/live-alert-subscriptions';

export interface LiveAlertChannelConfiguration {
  available: boolean;
  capacity: number;
  remaining: number;
}

export interface LiveAlertConfiguration {
  channels: {
    email: LiveAlertChannelConfiguration;
    sms: LiveAlertChannelConfiguration;
  };
  consentVersion: string | null;
  enabled: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseChannel(value: unknown): LiveAlertChannelConfiguration {
  if (!isRecord(value)) throw new TypeError('Live alert channel must be an object');
  const keys = Object.keys(value);
  if (
    keys.length !== 3 ||
    !keys.includes('available') ||
    !keys.includes('capacity') ||
    !keys.includes('remaining') ||
    typeof value.available !== 'boolean' ||
    typeof value.capacity !== 'number' ||
    !Number.isInteger(value.capacity) ||
    value.capacity < 0 ||
    typeof value.remaining !== 'number' ||
    !Number.isInteger(value.remaining) ||
    value.remaining < 0 ||
    value.remaining > value.capacity
  ) {
    throw new TypeError('Live alert channel configuration is invalid');
  }
  return {
    available: value.available,
    capacity: value.capacity,
    remaining: value.remaining,
  };
}

export function parseLiveAlertConfiguration(value: unknown): LiveAlertConfiguration {
  if (
    !isRecord(value) ||
    typeof value.enabled !== 'boolean' ||
    !isRecord(value.channels) ||
    (value.consentVersion !== null &&
      (typeof value.consentVersion !== 'string' ||
        !/^[A-Za-z0-9._-]{1,64}$/u.test(value.consentVersion))) ||
    (value.enabled && value.consentVersion === null) ||
    (!value.enabled && value.consentVersion !== null)
  ) {
    throw new TypeError('Live alert configuration is invalid');
  }
  const rootKeys = Object.keys(value);
  const channelKeys = Object.keys(value.channels);
  if (
    rootKeys.length !== 3 ||
    !rootKeys.includes('channels') ||
    !rootKeys.includes('consentVersion') ||
    !rootKeys.includes('enabled') ||
    channelKeys.length !== 2 ||
    !channelKeys.includes('email') ||
    !channelKeys.includes('sms')
  ) {
    throw new TypeError('Live alert configuration contains unsupported fields');
  }
  return {
    channels: {
      email: parseChannel(value.channels.email),
      sms: parseChannel(value.channels.sms),
    },
    consentVersion: value.consentVersion,
    enabled: value.enabled,
  };
}
