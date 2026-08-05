import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { DonioCampaignSnapshot, PublicDonioCampaign } from './donio.types';
import { parseDonioCampaignHtml } from './donio.types';

const successRefreshMilliseconds = 5 * 60 * 1000;
const failureRefreshMilliseconds = 30 * 1000;
const fetchTimeoutMilliseconds = 5000;

const emptySnapshot: DonioCampaignSnapshot = {
  campaignCollectedEur: null,
  campaignDonorCount: null,
  campaignTargetEur: null,
  challengeCollectedEur: null,
  challengeDonorCount: null,
  challengeTargetEur: null,
};

@Injectable()
export class DonioService {
  private readonly logger = new Logger(DonioService.name);
  private snapshot: DonioCampaignSnapshot | null = null;
  private snapshotAt: Date | null = null;
  private nextRefreshAt = 0;
  private refreshing: Promise<void> | null = null;

  constructor(private readonly config: ConfigService) {}

  async getPublicCampaign(): Promise<PublicDonioCampaign> {
    if (Date.now() >= this.nextRefreshAt) {
      this.refreshing ??= this.refresh().finally(() => {
        this.refreshing = null;
      });
      await this.refreshing;
    }

    if (!this.snapshot || !this.snapshotAt) {
      return { ...emptySnapshot, source: 'unavailable', updatedAt: null };
    }

    return {
      ...this.snapshot,
      source: 'donio',
      updatedAt: this.snapshotAt.toISOString(),
    };
  }

  private async refresh(): Promise<void> {
    const pageUrls = [
      this.config.getOrThrow<string>('DONIO_CHALLENGE_URL'),
      this.config.getOrThrow<string>('DONIO_CAMPAIGN_URL'),
    ];

    for (const url of pageUrls) {
      try {
        this.snapshot = await this.fetchSnapshot(url);
        this.snapshotAt = new Date();
        this.nextRefreshAt = Date.now() + successRefreshMilliseconds;
        return;
      } catch (error) {
        this.logger.warn(
          `Donio fetch from ${url} failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    this.nextRefreshAt = Date.now() + failureRefreshMilliseconds;
  }

  private async fetchSnapshot(url: string): Promise<DonioCampaignSnapshot> {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(fetchTimeoutMilliseconds),
    });
    if (!response.ok) {
      throw new Error(`unexpected status ${response.status}`);
    }
    const snapshot = parseDonioCampaignHtml(await response.text());
    if (!snapshot) {
      throw new Error('page contained no campaign statistics');
    }
    return snapshot;
  }
}
