'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { motion, type Variants } from 'framer-motion';

// ─── Section layout ───────────────────────────────────────────────

const Section = styled.section`
  padding: 4rem 0;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
`;

const SectionInner = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.foreground};
  }
`;

// ─── Card slider ──────────────────────────────────────────────────

const SliderViewport = styled.div`
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar { display: none; }
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 1.5rem;
  width: max-content;
`;

const Card = styled(motion.div)`
  flex: 0 0 400px;
  scroll-snap-align: start;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.xl};
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-3px);
  }
`;

// ─── Card image area ──────────────────────────────────────────────

const CardImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.muted};
  cursor: pointer;
`;

const CardImagePlaceholder = styled.div`
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg,
    ${(props) => props.theme.colors.muted},
    ${(props) => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mutedForeground};
  opacity: 0.6;
  text-align: center;
  padding: 1rem;
`;

const ImageDots = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  z-index: 2;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => (props.$active ? '#fff' : 'rgba(255,255,255,0.45)')};
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
`;

// ─── Card content ─────────────────────────────────────────────────

const CardContent = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: ${(props) => props.theme.colors.badge ?? props.theme.colors.primary};
  color: ${(props) => props.theme.colors.badgeForeground ?? props.theme.colors.primaryForeground};
  padding: 0.2rem 0.6rem;
  border-radius: ${(props) => props.theme.radius.xl};
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const CardDate = styled.span`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
`;

const CardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  line-height: 1.4;
  margin-bottom: 0.875rem;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.2rem 0.5rem;
  border-radius: ${(props) => props.theme.radius.sm};

  &::before { content: '#'; }
`;

const CardLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.75rem;
`;

const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  padding: 0.2rem 0.5rem;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.muted};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

// ─── Modal ────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────

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
  year?: string;
  execution: string;
  images: string[];
  urls?: ProjectUrl[];
}

interface CardSliderProps {
  cases: ProjectCase[];
}

// ─── Sub-component: card image with dots ──────────────────────────

function ProjectImageSlider({
  images,
  title,
  onOpen,
}: {
  images: string[];
  title: string;
  onOpen: (index: number) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (images.length === 0 || imgError) {
    return (
      <CardImagePlaceholder>
        <PlaceholderLabel>{title}</PlaceholderLabel>
      </CardImagePlaceholder>
    );
  }

  return (
    <CardImageArea onClick={() => onOpen(activeIdx)}>
      <Image
        key={images[activeIdx]}
        src={images[activeIdx]}
        alt={`${title} ${activeIdx + 1}`}
        fill
        style={{ objectFit: 'cover' }}
        sizes="400px"
        onError={() => setImgError(true)}
      />
      {images.length > 1 && (
        <ImageDots>
          {images.map((_, i) => (
            <Dot
              key={i}
              $active={i === activeIdx}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
              aria-label={`이미지 ${i + 1}`}
            />
          ))}
        </ImageDots>
      )}
    </CardImageArea>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatYear(dateStr: string) {
  return dateStr === 'present' ? new Date().getFullYear().toString() : dateStr.slice(0, 4);
}

// ─── Variants ─────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
};

// ─── Main component ───────────────────────────────────────────────

export function CardSlider({ cases }: CardSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const closeModal = useCallback(() => setModal(null), []);

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

  const scroll = (dir: -1 | 1) => {
    viewportRef.current?.scrollBy({ left: dir * 424, behavior: 'smooth' });
  };

  return (
    <>
      <Section id="projects">
        <SectionInner>
          <Header>
            <SectionTitle>프로젝트</SectionTitle>
            <NavButtons>
              <NavBtn onClick={() => scroll(-1)} aria-label="이전"><span className="material-symbols-outlined">chevron_left</span></NavBtn>
              <NavBtn onClick={() => scroll(1)} aria-label="다음"><span className="material-symbols-outlined">chevron_right</span></NavBtn>
            </NavButtons>
          </Header>

          <SliderViewport ref={viewportRef}>
            <SliderTrack>
              {cases.map((c, i) => {
                const images = c.images ?? [];
                const tags = (c.execution ?? '').split(/[,/·]/).map((t) => t.trim()).filter(Boolean).slice(0, 4);
                return (
                  <Card
                    key={c.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <ProjectImageSlider
                      images={images}
                      title={c.title}
                      onOpen={(idx) => setModal({ images, index: idx, title: c.title })}
                    />
                    <CardContent>
                      <CardBadge>프로젝트</CardBadge>
                      <CardMeta>
                        <CardDate>{c.year ? formatYear(c.year) : '2024'}</CardDate>
                      </CardMeta>
                      <CardTitle>{c.title}</CardTitle>
                      <CardTags>
                        {tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </CardTags>
                      {c.urls && c.urls.length > 0 && (
                        <CardLinks>
                          {c.urls.map((u) => (
                            <CardLink key={u.href} href={u.href} target="_blank" rel="noopener noreferrer">
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                              {u.label}
                            </CardLink>
                          ))}
                        </CardLinks>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </SliderTrack>
          </SliderViewport>
        </SectionInner>
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
