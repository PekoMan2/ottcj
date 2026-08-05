import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DonioService } from './donio.service';

const challengePageUrl =
  'https://donio.sk/zachranme-vilyho/majo-od-tatier-k-dunaju';
const campaignPageUrl = 'https://donio.sk/zachranme-vilyho';

function createService(): DonioService {
  return new DonioService(
    new ConfigService({
      DONIO_CAMPAIGN_URL: campaignPageUrl,
      DONIO_CHALLENGE_URL: challengePageUrl,
    }),
  );
}

function pageHtml(options: {
  collectedCents: number;
  withChallenge: boolean;
}): string {
  const campaign = `\\"statistics\\":{\\"donationsCount\\":65422,\\"subprojectsCount\\":12,\\"targetAmountInCents\\":396350000,\\"currentAmountInCents\\":${options.collectedCents}}`;
  const challenge =
    '\\"subProject\\":{\\"statistics\\":{\\"donationsCount\\":1,\\"targetAmountInCents\\":100000,\\"currentAmountInCents\\":15000}}';
  const payload = options.withChallenge ? `${campaign},${challenge}` : campaign;
  return `<script>self.__next_f.push([1,"${payload}"])</script>`;
}

function okResponse(html: string): Response {
  return {
    ok: true,
    status: 200,
    text: () => Promise.resolve(html),
  } as Response;
}

describe('DonioService', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-05T10:00:00.000Z'));
    fetchMock = jest.spyOn(globalThis, 'fetch');
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('serves fetched totals and caches them within the refresh window', async () => {
    fetchMock.mockResolvedValue(
      okResponse(pageHtml({ collectedCents: 201329268, withChallenge: true })),
    );
    const service = createService();

    await expect(service.getPublicCampaign()).resolves.toEqual({
      campaignCollectedEur: 2013292.68,
      campaignDonorCount: 65422,
      campaignTargetEur: 3963500,
      challengeCollectedEur: 150,
      challengeDonorCount: 1,
      challengeTargetEur: 1000,
      source: 'donio',
      updatedAt: '2026-08-05T10:00:00.000Z',
    });
    expect(fetchMock.mock.calls[0][0]).toBe(challengePageUrl);
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);

    jest.setSystemTime(new Date('2026-08-05T10:04:00.000Z'));
    await service.getPublicCampaign();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refreshes totals after the cache window passes', async () => {
    fetchMock.mockResolvedValueOnce(
      okResponse(pageHtml({ collectedCents: 201329268, withChallenge: true })),
    );
    const service = createService();
    await service.getPublicCampaign();

    jest.setSystemTime(new Date('2026-08-05T10:05:00.000Z'));
    fetchMock.mockResolvedValueOnce(
      okResponse(pageHtml({ collectedCents: 201330268, withChallenge: true })),
    );
    await expect(service.getPublicCampaign()).resolves.toMatchObject({
      campaignCollectedEur: 2013302.68,
      updatedAt: '2026-08-05T10:05:00.000Z',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps serving the last good totals while Donio is down', async () => {
    fetchMock.mockResolvedValueOnce(
      okResponse(pageHtml({ collectedCents: 201329268, withChallenge: true })),
    );
    const service = createService();
    await service.getPublicCampaign();

    jest.setSystemTime(new Date('2026-08-05T10:05:00.000Z'));
    fetchMock.mockRejectedValue(new Error('connect timeout'));
    await expect(service.getPublicCampaign()).resolves.toMatchObject({
      campaignCollectedEur: 2013292.68,
      source: 'donio',
      updatedAt: '2026-08-05T10:00:00.000Z',
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);

    jest.setSystemTime(new Date('2026-08-05T10:05:10.000Z'));
    await service.getPublicCampaign();
    expect(fetchMock).toHaveBeenCalledTimes(3);

    jest.setSystemTime(new Date('2026-08-05T10:05:40.000Z'));
    fetchMock.mockResolvedValue(
      okResponse(pageHtml({ collectedCents: 201330268, withChallenge: true })),
    );
    await expect(service.getPublicCampaign()).resolves.toMatchObject({
      campaignCollectedEur: 2013302.68,
      updatedAt: '2026-08-05T10:05:40.000Z',
    });
  });

  it('falls back to the parent campaign page', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('connect timeout'))
      .mockResolvedValueOnce(
        okResponse(
          pageHtml({ collectedCents: 201329268, withChallenge: false }),
        ),
      );
    const service = createService();

    await expect(service.getPublicCampaign()).resolves.toMatchObject({
      campaignCollectedEur: 2013292.68,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      source: 'donio',
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      campaignPageUrl,
      expect.anything(),
    );
  });

  it('returns unavailable nulls when Donio has never responded', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 } as Response);
    const service = createService();

    await expect(service.getPublicCampaign()).resolves.toEqual({
      campaignCollectedEur: null,
      campaignDonorCount: null,
      campaignTargetEur: null,
      challengeCollectedEur: null,
      challengeDonorCount: null,
      challengeTargetEur: null,
      source: 'unavailable',
      updatedAt: null,
    });
  });

  it('shares one refresh between concurrent requests', async () => {
    fetchMock.mockResolvedValue(
      okResponse(pageHtml({ collectedCents: 201329268, withChallenge: true })),
    );
    const service = createService();

    await Promise.all([
      service.getPublicCampaign(),
      service.getPublicCampaign(),
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
