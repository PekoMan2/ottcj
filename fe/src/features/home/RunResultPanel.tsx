import { Flag } from 'lucide-react';
import { Container } from '../../components/ui';
import type { EventResult } from '../event/eventState';

const currency = new Intl.NumberFormat('sk-SK', {
  currency: 'EUR',
  maximumFractionDigits: 2,
  style: 'currency',
});

function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours} h ${minutes} min ${remainingSeconds} s`;
}

function formatMultiplier(multiplier: EventResult['multiplier']): string {
  return `${new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 1 }).format(multiplier)}×`;
}

export function RunResultPanel({ result }: { result: EventResult }) {
  return (
    <section aria-labelledby="run-result-title" className="run-result-panel">
      <Container className="run-result-panel__inner">
        <Flag aria-hidden="true" />
        <div>
          <p className="run-result-panel__eyebrow">oficiálny výsledok</p>
          <h2 id="run-result-title">
            {result.status === 'finished' ? 'Majo dobehol.' : 'Beh sa skončil.'}
          </h2>
          {result.resultCopy ? <p>{result.resultCopy}</p> : null}
        </div>
        <dl>
          <div>
            <dt>výsledok</dt>
            <dd>
              {result.status === 'finished' && result.elapsedSeconds !== null
                ? formatElapsedTime(result.elapsedSeconds)
                : 'DNF'}
            </dd>
          </div>
          <div>
            <dt>násobok prísľubu</dt>
            <dd>{formatMultiplier(result.multiplier)}</dd>
          </div>
          {result.finalDonationTotalEur !== null ? (
            <div>
              <dt>overená darovaná suma</dt>
              <dd>{currency.format(result.finalDonationTotalEur)}</dd>
            </div>
          ) : null}
        </dl>
      </Container>
    </section>
  );
}
