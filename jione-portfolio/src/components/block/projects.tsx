'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 1rem;
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const Intro = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 3rem;
  max-width: 48rem;
`;

const CaseCard = styled(motion.div)<{ $hasImages: boolean }>`
  background-color: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.radius.xl};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.border};

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

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const CardCompany = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 0.75rem;
`;

const CardLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  padding: 0.25rem 0.625rem;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.muted};
    border-color: ${(props) => props.theme.colors.primary};
  }
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
  cursor: pointer;

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 200px;
`;

const SliderTrack = styled.div<{ $index: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${({ $index }) => -$index * 100}%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  min-height: 200px;
  background-color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const SlideNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.15s ease;

  &:hover { background-color: rgba(0, 0, 0, 0.7); }
  &[data-dir='prev'] { left: 0.5rem; }
  &[data-dir='next'] { right: 0.5rem; }
`;

const SliderDots = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.375rem;
  z-index: 10;
`;

const SliderDot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)'};
  transition: background-color 0.15s ease;
`;

const ImgFallback = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    ${(props) => props.theme.colors.muted},
    ${(props) => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgFallbackLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mutedForeground};
  opacity: 0.7;
  text-align: center;
  padding: 1rem;
`;

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); }`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  cursor: pointer;
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
  font-size: 24px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  &:hover { color: #ffffff; }
`;

const ModalSlider = styled.div`
  position: relative;
`;

const ModalImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
`;

const ModalNavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.55);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 28px;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }
  &[data-dir='prev'] { left: 0.75rem; }
  &[data-dir='next'] { right: 0.75rem; }
`;

const ModalDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
`;

const ModalDot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'};
  transition: background-color 0.15s ease;
`;

const ModalCaption = styled.p`
  margin-top: 0.625rem;
  text-align: center;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.01em;
`;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

interface ModalState {
  images: string[];
  index: number;
  title: string;
}

interface ProjectUrl {
  label: string;
  href: string;
}

export interface ProjectCase {
  id: string;
  title: string;
  company?: string;
  description?: string;
  execution: string;
  tools?: string;
  year?: string;
  urls?: ProjectUrl[];
  images: string[];
}

interface ProjectsSectionProps {
  intro: string;
  cases: ProjectCase[];
}

export function ProjectsSection({ intro, cases }: ProjectsSectionProps) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const closeModal = useCallback(() => setModal(null), []);
  const getIdx = (id: string) => slideIndices[id] ?? 0;
  const markErr = (key: string) => setImgErrors((prev) => ({ ...prev, [key]: true }));
  const hasErr = (key: string) => imgErrors[key] ?? false;

  const goSlide = useCallback((id: string, total: number, dir: 1 | -1) => {
    setSlideIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + dir + total) % total,
    }));
  }, []);

  const goModal = useCallback((dir: 1 | -1) => {
    setModal((prev) => {
      if (!prev) return prev;
      return { ...prev, index: (prev.index + dir + prev.images.length) % prev.images.length };
    });
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goModal(-1);
      if (e.key === 'ArrowRight') goModal(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modal, closeModal, goModal]);

  return (
    <>
      <Section id="projects">
        <Container>
          <SectionTitle>프로젝트</SectionTitle>
          <Intro>{intro}</Intro>
          {cases.map((c, i) => {
            const images = c.images ?? [];
            return (
              <CaseCard
                key={c.id}
                $hasImages={images.length > 0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <CardBody>
                  <CardTitle>{c.title}</CardTitle>
                  {c.company && <CardCompany>{c.company}</CardCompany>}
                  {c.description && <CardDescription>{c.description}</CardDescription>}
                  <CardDescription>{c.execution}</CardDescription>
                  {c.tools && (
                    <CardDescription style={{ fontSize: '0.8125rem' }}>Tools: {c.tools}</CardDescription>
                  )}
                  {c.urls && c.urls.length > 0 && (
                    <CardLinks>
                      {c.urls.map((u) => (
                        <CardLink key={u.href} href={u.href} target="_blank" rel="noopener noreferrer">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                          {u.label}
                        </CardLink>
                      ))}
                    </CardLinks>
                  )}
                </CardBody>

                {images.length === 1 && (
                  <ImageSide>
                    <ImageWrapper onClick={() => !hasErr(`${c.id}_0`) && setModal({ images, index: 0, title: c.title })}>
                      {hasErr(`${c.id}_0`) ? (
                        <ImgFallback><ImgFallbackLabel>{c.title}</ImgFallbackLabel></ImgFallback>
                      ) : (
                        <Image src={images[0]} alt={c.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 45vw" onError={() => markErr(`${c.id}_0`)} />
                      )}
                    </ImageWrapper>
                  </ImageSide>
                )}

                {images.length >= 2 && (
                  <ImageSide>
                    <SliderContainer>
                      <SliderTrack $index={getIdx(c.id)}>
                        {images.map((src, idx) => (
                          <Slide key={src} onClick={() => !hasErr(`${c.id}_${idx}`) && setModal({ images, index: idx, title: c.title })}>
                            {hasErr(`${c.id}_${idx}`) ? (
                              <ImgFallback><ImgFallbackLabel>{c.title}</ImgFallbackLabel></ImgFallback>
                            ) : (
                              <Image src={src} alt={`${c.title} ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 45vw" onError={() => markErr(`${c.id}_${idx}`)} />
                            )}
                          </Slide>
                        ))}
                      </SliderTrack>
                      <SlideNavButton data-dir="prev" onClick={(e) => { e.stopPropagation(); goSlide(c.id, images.length, -1); }} aria-label="이전"><span className="material-symbols-outlined">chevron_left</span></SlideNavButton>
                      <SlideNavButton data-dir="next" onClick={(e) => { e.stopPropagation(); goSlide(c.id, images.length, 1); }} aria-label="다음"><span className="material-symbols-outlined">chevron_right</span></SlideNavButton>
                      <SliderDots>
                        {images.map((_, idx) => (
                          <SliderDot key={idx} $active={getIdx(c.id) === idx} onClick={(e) => { e.stopPropagation(); setSlideIndices((prev) => ({ ...prev, [c.id]: idx })); }} />
                        ))}
                      </SliderDots>
                    </SliderContainer>
                  </ImageSide>
                )}
              </CaseCard>
            );
          })}
        </Container>
      </Section>

      {modal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}><span className="material-symbols-outlined">close</span></CloseButton>
            <ModalSlider>
              <ModalImageWrapper>
                <Image
                  src={modal.images[modal.index]}
                  alt={`${modal.title} ${modal.index + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="min(90vw, 960px)"
                  priority
                />
              </ModalImageWrapper>
              {modal.images.length > 1 && (
                <>
                  <ModalNavBtn data-dir="prev" onClick={() => goModal(-1)} aria-label="이전"><span className="material-symbols-outlined">chevron_left</span></ModalNavBtn>
                  <ModalNavBtn data-dir="next" onClick={() => goModal(1)} aria-label="다음"><span className="material-symbols-outlined">chevron_right</span></ModalNavBtn>
                </>
              )}
            </ModalSlider>
            {modal.images.length > 1 && (
              <ModalDots>
                {modal.images.map((_, idx) => (
                  <ModalDot
                    key={idx}
                    $active={modal.index === idx}
                    onClick={() => setModal((prev) => prev ? { ...prev, index: idx } : prev)}
                    aria-label={`${idx + 1}번째 이미지`}
                  />
                ))}
              </ModalDots>
            )}
            <ModalCaption>
              {modal.images[modal.index].split('/').pop()?.replace(/\.[^.]+$/, '') ?? modal.title}
            </ModalCaption>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
