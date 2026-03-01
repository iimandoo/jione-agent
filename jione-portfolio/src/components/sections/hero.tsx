'use client';

import styled from 'styled-components';
import { resume } from '@/data/resume';

const Section = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
`;

const Inner = styled.div`
  max-width: 48rem;
  width: 100%;
  text-align: center;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${(props) => props.theme.radius.xl};
  margin-bottom: 1.5rem;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 2rem;
`;

const Bio = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.a`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryForeground};
  padding: 0.75rem 1.75rem;
  border-radius: ${(props) => props.theme.radius.md};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const SecondaryButton = styled.a`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.foreground};
  padding: 0.75rem 1.75rem;
  border-radius: ${(props) => props.theme.radius.md};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.border};
    transform: translateY(-2px);
  }
`;

export function HeroSection() {
  const { profile } = resume;

  return (
    <Section id="hero">
      <Inner>
        {profile.availability.status === 'open' && (
          <Badge>🟢 {profile.availability.message}</Badge>
        )}
        <Name>{profile.name}</Name>
        <Title>{profile.title}</Title>
        <Subtitle>{profile.subtitle}</Subtitle>
        <Location>📍 {profile.location}</Location>
        <Bio>{profile.bio}</Bio>
        <ButtonGroup>
          <PrimaryButton href={`mailto:${profile.email}`}>
            ✉️ 이메일 보내기
          </PrimaryButton>
          <SecondaryButton
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </SecondaryButton>
          {profile.social.linkedin && (
            <SecondaryButton
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </SecondaryButton>
          )}
        </ButtonGroup>
      </Inner>
    </Section>
  );
}
