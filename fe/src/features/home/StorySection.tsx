import { Container, Section, SectionHeading } from '../../components/ui';
import { siteContent } from '../../config/content';
import { ContentImageView, ContentLinkView } from './ContentMedia';

export function StorySection() {
  const { story } = siteContent;

  return (
    <Section aria-labelledby="story-title" className="story-section" id="pribeh">
      <Container>
        <SectionHeading
          annotation={story.annotation}
          eyebrow={story.eyebrow}
          id="story-title"
          title={story.title}
        />

        <ol className="story-timeline">
          {story.milestones.map((milestone, index) => (
            <li className={`story-milestone story-milestone--${(index % 4) + 1}`} key={milestone.id}>
              <span className="story-milestone__tag">{milestone.tag}</span>
              <p>{milestone.text}</p>
              <ContentImageView className="story-milestone__photo" image={milestone.photo} />
            </li>
          ))}
        </ol>

        <ContentLinkView className="story-section__interview text-link" link={story.interview} />
      </Container>
    </Section>
  );
}
