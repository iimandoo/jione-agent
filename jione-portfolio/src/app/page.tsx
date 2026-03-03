'use client';

import styled from 'styled-components';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ContactSection } from '@/components/sections/contact';
import { ProjectSection } from '@/components/sections/project';

const MainContainer = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function Home() {
  return (
    <MainContainer>
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </MainContainer>
  );
}
