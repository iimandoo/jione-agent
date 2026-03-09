'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const HeroWrapper = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg,
    ${(props) => props.theme.colors.muted},
    ${(props) => props.theme.colors.background}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const HeroInner = styled.div`
  text-align: center;
  max-width: 48rem;
`;

const RoleLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.h1.fontSize};
  font-weight: ${(props) => props.theme.typography.h1.fontWeight};
  letter-spacing: ${(props) => props.theme.typography.h1.letterSpacing ?? '-0.02em'};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const HeroBio = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  line-height: 1.7;
  max-width: 36rem;
  margin: 0 auto 2rem;
`;

const ScrollIndicator = styled(motion.div)`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  font-size: 0.75rem;
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface HeroSectionProps {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
}

export function HeroSection({ name, title, subtitle, bio }: HeroSectionProps) {
  return (
    <HeroWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroInner>
          <motion.div variants={itemVariants}>
            <RoleLabel>{title}</RoleLabel>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroTitle>{name}</HeroTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroSubtitle>{subtitle}</HeroSubtitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroBio>{bio}</HeroBio>
          </motion.div>
          <ScrollIndicator
            variants={itemVariants}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>expand_more</span>
          </ScrollIndicator>
        </HeroInner>
      </motion.div>
    </HeroWrapper>
  );
}
