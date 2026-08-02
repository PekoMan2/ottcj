import { Camera, Truck, UserRound, UsersRound } from 'lucide-react';
import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentImageView } from './ContentMedia';

const teamIcons = {
  'camera-operator': Camera,
  'iontmax-van': Truck,
  'michal-sula': UserRound,
  'support-crew': UsersRound,
} as const;

export function TeamSection() {
  const { team } = siteContent;

  return (
    <Section aria-labelledby="team-title" className="team-section" id="tim">
      <Container>
        <SectionHeading
          annotation={team.annotation}
          eyebrow={team.eyebrow}
          id="team-title"
          title={team.title}
        />

        <div className="team-grid">
          {team.members.map((member, index) => {
            const Icon = teamIcons[member.id as keyof typeof teamIcons] ?? UserRound;

            return (
              <article className={`team-card team-card--${index + 1}`} key={member.id}>
                <ContentImageView image={member.image} />
                <div className="team-card__body">
                  <Icon aria-hidden="true" className="team-card__icon" />
                  <p className="team-card__role">{member.role}</p>
                  <h3>{member.name}</h3>
                  <p>{member.description}</p>
                  {member.statusLabel ? <small>{member.statusLabel}</small> : null}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
