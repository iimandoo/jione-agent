'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const CareerSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${(props) => props.theme.colors.muted};
`;

const SkillsSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const BlockTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 2rem;
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const CareerGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CareerCard = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.xl};
  padding: 1.5rem;
`;

const Company = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

const Position = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Period = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.secondaryForeground};
`;

const SkillsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SkillBlock = styled.div``;

const CategoryLabel = styled.h4`
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span<{ $level: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: ${(props) => props.theme.radius.xl};
  font-size: 0.8125rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.$level === 'expert'
      ? props.theme.colors.primary
      : props.theme.colors.secondary};
  color: ${(props) =>
    props.$level === 'expert'
      ? props.theme.colors.primaryForeground
      : props.theme.colors.secondaryForeground};
`;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: 'easeOut' },
  }),
};

interface Experience {
  id: string;
  company: string;
  position: string;
  period: { start: string; end: string };
  description: string;
}

interface SkillCategory {
  name: string;
  skills: { name: string; level: string }[];
}

interface CareerProps {
  experiences: Experience[];
  skillCategories: SkillCategory[];
}

export function Career({ experiences, skillCategories }: CareerProps) {
  return (
    <>
      <CareerSection id="career">
        <Container>
          <BlockTitle>경력</BlockTitle>
          <CareerGrid>
            {experiences.map((exp, i) => (
              <CareerCard
                key={exp.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Company>{exp.company}</Company>
                <Position>{exp.position}</Position>
                <Period>{exp.period.start} ~ {exp.period.end === 'present' ? '현재' : exp.period.end}</Period>
                <Description>{exp.description}</Description>
              </CareerCard>
            ))}
          </CareerGrid>
        </Container>
      </CareerSection>

      <SkillsSection id="skills">
        <Container>
          <BlockTitle>스킬</BlockTitle>
          <SkillsGrid>
            {skillCategories.map((cat, i) => (
              <SkillBlock
                key={cat.name}
                as={motion.div}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <CategoryLabel>{cat.name}</CategoryLabel>
                <TagRow>
                  {cat.skills.map((skill) => (
                    <SkillTag key={skill.name} $level={skill.level}>{skill.name}</SkillTag>
                  ))}
                </TagRow>
              </SkillBlock>
            ))}
          </SkillsGrid>
        </Container>
      </SkillsSection>
    </>
  );
}
