export interface DonioCampaignSnapshot {
  campaignCollectedEur: number | null;
  campaignDonorCount: number | null;
  campaignTargetEur: number | null;
  challengeCollectedEur: number | null;
  challengeDonorCount: number | null;
  challengeTargetEur: number | null;
}

export interface PublicDonioCampaign extends DonioCampaignSnapshot {
  source: 'donio' | 'unavailable';
  updatedAt: string | null;
}

const campaignStatisticsPattern =
  /"statistics":(\{[^{}]*"subprojectsCount":[^{}]*\})/u;
const challengeStatisticsPattern = /"statistics":(\{[^{}]*\})/u;
const subProjectMarker = '"subProject":{';

function parseStatistics(
  json: string | undefined,
): Record<string, unknown> | null {
  if (!json) return null;
  try {
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function readCount(
  statistics: Record<string, unknown> | null,
  key: string,
): number | null {
  const value = statistics?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readEur(
  statistics: Record<string, unknown> | null,
  key: string,
): number | null {
  const cents = readCount(statistics, key);
  return cents === null ? null : cents / 100;
}

// Donio pages embed statistics as quote-escaped JSON in Next.js flight data.
export function parseDonioCampaignHtml(
  html: string,
): DonioCampaignSnapshot | null {
  const normalized = html.replaceAll('\\"', '"');
  const campaign = parseStatistics(
    campaignStatisticsPattern.exec(normalized)?.[1],
  );
  const subProjectStart = normalized.indexOf(subProjectMarker);
  const challenge =
    subProjectStart === -1
      ? null
      : parseStatistics(
          challengeStatisticsPattern.exec(
            normalized.slice(subProjectStart),
          )?.[1],
        );

  if (!campaign && !challenge) return null;

  return {
    campaignCollectedEur: readEur(campaign, 'currentAmountInCents'),
    campaignDonorCount: readCount(campaign, 'donationsCount'),
    campaignTargetEur: readEur(campaign, 'targetAmountInCents'),
    challengeCollectedEur: readEur(challenge, 'currentAmountInCents'),
    challengeDonorCount: readCount(challenge, 'donationsCount'),
    challengeTargetEur: readEur(challenge, 'targetAmountInCents'),
  };
}
