import { siteContent } from '../../config/content';

const currency = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  maximumFractionDigits: 0,
  style: 'currency',
});

export function DonioProgress() {
  const { campaign } = siteContent.charity;
  const collected = campaign.collectedApproxEur;
  const target = campaign.targetEur;
  const percent = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

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
      <p className="donio-progress__meta">
        <span>
          približný stav · presné čísla na{' '}
          <a href={campaign.destinationUrl} rel="noreferrer" target="_blank">
            {campaign.destinationLabel}
          </a>
        </span>
      </p>
    </aside>
  );
}
