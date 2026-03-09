'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

const ContactWrapper = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.muted};
`;

const Container = styled.div`
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 1rem;
`;

const SectionDesc = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const ContactInfoItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.foreground};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const GitHubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryForeground};
  border-radius: ${(props) => props.theme.radius.md};
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }
`;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

interface ContactSectionProps {
  email: string;
  phone?: string;
  github?: string;
}

export function ContactSection({ email, phone, github }: ContactSectionProps) {
  return (
    <ContactWrapper id="contact">
      <Container>
        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle>연락하기</SectionTitle>
          <SectionDesc>함께 만들어갈 프로젝트가 있다면 편하게 연락 주세요.</SectionDesc>
          <ContactInfoList>
            <ContactInfoItem href={`mailto:${email}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>mail</span>
              {email}
            </ContactInfoItem>
            {phone && (
              <ContactInfoItem href={`tel:${phone}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>call</span>
                {phone}
              </ContactInfoItem>
            )}
          </ContactInfoList>
          {github && (
            <GitHubLink href={github} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>open_in_new</span>
              GitHub
            </GitHubLink>
          )}
        </motion.div>
      </Container>
    </ContactWrapper>
  );
}
