'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const AboutWrapper = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.muted};
`;

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 3rem;
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const Grid = styled.div`
  display: grid;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  margin-top: 0.35rem;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

const Position = styled.p`
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 0.5rem;
`;

const Period = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const SkillCategoryTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;

  &:first-child {
    margin-top: 0;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span<{ $level: string }>`
  padding: 0.3rem 0.75rem;
  border-radius: ${(props) => props.theme.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.$level === 'expert'
      ? props.theme.colors.primary
      : props.$level === 'advanced'
      ? props.theme.colors.secondary
      : props.theme.colors.muted};
  color: ${(props) =>
    props.$level === 'expert'
      ? props.theme.colors.primaryForeground
      : props.theme.colors.secondaryForeground};
`;

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

interface AboutSectionProps {
  experiences: Experience[];
  skillCategories: SkillCategory[];
}

export function AboutSection({ experiences, skillCategories }: AboutSectionProps) {
  return (
    <AboutWrapper id="about">
      <Container>
        <SectionTitle>경력 & 스킬</SectionTitle>
        <Grid>
          <div>
            {experiences.map((exp, i) => (
              <TimelineItem
                key={exp.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <TimelineDot />
                <TimelineContent>
                  <CompanyName>{exp.company}</CompanyName>
                  <Position>{exp.position}</Position>
                  <Period>{exp.period.start} ~ {exp.period.end === 'present' ? '현재' : exp.period.end}</Period>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{exp.description}</p>
                </TimelineContent>
              </TimelineItem>
            ))}
          </div>

          <div>
            {skillCategories.map((category) => (
              <div key={category.name}>
                <SkillCategoryTitle>{category.name}</SkillCategoryTitle>
                <SkillTags>
                  {category.skills.map((skill) => (
                    <SkillTag key={skill.name} $level={skill.level}>{skill.name}</SkillTag>
                  ))}
                </SkillTags>
              </div>
            ))}
          </div>
        </Grid>
      </Container>
    </AboutWrapper>
  );
}
