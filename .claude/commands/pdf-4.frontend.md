---
description: Portfolio Builder 프론트엔드 개발 — 랜딩페이지, PDF 업로드 UI, 미리보기, 편집 폼, 다운로드
---

# FE 개발 — Portfolio Builder UI

선행: `pdf-2.backend.md` + `pdf-3.ai-enrich.md` API 완료 필수

---

## 개발 범위

> **인증 정책**: 아래 모든 페이지는 **로그인 없이 공개**. 인증은 ZIP 다운로드 시에만 필요 (pdf-7, pdf-9 참고).

1. **랜딩페이지** (톤앤매너 적용) — 공개
2. PDF 업로드 페이지 — 공개
3. 파싱 결과 미리보기 + 인라인 편집 — 공개
4. AI 보완 실행 UI — 공개
5. resume.ts 다운로드 — 공개
6. **포트폴리오 미리보기 버튼** → `/pdf/portfolio-preview` 이동 (pdf-8 참고)

---

## 톤앤매너 적용 규칙

서비스 전체 페이지에 jione-portfolio의 theme 시스템을 적용한다.

**기본 톤**: `toss` (Toss 블루 #3182F6 기반)

1. `src/app/pdf/layout.tsx` 생성 — `/pdf/*` 전체를 StyleProvider로 감싸기:
   ```typescript
   'use client';
   import { StyleProvider } from '@/styles/provider';
   import { tossTheme } from '@/styles/themes/toss';

   export default function PdfLayout({ children }: { children: React.ReactNode }) {
     return <StyleProvider theme={tossTheme}>{children}</StyleProvider>;
   }
   ```

2. 모든 styled-components에서 하드코딩 색상 대신 `theme` 사용:
   ```typescript
   // ❌ 하드코딩
   background: #3182f6;
   color: #111;

   // ✅ theme 토큰 사용
   background: ${({ theme }) => theme.colors.primary};
   color: ${({ theme }) => theme.colors.text};
   ```

3. theme 토큰 매핑:
   | 하드코딩 | theme 토큰 |
   |---------|-----------|
   | `#3182f6` | `theme.colors.primary` |
   | `#111`, `#333` | `theme.colors.text` |
   | `#666`, `#999` | `theme.colors.subText` |
   | `#f8f9fa`, `#fafafa` | `theme.colors.background` |
   | `white` | `theme.colors.surface` |
   | `#e2e8f0`, `#cbd5e0` | `theme.colors.border` |
   | `#7c3aed` | AI 보완 전용 — 하드코딩 유지 가능 |

---

## Step 1: 랜딩페이지

`src/app/page.tsx` — Portfolio Builder 서비스 진입점:

```typescript
'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { StyleProvider } from '@/styles/provider';
import { tossTheme } from '@/styles/themes/toss';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const Hero = styled.section`
  text-align: center;
  max-width: 640px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Desc = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.subText};
  line-height: 1.8;
  margin-bottom: 2.5rem;
`;

const CTAButton = styled.button`
  padding: 1rem 2.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;
  &:hover { opacity: 0.88; }
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 800px;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 2rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const FeatureIcon = styled.div`font-size: 2rem; margin-bottom: 0.75rem;`;
const FeatureTitle = styled.h3`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;
const FeatureDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subText};
  line-height: 1.6;
`;

export default function LandingPage() {
  const router = useRouter();

  return (
    <StyleProvider theme={tossTheme}>
      <Page>
        <Hero>
          <Title>
            PDF 한 장으로<br/>
            <Highlight>포트폴리오</Highlight>가 완성됩니다
          </Title>
          <Desc>
            이력서 PDF를 업로드하면 AI가 자동으로 분석하고,<br/>
            8가지 디자인의 포트폴리오를 즉시 생성합니다.
          </Desc>
          <CTAButton onClick={() => router.push('/pdf')}>
            시작하기
          </CTAButton>
        </Hero>

        <Features>
          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>PDF 자동 파싱</FeatureTitle>
            <FeatureDesc>경력, 프로젝트, 스킬을 자동으로 추출합니다</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI 보완</FeatureTitle>
            <FeatureDesc>부족한 내용을 Gemini AI가 자동으로 채워줍니다</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>8가지 디자인</FeatureTitle>
            <FeatureDesc>Block × Corporate 스타일과 4가지 톤을 선택하세요</FeatureDesc>
          </FeatureCard>
        </Features>
      </Page>
    </StyleProvider>
  );
}
```

---

## Step 2: 페이지 라우트

```
src/app/
  ├── page.tsx              ← 랜딩페이지 (톤앤매너 적용)
  └── pdf/
      ├── layout.tsx        ← StyleProvider (tossTheme) 래핑
      ├── page.tsx          ← 업로드 화면
      └── result/
          └── page.tsx      ← 미리보기 + 편집 화면
