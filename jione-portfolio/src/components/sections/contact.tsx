'use client';

import styled from 'styled-components';
import { resume } from '@/data/resume';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.muted};
  text-align: center;

  @media (min-width: 768px) {
    padding: 7rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 40rem;
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

const Description = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 2.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const PrimaryButton = styled.a`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryForeground};
  padding: 0.875rem 2rem;
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
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.foreground};
  padding: 0.875rem 2rem;
  border-radius: ${(props) => props.theme.radius.md};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.foreground};
`;

export function ContactSection() {
  const { profile } = resume;

  return (
    <Section id="contact">
      <Container>
        <SectionLabel>Contact</SectionLabel>
        <SectionTitle>함께 만들어요</SectionTitle>
        <Description>
          새로운 프로젝트, 협업, 또는 그냥 인사라도 환영합니다.
          <br />
          편하게 연락 주세요.
        </Description>
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
        <Divider />
        <InfoRow>
          <InfoItem>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>{profile.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>위치</InfoLabel>
            <InfoValue>{profile.location}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>상태</InfoLabel>
            <InfoValue>
              {profile.availability.status === 'open' ? '🟢 ' : '🔴 '}
              {profile.availability.message}
            </InfoValue>
          </InfoItem>
        </InfoRow>
      </Container>
    </Section>
  );
}
