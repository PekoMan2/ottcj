import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { supportingContent } from '../../config/supportingContent';
import { PageIntro } from './PageIntro';

type CopyState = 'idle' | 'copied' | 'error';

export function ThankYouPage() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const content = supportingContent.thankYou;
  const shareUrl = new URL('/', window.location.origin).toString();
  const shareFunction = (navigator as unknown as {
    share?: (data: ShareData) => Promise<void>;
  }).share;

  const share = async () => {
    if (!shareFunction) return;
    try {
      await shareFunction.call(navigator, { text: content.shareText, title: content.shareTitle, url: shareUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <PageIntro annotation="ďakujeme za každý bezpečne zverejnený prísľub" eyebrow={content.eyebrow} title={content.title}>
      <p>{content.body}</p>
      <div className="share-actions">
        {shareFunction ? <button className="sticker-button" onClick={share} type="button"><Share2 aria-hidden="true" /> zdieľať</button> : null}
        <button className="sticker-button sticker-button--dark" onClick={copy} type="button">{copyState === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} kopírovať odkaz</button>
        <Link className="text-link" to="/">späť na domovskú stránku</Link>
      </div>
      <label className="share-url"><span>Odkaz na výzvu</span><input readOnly value={shareUrl} /></label>
      <p aria-live="polite" className="share-feedback">{copyState === 'copied' ? 'Odkaz je skopírovaný.' : copyState === 'error' ? 'Odkaz sa nepodarilo skopírovať. Môžeš ho označiť v poli vyššie.' : ''}</p>
    </PageIntro>
  );
}