```

---

## Step 3: 업로드 페이지

`src/app/pdf/page.tsx` — layout.tsx의 StyleProvider에 의해 theme이 자동 적용됨:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 3rem;
  max-width: 480px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.subText};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const DropZone = styled.label<{ $isDragging: boolean; $hasError: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 2px dashed ${({ $hasError, theme }) => ($hasError ? '#e53e3e' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isDragging, theme }) => ($isDragging ? `${theme.colors.primary}10` : theme.colors.background)};
  border-color: ${({ $isDragging, theme }) => ($isDragging ? theme.colors.primary : undefined)};

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; background: ${({ theme }) => `${theme.colors.primary}10`}; }
`;

const FileInput = styled.input`display: none;`;

const UploadIcon = styled.span`font-size: 2.5rem;`;
const DropText = styled.p`font-size: 1rem; color: ${({ theme }) => theme.colors.text}; font-weight: 500;`;
const DropHint = styled.p`font-size: 0.8125rem; color: ${({ theme }) => theme.colors.subText};`;
const ErrorMsg = styled.p`color: #e53e3e; font-size: 0.875rem; margin-top: 0.5rem;`;

const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  margin-top: 1.5rem;
  transition: opacity 0.15s ease;
  &:hover:not(:disabled) { opacity: 0.88; }
`;

export default function PdfUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (f: File): string => {
    if (f.type !== 'application/pdf') return 'PDF 파일만 업로드 가능합니다';
    if (f.size > 10 * 1024 * 1024) return '파일 크기는 10MB 이하여야 합니다';
    return '';
  };

  const handleFile = useCallback((f: File) => {
    const err = validate(f);
    setError(err);
    if (!err) setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/pdf/parse', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? '파싱 실패');

      sessionStorage.setItem('resumeData', JSON.stringify(json.data));
      sessionStorage.setItem('historyId', json.historyId);
      router.push('/pdf/result');
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Portfolio Builder</Title>
        <Subtitle>PDF 이력서를 업로드하면<br/>포트폴리오가 자동으로 완성됩니다</Subtitle>

        <DropZone
          $isDragging={isDragging}
          $hasError={!!error}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <FileInput
            type="file"
            accept=".pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <UploadIcon>📄</UploadIcon>
          <DropText>{file ? file.name : 'PDF를 여기에 드래그하거나 클릭하세요'}</DropText>
          <DropHint>최대 10MB · PDF 파일만 지원</DropHint>
        </DropZone>

        {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}

        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          $loading={loading}
        >
          {loading ? '분석 중...' : '변환 시작'}
        </Button>
      </Card>
    </Wrapper>
  );
}
```

---

## Step 4: 결과 미리보기 + 편집

`src/app/pdf/result/page.tsx` — layout.tsx의 StyleProvider에 의해 theme 자동 적용:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ResumeDto } from '@/types/resume-dto';
import styled from 'styled-components';

// ─── Styled Components (theme 토큰 사용) ────────────────────────────

const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ActionBar = styled.div`display: flex; gap: 0.75rem;`;

const Btn = styled.button<{ $variant?: 'primary' | 'ai' | 'outline' }>`
  padding: 0.6rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: ${({ $variant, theme }) =>
    $variant === 'outline' ? `1px solid ${theme.colors.border}` : 'none'};
  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.primary
    : $variant === 'ai' ? '#7c3aed'
    : theme.colors.surface};
  color: ${({ $variant, theme }) =>
    ($variant === 'primary' || $variant === 'ai') ? 'white' : theme.colors.text};
  &:hover { opacity: 0.88; }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.subText)};
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
`;

