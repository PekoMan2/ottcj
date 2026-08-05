import { siteContent } from '../../config/content';
import { useDonioCampaignState } from './donioCampaignContext';

const currency = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  maximumFractionDigits: 0,
  style: 'currency',
});

const count = new Intl.NumberFormat('sk-SK');

const updatedFormat = new Intl.DateTimeFormat('sk-SK', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function DonioProgress() {
  const state = useDonioCampaignState();
  const { campaign } = siteContent.charity;
  const live = state.status === 'ready' ? state.data : null;
  const isLive = live?.campaignCollectedEur != null;
  const collected = live?.campaignCollectedEur ?? campaign.collectedFallbackEur;
  const target = live?.campaignTargetEur ?? campaign.targetEur;
  const percent = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;
  const updatedAt = live?.updatedAt ? new Date(live.updatedAt) : null;
  const hasChallenge =
    live?.challengeCollectedEur != null && live.challengeTargetEur != null;

  return (
    <aside aria-label={`Stav zbierky ${campaign.beneficiary}`} className="donio-progress">
      <p className="donio-progress__eyebrow">vyzbierané pre Vilka</p>
      <p className="donio-progress__numbers">
        <strong>{currency.format(collected)}</strong>
        <span>z {currency.format(target)}</span>
      </p>
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className="donio-progress__bar"
        role="progressbar"
      >
        <div className="donio-progress__fill" style={{ width: `${percent}%` }} />
        <span className="donio-progress__percent">{percent} %</span>
      </div>
      {hasChallenge ? (
        <p className="donio-progress__challenge">
          cez môj beh: <strong>{currency.format(live.challengeCollectedEur ?? 0)}</strong> z{' '}
          {currency.format(live.challengeTargetEur ?? 0)}
          {live.challengeDonorCount != null
            ? ` · ${count.format(live.challengeDonorCount)} ${live.challengeDonorCount === 1 ? 'darca' : 'darcov'}`
            : ''}
        </p>
      ) : null}
      <p className="donio-progress__meta">
        {isLive ? (
          <span>
            {live?.campaignDonorCount != null
              ? `${count.format(live.campaignDonorCount)} darov · `
              : ''}
            naživo z donio.sk
            {updatedAt ? ` · aktualizované ${updatedFormat.format(updatedAt)}` : ''}
          </span>
        ) : (
          <span>
            približný stav · presné čísla na{' '}
            <a href={campaign.destinationUrl} rel="noreferrer" target="_blank">
              {campaign.destinationLabel}
            </a>
          </span>
        )}
      </p>
    </aside>
  );
}
