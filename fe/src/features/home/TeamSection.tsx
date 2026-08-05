import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';

export function TeamSection() {
  const { team } = siteContent;

  return (
    <section aria-labelledby="team-title" className="team-section" id="tim">
      <Container>
        <h2 className="team-section__title" id="team-title">
          {team.title} <span aria-hidden="true">↓</span>
        </h2>
        <ul className="team-roster">
          {team.roster.map((member) => (
            <li key={member.role}>
              <span className="team-roster__role">{member.role}</span>
              <strong>{member.name}</strong>
              {member.note ? <small>{member.note}</small> : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
