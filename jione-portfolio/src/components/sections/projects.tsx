'use client';

import styled from 'styled-components';
import { resume } from '@/data/resume';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.background};

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
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.radius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-4px);
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const Company = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.2rem 0.5rem;
  border-radius: ${(props) => props.theme.radius.sm};
`;

const Period = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  white-space: nowrap;
`;

const ProjectTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const Role = styled.p`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

const ImpactList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
`;

const ImpactItem = styled.li`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  padding-left: 1.25rem;
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
  }
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.secondaryForeground};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.2rem 0.5rem;
  border-radius: ${(props) => props.theme.radius.sm};
`;

const CardFooter = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const LinkButton = styled.a`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: ${(props) => props.theme.radius.sm};
  border: 1px solid ${(props) => props.theme.colors.primary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primaryForeground};
  }
`;

export function ProjectsSection() {
  const { projects } = resume;

  return (
    <Section id="projects">
      <Container>
        <SectionLabel>Projects</SectionLabel>
        <SectionTitle>주요 프로젝트</SectionTitle>
        <Grid>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardBody>
                <ProjectMeta>
                  <Company>{project.company}</Company>
                  <Period>
                    {project.period.start} ~{' '}
                    {project.period.end === 'present' ? '현재' : project.period.end}
                  </Period>
                </ProjectMeta>
                <ProjectTitle>{project.title}</ProjectTitle>
                <Role>{project.role}</Role>
                <Description>{project.description}</Description>
                <ImpactList>
                  {project.impact.map((item, i) => (
                    <ImpactItem key={i}>{item}</ImpactItem>
                  ))}
                </ImpactList>
                <TechTags>
                  {project.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </TechTags>
              </CardBody>
              {'link' in project || 'github' in project ? (
                <CardFooter>
                  {'link' in project && project.link && (
                    <LinkButton
                      href={project.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live
                    </LinkButton>
                  )}
                  {'github' in project && project.github && (
                    <LinkButton
                      href={project.github as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </LinkButton>
                  )}
                </CardFooter>
              ) : null}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
