import { parseDonioCampaignHtml } from './donio.types';

const campaignPayload =
  '\\"statistics\\":{\\"donationsCount\\":65422,\\"subprojectsCount\\":12,\\"targetAmountInCents\\":396350000,\\"currentAmountInCents\\":201329268,\\"averageDonationInCents\\":3077,\\"largestDonationInCents\\":10000000,\\"donationMatchingCurrentAmountInCents\\":0}';
const challengePayload =
  '\\"subProject\\":{\\"slug\\":\\"majo-od-tatier-k-dunaju\\",\\"statistics\\":{\\"donationsCount\\":1,\\"targetAmountInCents\\":100000,\\"currentAmountInCents\\":15000,\\"averageDonationInCents\\":15000}}';

function flightHtml(...payloads: string[]): string {
  return `<html><body><script>self.__next_f.push([1,"${payloads.join(',')}"])</script></body></html>`;
}

describe('parseDonioCampaignHtml', () => {
  it('extracts campaign and challenge totals from the challenge page', () => {
    expect(
      parseDonioCampaignHtml(flightHtml(campaignPayload, challengePayload)),
    ).toEqual({
      campaignCollectedEur: 2013292.68,
      campaignDonorCount: 65422,
      campaignTargetEur: 3963500,
      challengeCollectedEur: 150,
      challengeDonorCount: 1,
      challengeTargetEur: 1000,
    });
  });

  it('extracts campaign totals alone from the parent campaign page', () => {
    expect(parseDonioCampaignHtml(flightHtml(campaignPayload))).toEqual({
      campaignCollectedEur: 2013292.68,
      campaignDonorCount: 65422,
      campaignTargetEur: 3963500,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      challengeTargetEur: null,
    });
  });

  it('nulls fields that are missing or not numeric', () => {
    const payload =
      '\\"statistics\\":{\\"donationsCount\\":\\"many\\",\\"subprojectsCount\\":12,\\"currentAmountInCents\\":201329268}';
    expect(parseDonioCampaignHtml(flightHtml(payload))).toEqual({
      campaignCollectedEur: 2013292.68,
      campaignDonorCount: null,
      campaignTargetEur: null,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      challengeTargetEur: null,
    });
  });

  it('returns null for a page without statistics', () => {
    expect(
      parseDonioCampaignHtml('<html><body>maintenance</body></html>'),
    ).toBeNull();
  });

  it('returns null for malformed statistics JSON', () => {
    const payload = '\\"statistics\\":{\\"subprojectsCount\\":oops}';
    expect(parseDonioCampaignHtml(flightHtml(payload))).toBeNull();
  });
});