const FieldGroup = styled.div`margin-bottom: 1.25rem;`;
const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.subText};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
`;
const Input = styled.input<{ $aiGenerated?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $aiGenerated, theme }) => ($aiGenerated ? '#d6bcfa' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $aiGenerated, theme }) => ($aiGenerated ? '#faf5ff' : theme.colors.surface)};
  font-size: 0.9375rem;
`;
const Textarea = styled.textarea<{ $aiGenerated?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $aiGenerated, theme }) => ($aiGenerated ? '#d6bcfa' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $aiGenerated, theme }) => ($aiGenerated ? '#faf5ff' : theme.colors.surface)};
  font-size: 0.9375rem;
  min-height: 80px;
  resize: vertical;
`;
const AIBadge = styled.span`
  font-size: 0.7rem;
  background: #7c3aed;
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  margin-left: 0.5rem;
`;

const TABS = ['프로필', '경력', '프로젝트', '스킬'];

// ─── Main Component ─────────────────────────────────────────────────

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeDto | null>(null);
  const [enrichedPaths, setEnrichedPaths] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('resumeData');
    if (!saved) { router.push('/pdf'); return; }
    setData(JSON.parse(saved));
    setHistoryId(sessionStorage.getItem('historyId'));
  }, [router]);

  const isAiGenerated = (path: string) => enrichedPaths.includes(path);

  const handleEnrich = async () => {
    if (!data) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/pdf/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, historyId }),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setEnrichedPaths(json.enrichedPaths);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data) return;
    const res = await fetch('/api/pdf/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.ts';
    a.click();
    URL.revokeObjectURL(url);
    // 다운로드 후 리뷰 유도 모달 표시
    if (historyId) setShowReviewModal(true);
  };

  const update = (path: string[], value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as ResumeDto;
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  if (!data) return <div style={{ padding: '2rem' }}>로딩 중...</div>;

  return (
    <Layout>
      <Header>
        <Title>변환 결과 확인 & 편집</Title>
        <ActionBar>
          <Btn $variant="ai" onClick={handleEnrich} disabled={aiLoading}>
            {aiLoading ? 'AI 보완 중...' : '🤖 AI 보완'}
          </Btn>
          <Btn $variant="primary" onClick={handleDownload}>
            resume.ts 다운로드
          </Btn>
          <Btn $variant="outline" onClick={() => router.push('/pdf/portfolio-preview')}>
            포트폴리오 미리보기
          </Btn>
          <Btn $variant="outline" onClick={() => router.push('/pdf/history')}>
            히스토리
          </Btn>
          <Btn $variant="outline" onClick={() => router.push('/pdf')}>
            다시 업로드
          </Btn>
        </ActionBar>
      </Header>

      <Tabs>
        {TABS.map((t, i) => (
          <Tab key={t} $active={activeTab === i} onClick={() => setActiveTab(i)}>{t}</Tab>
        ))}
      </Tabs>

      {/* 프로필 탭 */}
      {activeTab === 0 && (
        <div>
          {(['name', 'title', 'subtitle', 'email', 'phone', 'location'] as const).map((key) => (
            <FieldGroup key={key}>
              <Label>{key}</Label>
              <Input
                value={data.profile[key]}
                onChange={(e) => update(['profile', key], e.target.value)}
                $aiGenerated={isAiGenerated(`profile.${key}`)}
              />
            </FieldGroup>
          ))}
          <FieldGroup>
            <Label>
              bio
              {isAiGenerated('profile.bio') && <AIBadge>AI 생성</AIBadge>}
            </Label>
            <Textarea
              value={data.profile.bio}
              onChange={(e) => update(['profile', 'bio'], e.target.value)}
              $aiGenerated={isAiGenerated('profile.bio')}
            />
          </FieldGroup>
        </div>
      )}

      {/* 경력 탭 */}
      {activeTab === 1 && (
        <div>
          {data.career.experiences.map((exp, i) => (
            <div key={exp.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem' }}>{exp.company}</h3>
              {(['company', 'position'] as const).map((key) => (
                <FieldGroup key={key}>
                  <Label>{key}</Label>
                  <Input value={exp[key]} onChange={(e) => update(['career', 'experiences', String(i), key], e.target.value)} />
                </FieldGroup>
              ))}
              <FieldGroup>
                <Label>
                  description
                  {isAiGenerated(`career.experiences.${i}.description`) && <AIBadge>AI 생성</AIBadge>}
                </Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => update(['career', 'experiences', String(i), 'description'], e.target.value)}
                  $aiGenerated={isAiGenerated(`career.experiences.${i}.description`)}
                />
              </FieldGroup>
            </div>
          ))}
        </div>
      )}

      {/* 프로젝트 탭 */}
      {activeTab === 2 && (
        <div>
          {data.Project.cases.map((c, i) => (
            <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem' }}>{c.title}</h3>
              {(['title', 'company', 'role', 'execution', 'tools', 'year'] as const).map((key) => (
                <FieldGroup key={key}>
                  <Label>
                    {key}
                    {isAiGenerated(`Project.cases.${i}.${key}`) && <AIBadge>AI 생성</AIBadge>}
                  </Label>
                  <Input value={c[key] ?? ''} onChange={(e) => update(['Project', 'cases', String(i), key], e.target.value)} $aiGenerated={isAiGenerated(`Project.cases.${i}.${key}`)} />
                </FieldGroup>
              ))}
              <FieldGroup>
                <Label>
                  description
                  {isAiGenerated(`Project.cases.${i}.description`) && <AIBadge>AI 생성</AIBadge>}
                </Label>
                <Textarea value={c.description} onChange={(e) => update(['Project', 'cases', String(i), 'description'], e.target.value)} $aiGenerated={isAiGenerated(`Project.cases.${i}.description`)} />
              </FieldGroup>
            </div>
          ))}
        </div>
      )}

      {/* 스킬 탭 */}
      {activeTab === 3 && (
        <div>
          {data.skills.categories.map((cat, ci) => (
            <div key={cat.name} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem' }}>{cat.name}</h3>
              {cat.skills.map((skill, si) => (
                <div key={skill.name} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Input value={skill.name} style={{ flex: 2 }} onChange={(e) => update(['skills', 'categories', String(ci), 'skills', String(si), 'name'], e.target.value)} />
                  <select
                    value={skill.level}
                    onChange={(e) => update(['skills', 'categories', String(ci), 'skills', String(si), 'level'], e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
                  >
                    <option value="expert">expert</option>
                    <option value="advanced">advanced</option>
                    <option value="intermediate">intermediate</option>
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* 다운로드 후 리뷰 유도 모달 */}
      {showReviewModal && historyId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 400, textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>다운로드 완료!</p>
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              변환 품질을 평가해주시면<br/>서비스 개선에 큰 도움이 됩니다.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Btn $variant="primary" onClick={() => router.push(`/pdf/history/${historyId}`)} style={{ flex: 1 }}>
                리뷰 하러 가기
              </Btn>
              <Btn $variant="outline" onClick={() => setShowReviewModal(false)} style={{ flex: 1 }}>
                나중에
              </Btn>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
```

---

## 완료 체크리스트

- [ ] `src/app/page.tsx` — 랜딩페이지 (톤앤매너 적용, Hero + Feature 카드)
- [ ] `src/app/pdf/layout.tsx` — StyleProvider(tossTheme) 래핑
- [ ] `src/app/pdf/page.tsx` — 업로드 화면 (theme 토큰 사용)
- [ ] `src/app/pdf/result/page.tsx` — 결과 편집 화면 (theme 토큰 사용)
- [ ] 모든 styled-components에서 하드코딩 색상 → theme 토큰으로 교체
- [ ] AI 보완 결과 보라색 배경 + "AI 생성" 뱃지 표시
- [ ] 모든 필드 인라인 편집 가능
- [ ] resume.ts 다운로드 동작 확인
- [ ] 빈 데이터(sessionStorage 없음) → 업로드 화면 리디렉션
