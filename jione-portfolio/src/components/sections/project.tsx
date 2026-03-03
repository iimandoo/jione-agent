'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
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

const Intro = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 3.5rem;
  max-width: 48rem;
`;

const CaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const CaseCard = styled.div<{ $hasImages: boolean }>`
  background-color: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.radius.xl};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: ${({ $hasImages }) => ($hasImages ? 'row' : 'column')};
  }

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const CardBody = styled.div`
  padding: 2rem;
  flex: 1;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
`;

const CompanyTag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.2rem 0.625rem;
  border-radius: ${(props) => props.theme.radius.sm};
`;

const CaseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
`;

const ProjectText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 0.625rem;
`;

const ExecutionText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.625rem;
`;

const ToolsText = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  font-style: italic;
`;

const ImageSide = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(props) => props.theme.colors.border};

  @media (min-width: 768px) {
    border-top: none;
    border-left: 1px solid ${(props) => props.theme.colors.border};
    flex: 0 0 45%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 200px;
  background-color: ${(props) => props.theme.colors.secondary};
  cursor: zoom-in;

  & + & {
    border-top: 1px solid ${(props) => props.theme.colors.border};
  }

  &:hover::after {
    content: '🔍';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.25);
    font-size: 2rem;
  }
`;

// ─── 모달 ──────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  cursor: zoom-out;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: min(90vw, 960px);
  width: 100%;
  cursor: default;
  animation: ${scaleIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -2.75rem;
  right: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.75rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ModalImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
`;

// ─── 컴포넌트 ──────────────────────────────────────────────────────

interface ModalState {
  src: string;
  alt: string;
}

export function ProjectSection() {
  const { Project } = resume;
  const [modal, setModal] = useState<ModalState | null>(null);

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modal, closeModal]);

  return (
    <>
      <Section id="Project">
        <Container>
          <SectionLabel>Project</SectionLabel>
          <SectionTitle>프로젝트</SectionTitle>
          <Intro>{Project.intro}</Intro>
          <CaseList>
            {Project.cases.map((c) => {
              const images = 'images' in c ? (c.images as readonly string[]) : [];
              return (
                <CaseCard key={c.id} $hasImages={images.length > 0}>
                  <CardBody>
                    <CardMeta>
                      <CompanyTag>{c.company}</CompanyTag>
                    </CardMeta>
                    <CaseTitle>{c.title}</CaseTitle>
                    <ProjectText>{c.Project}</ProjectText>
                    <ExecutionText>{c.execution}</ExecutionText>
                    {'tools' in c && c.tools && <ToolsText>Tools: {c.tools}</ToolsText>}
                  </CardBody>
                  {images.length > 0 && (
                    <ImageSide>
                      {images.map((src) => (
                        <ImageWrapper
                          key={src}
                          onClick={() => setModal({ src, alt: c.title })}
                          role="button"
                          aria-label={`${c.title} 이미지 크게 보기`}
                        >
                          <Image
                            src={src}
                            alt={c.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 45vw"
                          />
                        </ImageWrapper>
                      ))}
                    </ImageSide>
                  )}
                </CaseCard>
              );
            })}
          </CaseList>
        </Container>
      </Section>

      {modal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal} aria-label="닫기">
              ×
            </CloseButton>
            <ModalImageWrapper>
              <Image
                src={modal.src}
                alt={modal.alt}
                fill
                style={{ objectFit: 'contain' }}
                sizes="min(90vw, 960px)"
                priority
              />
            </ModalImageWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
