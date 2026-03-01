import styled from 'styled-components';

export const H1 = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.colors.foreground};
`;

export const H2 = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.colors.foreground};
`;

export const H3 = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(props) => props.theme.colors.foreground};
`;

export const Body = styled.p`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.foreground};
`;

export const Small = styled.small`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.mutedForeground};
`;

export const SectionContainer = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  width: 100%;
`;
