import { BellRing } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  liveAlertConfigUrl,
  liveAlertSubscriptionUrl,
  parseLiveAlertConfiguration,
  type LiveAlertConfiguration,
} from './liveAlertConfig';

interface LiveAlertSignupProps {
  consentText?: string;
  consentVersion?: string;
  initialConfiguration?: LiveAlertConfiguration;
}

type ConfigurationState =
  | { status: 'loading' }
  | { message: string; status: 'error' }
  | { data: LiveAlertConfiguration; status: 'ready' };

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export function LiveAlertSignup({
  consentText,
  consentVersion,
  initialConfiguration,
}: LiveAlertSignupProps) {
  const [configuration, setConfiguration] = useState<ConfigurationState>(() =>
    initialConfiguration
      ? { data: initialConfiguration, status: 'ready' }
      : { status: 'loading' },
  );
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    if (!consentText || !consentVersion || initialConfiguration) return;
    const controller = new AbortController();
    fetch(liveAlertConfigUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseLiveAlertConfiguration(await response.json());
      })
      .then((data) => setConfiguration({ data, status: 'ready' }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const detail = error instanceof Error ? ` ${error.message}` : '';
        setConfiguration({
          message: `Registráciu upozornení sa nepodarilo načítať.${detail}`,
          status: 'error',
        });
      });
    return () => controller.abort();
  }, [consentText, consentVersion, initialConfiguration]);

  if (!consentText || !consentVersion) {
    return (
      <aside className="live-alert-signup live-alert-signup--pending" data-content-status="missing">
        <BellRing aria-hidden="true" />
        <div>
          <h2>upozorni ma, keď Majo vybehne</h2>
          <p>Registráciu spustíme po schválení súhlasu a úspešnom Garmin teste.</p>
        </div>
      </aside>
    );
  }

  if (configuration.status === 'loading') {
    return <div aria-live="polite" className="live-alert-signup">Načítavam možnosti upozornenia…</div>;
  }

  if (configuration.status === 'error') {
    return <div aria-live="polite" className="live-alert-signup live-alert-signup--error">{configuration.message}</div>;
  }

  const { channels, enabled } = configuration.data;
  if (configuration.data.consentVersion !== consentVersion) {
    return (
      <aside className="live-alert-signup live-alert-signup--error" role="status">
        Registrácia upozornení čaká na zosúladenie schválenej verzie súhlasu.
      </aside>
    );
  }
  const canUseEmail = enabled && channels.email.available;
  const canUseSms = enabled && channels.sms.available;

  if (!canUseEmail && !canUseSms) {
    return (
      <aside className="live-alert-signup live-alert-signup--closed">
        <BellRing aria-hidden="true" />
        <div>
          <h2>upozorni ma, keď Majo vybehne</h2>
          <p>Registrácia momentálne nie je dostupná alebo je overená Garmin kapacita naplnená.</p>
        </div>
      </aside>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();
    if (
      (!canUseEmail || normalizedEmail === '') &&
      (!canUseSms || normalizedPhone === '')
    ) {
      setSubmission('error');
      setSubmissionMessage('Zadaj aspoň jeden dostupný kontakt.');
      return;
    }
    if (!consent) {
      setSubmission('error');
      setSubmissionMessage('Na registráciu je potrebný schválený súhlas.');
      return;
    }

    setSubmission('submitting');
    setSubmissionMessage('');
    try {
      const response = await fetch(liveAlertSubscriptionUrl, {
        body: JSON.stringify({
          consent: true,
          ...(canUseEmail && normalizedEmail ? { email: normalizedEmail } : {}),
          ...(canUseSms && normalizedPhone ? { phone: normalizedPhone } : {}),
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Kapacita zvoleného kanála sa práve naplnila. Obnov stránku a vyber dostupný kanál.');
        }
        if (response.status === 429) {
          throw new Error('Príliš veľa pokusov. Skús to znova o niekoľko minút.');
        }
        throw new Error('Registráciu sa nepodarilo uložiť. Skús to znova.');
      }
      setEmail('');
      setPhone('');
      setConsent(false);
      setSubmission('success');
      setSubmissionMessage('Hotovo. Kontakt pred štartom bezpečne prenesieme do Garminu.');
    } catch (error) {
      setSubmission('error');
      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : 'Registráciu sa nepodarilo uložiť.',
      );
    }
  };

  return (
    <aside className="live-alert-signup">
      <div className="live-alert-signup__heading">
        <BellRing aria-hidden="true" />
        <div>
          <p>Garmin LiveTrack</p>
          <h2>upozorni ma, keď Majo vybehne a pošli mi link na jeho polohu</h2>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="live-alert-signup__fields">
          {canUseEmail ? (
            <label>
              <span>E-mail</span>
              <input
                autoComplete="email"
                maxLength={254}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="meno@example.sk"
                type="email"
                value={email}
              />
              <small>zostáva {channels.email.remaining} miest</small>
            </label>
          ) : null}
          {canUseSms ? (
            <label>
              <span>Telefón</span>
              <input
                autoComplete="tel"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                pattern={String.raw`\+[1-9]\d{7,14}`}
                placeholder="+421900000000"
                type="tel"
                value={phone}
              />
              <small>medzinárodný formát · zostáva {channels.sms.remaining} miest</small>
            </label>
          ) : null}
        </div>
        <label className="live-alert-signup__consent">
          <input
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
            type="checkbox"
          />
          <span>{consentText}</span>
        </label>
        <p className="live-alert-signup__privacy">
          Kontakt nie je verejný. Podrobnosti sú v <Link to="/gdpr">GDPR informáciách</Link>.
        </p>
        <button className="sticker-button" disabled={submission === 'submitting'} type="submit">
          {submission === 'submitting' ? 'ukladám…' : 'upozorniť pri štarte →'}
        </button>
        <p aria-live="polite" className={`live-alert-signup__feedback live-alert-signup__feedback--${submission}`}>
          {submissionMessage}
        </p>
      </form>
    </aside>
  );
}
