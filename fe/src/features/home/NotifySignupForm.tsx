import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { siteContent } from '../../config/content';

const subscribeUrl = '/api/live-alert-subscriptions';

type SubmitPhase = 'idle' | 'submitting' | 'success';

export function NotifySignupForm() {
  const { form } = siteContent.tracking.notify;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [prefix, setPrefix] = useState(form.prefixes[0].value);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<SubmitPhase>('idle');
  const [error, setError] = useState<string | null>(null);

  if (phase === 'success') {
    return (
      <div className="notify-form__success" role="status">
        <strong>{form.successTitle}</strong>
        <p>{form.successBody}</p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const digits = phoneDigits.replace(/\s/gu, '');

    if (!trimmedFirstName || !trimmedLastName) {
      setError(form.errorNameRequired);
      return;
    }
    if (!trimmedEmail && !digits) {
      setError(form.errorContactRequired);
      return;
    }
    if (digits && !/^\d{9}$/u.test(digits)) {
      setError(form.errorPhoneInvalid);
      return;
    }
    if (!consent) {
      setError(form.errorConsentRequired);
      return;
    }

    setError(null);
    setPhase('submitting');
    try {
      const response = await fetch(subscribeUrl, {
        body: JSON.stringify({
          consent: true,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          ...(trimmedEmail ? { email: trimmedEmail } : {}),
          ...(digits ? { phone: `${prefix}${digits}` } : {}),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (response.ok) {
        setPhase('success');
        return;
      }
      setPhase('idle');
      if (response.status === 409) setError(form.errorCapacity);
      else if (response.status === 429) setError(form.errorRateLimit);
      else setError(form.errorGeneric);
    } catch {
      setPhase('idle');
      setError(form.errorGeneric);
    }
  };

  return (
    <form className="notify-form" noValidate onSubmit={handleSubmit}>
      <div className="notify-form__grid">
        <label>
          {form.firstNameLabel}
          <input
            autoComplete="given-name"
            maxLength={100}
            name="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            required
            type="text"
            value={firstName}
          />
        </label>
        <label>
          {form.lastNameLabel}
          <input
            autoComplete="family-name"
            maxLength={100}
            name="lastName"
            onChange={(event) => setLastName(event.target.value)}
            required
            type="text"
            value={lastName}
          />
        </label>
      </div>
      <div className="notify-form__grid">
        <label>
          {form.emailLabel}
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <div className="notify-form__field">
          <label htmlFor="notify-phone-number">{form.phoneLabel}</label>
          <span className="notify-form__phone">
            <select
              aria-label={form.prefixLabel}
              name="phonePrefix"
              onChange={(event) => setPrefix(event.target.value)}
              value={prefix}
            >
              {form.prefixes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              autoComplete="tel-national"
              id="notify-phone-number"
              inputMode="tel"
              name="phone"
              onChange={(event) => setPhoneDigits(event.target.value)}
              placeholder={form.phonePlaceholder}
              type="text"
              value={phoneDigits}
            />
          </span>
        </div>
      </div>
      <p className="notify-form__hint">{form.contactHint}</p>
      <div className="notify-form__consent">
        <label>
          <input
            checked={consent}
            name="consent"
            onChange={(event) => setConsent(event.target.checked)}
            required
            type="checkbox"
          />
          {form.consentLabel}
        </label>
        <Link to="/gdpr">{form.consentLinkLabel}</Link>
      </div>
      {error ? (
        <p className="notify-form__error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="sticker-button"
        disabled={phase === 'submitting'}
        type="submit"
      >
        {phase === 'submitting' ? form.submittingLabel : form.submitLabel}
      </button>
    </form>
  );
}
