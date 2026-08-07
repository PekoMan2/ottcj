import { Link } from 'react-router';
import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import { DonioCta } from '../donio/DonioCta';
import { DonioProgress } from '../donio/DonioProgress';
import { HeartDoodle } from './Doodles';

export function CharitySection() {
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
          <Link className="vily-card__tag" to="/vily">{charity.story.tag}</Link>
          <HeartDoodle className="vily-card__heart" />
          <div className="vily-card__copy">
            <p>{charity.story.introduction}</p>
            <p className="vily-card__accent">{charity.story.accent}</p>
          </div>
        </article>

        <div className="donio-actions" id="prispevok">
          <p className="donio-actions__lead">{charity.ctaLead}</p>
          <DonioCta size="big" />
          <p className="donio-actions__note">
            ↳ prispievaš priamo na{' '}
            <a href={charity.campaign.destinationUrl} rel="noreferrer" target="_blank">
              {charity.campaign.destinationLabel}
            </a>
            . žiadny medzičlánok.
          </p>
        </div>

        <DonioProgress />

        <div className="bet-box">
          <span className="bet-box__label">{charity.bet.label}</span>
          <p>
            {charity.bet.finishLead}{' '}
            <strong className="bet-box__code">({charity.bet.finishCode})</strong>.{' '}
            {charity.bet.finishOutro}
          </p>
          <p>
            {charity.bet.dnfLead}{' '}
            <strong className="bet-box__code">({charity.bet.dnfCode})</strong>{' '}
            {charity.bet.dnfOutro}
          </p>
          <p className="bet-box__hint">{charity.bet.hint}</p>
        </div>
      </Container>
    </section>
  );
}
