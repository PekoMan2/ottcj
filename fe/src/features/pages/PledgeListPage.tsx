import { Link } from 'react-router';
import { Card, Container, Section } from '../../components/ui';
import type { SiteConfig } from '../../config/site';
import { PledgeCta } from '../home/PledgeCta';
import { usePublicPledges } from '../pledge/publicPledgeContext';
import { calculateMaximumPotentialEur, publicDisplayName } from '../pledge/publicPledges';
import { PageIntro } from './PageIntro';

const currency = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: 'currency',
});

export function PledgeListPage({ config }: { config: SiteConfig }) {
  const state = usePublicPledges();
  return (
    <>
      <PageIntro
        actions={<PledgeCta href={config.pledgeFormUrl} />}
        annotation="verejné mená iba so súhlasom · ostatní sú Anonym"
        eyebrow="verejný príspevok"
        title="Zoznam príspevkov."
      >
        <p>Výsledková listina bezpečných verejných údajov: meno určené na zverejnenie, základná suma a maximálny potenciál.</p>
      </PageIntro>

      <Section aria-labelledby="pledge-results-title" className="subpage-section">
        <Container>
          <h2 className="subpage-section__title" id="pledge-results-title">Kto beží s nami.</h2>
          {state.status === 'loading' ? (
            <div aria-live="polite" className="data-status">Načítavam verejné príspevky…</div>
          ) : null}
          {state.status === 'error' ? (
            <div aria-live="polite" className="data-status data-status--error">{state.message}</div>
          ) : null}
          {state.status === 'ready' && state.data.pledges.length === 0 ? (
            <Card className="empty-pledges" rotation="left">
              <strong>Zatiaľ nie je zverejnený žiadny príspevok.</strong>
              <p>Prvé bezpečné verejné údaje pribudnú po manuálnej kontrole formulára.</p>
            </Card>
          ) : null}
          {state.status === 'ready' && state.data.pledges.length > 0 ? (
            <div className="pledge-table-wrap">
              <table className="pledge-table">
                <caption>Verejné príspevky pre Zachráňme Vilyho</caption>
                <thead><tr><th scope="col">Meno</th><th scope="col">Základ</th><th scope="col">Potenciál (2,5×)</th></tr></thead>
                <tbody>
                  {state.data.pledges.map((pledge, index) => (
                    <tr key={`${publicDisplayName(pledge)}-${pledge.baseAmountEur}-${index}`}>
                      <th scope="row">{publicDisplayName(pledge)}</th>
                      <td>{currency.format(pledge.baseAmountEur)}</td>
                      <td>{currency.format(calculateMaximumPotentialEur(pledge))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><th scope="row">SPOLU ({state.summary.participantCount} ľudí)</th><td>{currency.format(state.summary.baseTotalEur)}</td><td>{currency.format(state.summary.maximumPotentialEur)}</td></tr></tfoot>
              </table>
              {state.data.updatedAt ? <p className="data-updated">Aktualizované <time dateTime={state.data.updatedAt}>{new Intl.DateTimeFormat('sk-SK', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(state.data.updatedAt))}</time></p> : null}
            </div>
          ) : null}
        </Container>
      </Section>

      <Section aria-labelledby="pledge-terms-title" className="terms-section">
        <Container>
          <Card rotation="right" tone="cream">
            <p className="legal-warning">PRACOVNÝ PLACEHOLDER · VYŽADUJE PRÁVNE SCHVÁLENIE</p>
            <h2 id="pledge-terms-title">Podmienky príspevku.</h2>
            <p>Príspevok používa základnú sumu a násobok podľa výsledného času. DNF alebo čas nad 84 hodín znamená násobok 0×. Finálne znenie, minimálna suma, spôsob splnenia a platobné údaje ešte nie sú právne ani prevádzkovo schválené.</p>
            <Link className="text-link" to="/gdpr">informácie o ochrane údajov →</Link>
          </Card>
        </Container>
      </Section>
    </>
  );
}
