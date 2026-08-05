export const donioCampaignUrl = '/api/donio-campaign';

export interface DonioCampaign {
  campaignCollectedEur: number | null;
  campaignDonorCount: number | null;
  campaignTargetEur: number | null;
  challengeCollectedEur: number | null;
  challengeDonorCount: number | null;
  challengeTargetEur: number | null;
  updatedAt: string | null;
}

function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

function parseUpdatedAt(value: unknown): string | null {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return value;
}

export function parseDonioCampaign(value: unknown): DonioCampaign {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError('Donio campaign payload must be an object');
  }
  const record = value as Record<string, unknown>;
  return {
    campaignCollectedEur: parseAmount(record.campaignCollectedEur),
    campaignDonorCount: parseAmount(record.campaignDonorCount),
    campaignTargetEur: parseAmount(record.campaignTargetEur),
    challengeCollectedEur: parseAmount(record.challengeCollectedEur),
    challengeDonorCount: parseAmount(record.challengeDonorCount),
    challengeTargetEur: parseAmount(record.challengeTargetEur),
    updatedAt: parseUpdatedAt(record.updatedAt),
  };
}
