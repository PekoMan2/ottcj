import { describe, expect, it } from 'vitest';
import { parseLiveAlertConfiguration } from './liveAlertConfig';

describe('parseLiveAlertConfiguration', () => {
  it('accepts exact safe capacity data', () => {
    expect(
      parseLiveAlertConfiguration({
        channels: {
          email: { available: true, capacity: 50, remaining: 49 },
          sms: { available: false, capacity: 0, remaining: 0 },
        },
        consentVersion: '2026-08-04',
        enabled: true,
      }),
    ).toEqual({
      channels: {
        email: { available: true, capacity: 50, remaining: 49 },
        sms: { available: false, capacity: 0, remaining: 0 },
      },
      consentVersion: '2026-08-04',
      enabled: true,
    });
  });

  it('rejects impossible or additional fields', () => {
    expect(() =>
      parseLiveAlertConfiguration({
        channels: {
          email: { available: true, capacity: 50, remaining: 51 },
          sms: { available: false, capacity: 0, remaining: 0 },
        },
        consentVersion: '2026-08-04',
        enabled: true,
      }),
    ).toThrow(TypeError);
    expect(() =>
      parseLiveAlertConfiguration({
        channels: {
          email: { available: false, capacity: 0, remaining: 0 },
          sms: { available: false, capacity: 0, remaining: 0 },
        },
        consentVersion: null,
        enabled: false,
        privateContacts: [],
      }),
    ).toThrow(TypeError);
  });
});
