import { Check, ExternalLink, Footprints, MapPin, Send, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import type { EventState } from '../event/eventState';

const stepIcons = [MapPin, Footprints, Send] as const;

type CopyState = 'idle' | 'copied' | 'error';

interface JoinRunSectionProps {
  eventState: EventState;
}

export function JoinRunSection({ eventState }: JoinRunSectionProps) {
  const { joinRun } = siteContent;
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const liveTrackUrl = eventState.phase === 'live' ? eventState.liveTrackUrl : null;
  const shareFunction = (navigator as unknown as {
    share?: (data: ShareData) => Promise<void>;
  }).share;

  const share = async () => {
    const shareUrl = new URL('/', window.location.origin).toString();
    if (shareFunction) {
      try {
        await shareFunction.call(navigator, {
          text: joinRun.share.text,
          title: joinRun.share.title,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <Section aria-labelledby="join-run-title" className="join-run-section" id="pridaj-sa">
      <Container>
        <SectionHeading
          annotation={joinRun.annotation}
          eyebrow={joinRun.eyebrow}
          id="join-run-title"
          title={joinRun.title}
        />
        <p className="join-run-section__intro">{joinRun.intro}</p>

        <ol className="join-run-steps">
          {joinRun.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? MapPin;
            return (
              <li className={`join-run-step join-run-step--${index + 1}`} key={step.title}>
                <Icon aria-hidden="true" />
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            );
          })}
        </ol>

        <div className="join-run-section__actions">
          {liveTrackUrl ? (
            <a className="live-track-cta" href={liveTrackUrl} rel="noreferrer" target="_blank">
              kde práve som <ExternalLink aria-hidden="true" size={18} />
            </a>
          ) : null}
          <button className="sticker-button sticker-button--dark" onClick={() => void share()} type="button">
            {copyState === 'copied' ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
            pošli to bežcovi
          </button>
          <p aria-live="polite" className="join-run-section__feedback">
            {copyState === 'copied' ? 'Odkaz je skopírovaný.' : ''}
            {copyState === 'error' ? 'Odkaz sa nepodarilo skopírovať.' : ''}
          </p>
        </div>
      </Container>
    </Section>
  );
}
