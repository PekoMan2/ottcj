import { describe, expect, it } from 'vitest';
import { parseDonioCampaign } from './donioCampaign';

describe('parseDonioCampaign', () => {
  it('parses a full payload', () => {
    expect(
      parseDonioCampaign({
        campaignCollectedEur: 2_013_292.68,
        campaignDonorCount: 65_422,
        campaignTargetEur: 3_963_500,
        challengeCollectedEur: 150,
        challengeDonorCount: 1,
        challengeTargetEur: 1000,
        source: 'donio',
        updatedAt: '2026-08-05T10:00:00.000Z',
      }),
    ).toEqual({
      campaignCollectedEur: 2_013_292.68,
      campaignDonorCount: 65_422,
      campaignTargetEur: 3_963_500,
      challengeCollectedEur: 150,
      challengeDonorCount: 1,
      challengeTargetEur: 1000,
      updatedAt: '2026-08-05T10:00:00.000Z',
    });
  });

  it('degrades invalid fields to null instead of failing', () => {
    expect(
      parseDonioCampaign({
        campaignCollectedEur: 'veľa',
        campaignTargetEur: -1,
        challengeCollectedEur: Number.NaN,
        updatedAt: 'niekedy',
      }),
    ).toEqual({
      campaignCollectedEur: null,
      campaignDonorCount: null,
      campaignTargetEur: null,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      challengeTargetEur: null,
      updatedAt: null,
    });
  });

  it('accepts an empty object', () => {
    expect(parseDonioCampaign({})).toEqual({
      campaignCollectedEur: null,
      campaignDonorCount: null,
      campaignTargetEur: null,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      challengeTargetEur: null,
      updatedAt: null,
    });
  });

  it('rejects non-object payloads', () => {
    expect(() => parseDonioCampaign(null)).toThrow(TypeError);
    expect(() => parseDonioCampaign([])).toThrow(TypeError);
    expect(() => parseDonioCampaign('{}')).toThrow(TypeError);
  });
});
