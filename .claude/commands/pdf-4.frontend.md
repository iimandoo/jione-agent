---
description: PDF → resume.ts 변환 프론트엔드 개발 — PDF 업로드 UI, 미리보기, 편집 폼, 다운로드
---

# FE 개발 — PDF 업로드 & 편집 UI

선행: `pdf-2.backend.md` + `pdf-3.ai-enrich.md` API 완료 필수

---

## 개발 범위

1. PDF 업로드 페이지
2. 파싱 결과 미리보기 + 인라인 편집
3. AI 보완 실행 UI
4. resume.ts 다운로드

---

## Step 1: 페이지 라우트

```
src/app/pdf/
  ├── page.tsx         ← 업로드 화면
  └── result/
      └── page.tsx     ← 미리보기 + 편집 화면
```

---

## Step 2: 업로드 페이지

`src/app/pdf/page.tsx`:

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
  background: #f8f9fa;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const DropZone = styled.label<{ $isDragging: boolean; $hasError: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 2px dashed ${({ $hasError }) => ($hasError ? '#e53e3e' : '#cbd5e0')};
  border-radius: 12px;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isDragging }) => ($isDragging ? '#ebf8ff' : '#fafafa')};
  border-color: ${({ $isDragging }) => ($isDragging ? '#3182f6' : undefined)};

  &:hover { border-color: #3182f6; background: #ebf8ff; }
`;

const FileInput = styled.input`display: none;`;

const UploadIcon = styled.span`font-size: 2.5rem;`;
const DropText = styled.p`font-size: 1rem; color: #444; font-weight: 500;`;
const DropHint = styled.p`font-size: 0.8125rem; color: #999;`;
const ErrorMsg = styled.p`color: #e53e3e; font-size: 0.875rem; margin-top: 0.5rem;`;

const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 10px;
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
        <Title>PDF → resume.ts</Title>
        <Subtitle>PDF 이력서를 업로드하면<br/>포트폴리오 데이터로 자동 변환합니다</Subtitle>

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

## Step 3: 결과 미리보기 + 편집

`src/app/pdf/result/page.tsx` (핵심 구조):

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ResumeDto } from '@/types/resume-dto';
import styled from 'styled-components';

// ─── Styled Components ──────────────────────────────────────────────

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

const Title = styled.h1`font-size: 1.5rem; font-weight: 700;`;

const ActionBar = styled.div`display: flex; gap: 0.75rem;`;

const Btn = styled.button<{ $variant?: 'primary' | 'ai' | 'outline' }>`
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: ${({ $variant }) =>
    $variant === 'outline' ? '1px solid #cbd5e0' : 'none'};
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#3182f6'
    : $variant === 'ai' ? '#7c3aed'
    : 'white'};
  color: ${({ $variant }) =>
    ($variant === 'primary' || $variant === 'ai') ? 'white' : '#333'};
  &:hover { opacity: 0.88; }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? '#3182f6' : '#666')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#3182f6' : 'transparent')};
  margin-bottom: -2px;
`;

const FieldGroup = styled.div`margin-bottom: 1.25rem;`;
const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
`;
const Input = styled.input<{ $aiGenerated?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $aiGenerated }) => ($aiGenerated ? '#d6bcfa' : '#e2e8f0')};
  border-radius: 8px;
  background: ${({ $aiGenerated }) => ($aiGenerated ? '#faf5ff' : 'white')};
  font-size: 0.9375rem;
`;
const Textarea = styled.textarea<{ $aiGenerated?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $aiGenerated }) => ($aiGenerated ? '#d6bcfa' : '#e2e8f0')};
  border-radius: 8px;
  background: ${({ $aiGenerated }) => ($aiGenerated ? '#faf5ff' : 'white')};
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

- [ ] `src/app/pdf/page.tsx` — 업로드 화면 (드래그&드롭, 유효성 검사)
- [ ] `src/app/pdf/result/page.tsx` — 결과 편집 화면 (4개 탭)
- [ ] AI 보완 결과 보라색 배경 + "AI 생성" 뱃지 표시
- [ ] 모든 필드 인라인 편집 가능
- [ ] resume.ts 다운로드 동작 확인
- [ ] 빈 데이터(sessionStorage 없음) → 업로드 화면 리디렉션
