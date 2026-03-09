'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const NavBar = styled.nav<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${(props) => props.theme.colors.nav ?? props.theme.colors.foreground};
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: box-shadow 0.2s ease;
  box-shadow: ${({ $scrolled }) => $scrolled ? '0 2px 12px rgba(0,0,0,0.15)' : 'none'};
`;

const NavLogo = styled.span`
  font-size: 1.125rem;
  font-weight: 900;
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: -0.02em;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => $active ? 700 : 500};
  color: ${(props) => props.$active
    ? props.theme.colors.foreground
    : (props.theme.colors.navForeground ?? '#FFFFFF')};
  background-color: ${(props) => props.$active ? props.theme.colors.primary : 'transparent'};
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${(props) => props.$active
      ? props.theme.colors.primary
      : 'rgba(255,255,255,0.1)'};
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavIconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.navForeground ?? '#FFFFFF'};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 1.1rem;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
`;

const NAV_ITEMS = [
  { label: '소개', href: '#hero' },
  { label: '프로젝트', href: '#projects' },
  { label: '경력', href: '#career' },
  { label: '스킬', href: '#skills' },
  { label: '연락처', href: '#contact' },
];

interface GNBProps {
  name: string;
  github: string;
  email: string;
}

export function GNB({ name, github, email }: GNBProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <NavBar $scrolled={scrolled}>
      <NavLogo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {name.split(' ')[0].toLowerCase()}
      </NavLogo>

      <NavLinks>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            $active={active === item.href}
            onClick={() => setActive(item.href)}
          >
            {item.label}
          </NavLink>
        ))}
      </NavLinks>

      <NavIcons>
        <NavIconButton aria-label="GitHub" onClick={() => window.open(github, '_blank')}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>code</span>
        </NavIconButton>
        <NavIconButton aria-label="이메일" onClick={() => { window.location.href = `mailto:${email}`; }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>mail</span>
        </NavIconButton>
      </NavIcons>
    </NavBar>
  );
}
