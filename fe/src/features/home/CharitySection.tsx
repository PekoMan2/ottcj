import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { SiteConfig } from '../../config/site';
import { Link } from 'react-router';
import {
  calculatePledgeAmount,
  pledgeBrackets,
} from '../pledge/pledge';
import { usePublicPledges } from '../pledge/publicPledgeContext';
import { useEventState } from '../event/eventStateContext';
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
  const eventState = useEventState();
  const pledgeState = usePublicPledges();
  const isPost = eventState.status === 'ready' && eventState.data.phase === 'post';

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
          <Link className="vily-card__tag" to="/vily">{charity.story.tag}</Link>
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

        <div className="pledge-explanation" id="prispevok">
          <p>
            Ako to funguje: prispeješ <strong>základnou sumou</strong>. Podľa toho,
            ako rýchlo dobehnem, sa suma <strong>znásobí</strong>. Ak nedobehnem,
            príspevok padá. Peniaze idú priamo na Vilyho liečbu.
          </p>
        </div>

        <h3 className="brackets-title">časové brackets <span aria-hidden="true">↘</span></h3>
        <div aria-label="Násobky príspevku podľa výsledného času" className="brackets" role="list">
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
        <p className="dnf-note">nad 84h alebo DNF → príspevok padá · 0×</p>

        <div className="pledge-example">
          <span className="pledge-example__label">príklad:</span>
          <p>
            Prispeješ <strong>{currency.format(exampleBaseAmount)}</strong>. Ak dobehnem za{' '}
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
          {!isPost ? <PledgeCta href={config.pledgeFormUrl} /> : null}
          <Link className="pledge-list-link" to="/prispevky">zoznam príspevkov</Link>
        </div>
        <p className="charity-note">↳ príspevok cez Google formulár. transparentne, dohľadateľne.</p>

        <div className="pledge-summary" data-pledge-status={pledgeState.status}>
          {pledgeState.status === 'loading' ? <p><strong>Načítavam verejné príspevky…</strong></p> : null}
          {pledgeState.status === 'error' ? <p><strong>Súhrn momentálne nie je dostupný.</strong> Bezpečné verejné dáta sa nepodarilo načítať.</p> : null}
          {pledgeState.status === 'ready' ? (
            <p>
              <strong>{pledgeState.summary.participantCount}</strong> ľudí prispelo · základ{' '}
              <strong>{currency.format(pledgeState.summary.baseTotalEur)}</strong> · potenciál až{' '}
              <strong>{currency.format(pledgeState.summary.maximumPotentialEur)}</strong>
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
