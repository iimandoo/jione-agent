'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const HeroSection = styled.section`
  padding: 6rem 2rem 5rem;
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const Eyebrow = styled(motion.span)`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryForeground};
  padding: 0.3rem 0.875rem;
  border-radius: ${(props) => props.theme.radius.xl};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  max-width: 36rem;
`;

const HeroDesc = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.75;
  color: ${(props) => props.theme.colors.mutedForeground};
  max-width: 32rem;
  margin-bottom: 2.5rem;
`;

const HeroMeta = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.mutedForeground};
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface HeroProps {
  title: string;
  name: string;
  subtitle: string;
  location?: string;
  availability?: string;
}

export function Hero({ title, name, subtitle, location, availability }: HeroProps) {
  return (
    <HeroSection id="hero">
      <Container>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Eyebrow variants={itemVariants}>{title}</Eyebrow>
          <HeroTitle variants={itemVariants}>{name}</HeroTitle>
          <HeroDesc variants={itemVariants}>{subtitle}</HeroDesc>
          <HeroMeta variants={itemVariants}>
            {location && (
              <MetaChip>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>location_on</span>
                {location}
              </MetaChip>
            )}
            {availability && (
              <MetaChip>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>work</span>
                {availability}
              </MetaChip>
            )}
          </HeroMeta>
        </motion.div>
      </Container>
    </HeroSection>
  );
}
