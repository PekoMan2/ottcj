import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { SiteConfig } from '../../config/site';
import {
  calculatePledgeAmount,
  pledgeBrackets,
  pledgeTotals,
} from '../pledge/pledge';
import { HeartDoodle } from './Doodles';
import { PledgeCta } from './PledgeCta';

interface CharitySectionProps {
  config: SiteConfig;
}

const exampleBaseAmount = 20;
const exampleOutcomes = [
  { hours: 58, label: '58 hodín' },
  { hours: 70, label: '70 hodín' },
  { hours: 80, label: '80 hodín' },
] as const;

const currency = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  maximumFractionDigits: 2,
  style: 'currency',
});

export function CharitySection({ config }: CharitySectionProps) {
  const { charity } = siteContent;

  return (
    <section aria-labelledby="charity-title" className="charity-section" id="vily">
      <Container className="charity-section__inner">
        <div className="charity-badge">{charity.badge}</div>
        <h2
          aria-label="bež so mnou. zachráňme Vilyho."
          className="charity-title"
          id="charity-title"
        >
          {charity.headingLead}
          <span>{charity.headingPurpose}</span>
        </h2>

        <article className="vily-card">
          <div className="vily-card__tag">{charity.story.tag}</div>
          <HeartDoodle className="vily-card__heart" />
          <div className="vily-card__copy">
            <p>{charity.story.introduction}</p>
            <p className="vily-card__accent">{charity.story.accent}</p>
          </div>
          <p className="vily-card__progress">
            Zatiaľ vyzbieraných <strong>{charity.campaign.collectedApproximation}</strong>{' '}
            z celkových <strong>{charity.campaign.targetApproximation}</strong>. Ešte je veľa práce.{' '}
            <a href={charity.campaign.destinationUrl}>{charity.campaign.destinationLabel}</a>
          </p>
        </article>

        <div className="pledge-explanation" id="prislub">
          <p>
            Ako to funguje: prisľúbiš <strong>základnú sumu</strong>. Podľa toho,
            ako rýchlo dobehnem, sa suma <strong>znásobí</strong>. Ak nedobehnem,
            prísľub padá. Peniaze idú priamo na Vilyho liečbu.
          </p>
        </div>

        <h3 className="brackets-title">časové brackets <span aria-hidden="true">↘</span></h3>
        <div aria-label="Násobky prísľubu podľa výsledného času" className="brackets" role="list">
          {pledgeBrackets.map((bracket) => (
            <div
              className={`bracket-row ${bracket.tone === 'max' ? 'bracket-row--max' : ''}`}
              key={bracket.multiplier}
              role="listitem"
            >
              <span aria-label={bracket.accessibleRange} className="bracket-row__time">
                {bracket.displayRange}
                {bracket.tone === 'max' ? <em>← MAX</em> : null}
              </span>
              <strong>{bracket.multiplier}× základ</strong>
            </div>
          ))}
        </div>
        <p className="dnf-note">nad 84h alebo DNF → prísľub padá · 0×</p>

        <div className="pledge-example">
          <span className="pledge-example__label">príklad:</span>
          <p>
            Prisľúbiš <strong>{currency.format(exampleBaseAmount)}</strong>. Ak dobehnem za{' '}
            <strong>{exampleOutcomes[0].label}</strong>, uhradíš{' '}
            <strong className="pledge-example__result">
              {currency.format(
                calculatePledgeAmount(exampleBaseAmount, {
                  elapsedHours: exampleOutcomes[0].hours,
                  status: 'finished',
                }),
              )}
            </strong>
            . Za {exampleOutcomes[1].hours}h →{' '}
            {currency.format(
              calculatePledgeAmount(exampleBaseAmount, {
                elapsedHours: exampleOutcomes[1].hours,
                status: 'finished',
              }),
            )}
            . Za {exampleOutcomes[2].hours}h →{' '}
            {currency.format(
              calculatePledgeAmount(exampleBaseAmount, {
                elapsedHours: exampleOutcomes[2].hours,
                status: 'finished',
              }),
            )}
            . Nedobehnem → {currency.format(calculatePledgeAmount(exampleBaseAmount, { status: 'dnf' }))}.
          </p>
        </div>

        <div className="charity-actions">
          <PledgeCta href={config.pledgeFormUrl} />
          <button className="pledge-list-placeholder" disabled type="button">
            zoznam prísľubov · čoskoro
          </button>
        </div>
        <p className="charity-note">↳ prísľub cez Google formulár. transparentne, dohľadateľne.</p>

        <div className="pledge-summary" data-pledge-status={pledgeTotals.status}>
          {pledgeTotals.status === 'pending' ? (
            <p><strong>Súhrn prísľubov pripravujeme.</strong> Počty a sumy doplníme z bezpečných verejných dát.</p>
          ) : (
            <p>
              <strong>{pledgeTotals.pledgerCount}</strong> ľudí prisľúbilo · základ{' '}
              <strong>{currency.format(pledgeTotals.baseAmountEur)}</strong> · potenciál až{' '}
              <strong>{currency.format(pledgeTotals.baseAmountEur * 2.5)}</strong>
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
