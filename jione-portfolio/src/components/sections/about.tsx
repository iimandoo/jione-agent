'use client';

import styled from 'styled-components';
import { resume } from '@/data/resume';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.muted};

  @media (min-width: 768px) {
    padding: 7rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const SectionLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 1rem;
`;

const Summary = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 3rem;
  max-width: 48rem;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.card};
  padding: 1.75rem;
  border-radius: ${(props) => props.theme.radius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const Company = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
`;

const Period = styled.span`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  white-space: nowrap;
`;

const Position = styled.p`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Highlights = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const Highlight = styled.li`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  padding-left: 1.25rem;
  position: relative;

  &::before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.secondaryForeground};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.25rem 0.625rem;
  border-radius: ${(props) => props.theme.radius.sm};
`;

export function AboutSection() {
  const { career } = resume;

  return (
    <Section id="about">
      <Container>
        <SectionLabel>Career</SectionLabel>
        <SectionTitle>경력</SectionTitle>
        <Summary>{career.summary}</Summary>
        <Timeline>
          {career.experiences.map((exp) => (
            <Card key={exp.id}>
              <CardHeader>
                <Company>{exp.company}</Company>
                <Period>{exp.period.start} ~ {exp.period.end === 'present' ? '현재' : exp.period.end}</Period>
              </CardHeader>
              <Position>{exp.position}</Position>
              <Description>{exp.description}</Description>
              <Highlights>
                {exp.highlights.map((h, i) => (
                  <Highlight key={i}>{h}</Highlight>
                ))}
              </Highlights>
              <SkillTags>
                {exp.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </SkillTags>
            </Card>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
}
