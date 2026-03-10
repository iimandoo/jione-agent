'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  STYLES,
  TONES,
  getSelection,
  setSelection,
  type Style,
  type Tone,
} from '@/lib/portfolio-selection';

const TONE_COLORS: Record<Tone, { primary: string; bg: string; fg: string }> = {
  toss: { primary: '#3182F6', bg: '#F2F4F6', fg: '#ffffff' },
  minimal: { primary: '#111111', bg: '#FAFAFA', fg: '#ffffff' },
  dark: { primary: '#60A5FA', bg: '#0F172A', fg: '#ffffff' },
  kakao: { primary: '#FEE500', bg: '#F7F2E8', fg: '#1A1A1A' },
};

const STYLE_DESC: Record<Style, string> = {
  block: '카드 기반 섹션 -- Hero -> About -> Projects -> Contact',
  corporate: 'GNB + 대형 Hero + 카드 슬라이더 -- 기업 사이트 스타일',
};

export default function ChoicePage() {
  const router = useRouter();
  const [current, setCurrent] = useState<{ style: Style; tone: Tone } | null>(null);

  useEffect(() => {
    setCurrent(getSelection());
  }, []);

  const handleSelect = (style: Style, tone: Tone) => {
    setSelection(style, tone);
    router.push('/');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '2rem',
        fontFamily: 'Pretendard Variable, sans-serif',
        background: '#f8f9fa',
        padding: '3rem 2rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
        포트폴리오 스타일 선택
      </h1>
      <p style={{ color: '#888', fontSize: '0.95rem' }}>
        원하는 Style x Tone 조합을 선택하세요.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: '640px',
          width: '100%',
        }}
      >
        {STYLES.map((style) => (
          <div
            key={style}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#aaa',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              Style
            </p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1.25rem' }}>
              {STYLE_DESC[style]}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
              }}
            >
              {TONES.map((tone) => {
                const colors = TONE_COLORS[tone];
                const isSelected =
                  current?.style === style && current?.tone === tone;
                return (
                  <button
                    key={tone}
                    onClick={() => handleSelect(style, tone)}
                    style={{
                      position: 'relative',
                      padding: '0.75rem 0',
                      background: colors.primary,
                      color: colors.fg,
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: isSelected
                        ? '3px solid #333'
                        : '3px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    {isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#333',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                        }}
                      >
                        &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
