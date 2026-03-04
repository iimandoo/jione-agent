import type { Metadata } from 'next';
import '@/styles/globals.css';
import { StyleProvider } from '@/styles/provider';
import { resume } from '@/data/resume';

export const metadata: Metadata = {
  title: `${resume.profile.name} 포트폴리오`,
  description: resume.meta.siteDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
        {/* Google Fonts for Material Symbols: used for icons and any cursor-related glyphs */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyleProvider>{children}</StyleProvider>
      </body>
    </html>
  );
}
