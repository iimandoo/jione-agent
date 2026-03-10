---
description: PDF → resume.ts 변환 히스토리 추적 + 리뷰 — 변환 이력 저장, 정확도 리뷰, 성능 분석
---

# 히스토리 추적 & 변환 리뷰

선행: `pdf-2.backend.md` + `pdf-3.ai-enrich.md` + `pdf-4.frontend.md` 완료 필수

---

## 개발 범위

1. 변환 이력 저장 (in-memory store)
2. 히스토리 목록 / 상세 API + UI
3. 변환 리뷰 입력 (섹션별 정확도 점수 + 코멘트)
4. 성능 통계 대시보드 (어떤 필드가 자주 틀리는지)

---

## 데이터 구조

### ConversionHistory

```typescript
// src/types/history.ts

import type { ResumeDto } from './resume-dto';

export interface ConversionHistory {
  id: string;                // crypto.randomUUID()
  userId: string;            // 카카오 로그인 ID (pdf-7 연동)
  timestamp: string;         // ISO 8601
  fileName: string;          // 업로드된 PDF 파일명
  status: 'success' | 'partial';
  originalDto: ResumeDto;    // AI 보완 전 파싱 원본
  enrichedDto: ResumeDto;    // AI 보완 후 최종 결과
  enrichedPaths: string[];   // AI가 보완한 필드 경로 목록
  review?: ConversionReview;
}

export interface ConversionReview {
  timestamp: string;
  scores: ReviewScores;
  incorrectFields: string[]; // 잘못 변환된 필드 목록 (예: "profile.name", "career.experiences.0.company")
  comments: string;
}

export interface ReviewScores {
  profile: number;        // 1~5
  career: number;
  projects: number;
  skills: number;
  aiEnrichQuality: number; // AI 보완 품질 1~5
}

export interface HistoryStats {
  totalCount: number;
  avgScores: ReviewScores;
  frequentlyWrongFields: Array<{ field: string; count: number }>;
  aiEnrichEffectiveness: number; // 보완 전후 평균 점수 차이
}
```

---

## Step 1: 히스토리 저장소

`src/lib/pdf/history-store.ts` 생성:

```typescript
import type { ConversionHistory, ConversionReview, HistoryStats } from '@/types/history';

// in-memory store (서버 재시작 시 초기화)
// 프로덕션 전환 시 DB로 교체
let store: ConversionHistory[] = [];

export const historyStore = {

  // ─── 저장 ──────────────────────────────────────────────────────
  add(entry: Omit<ConversionHistory, 'id' | 'timestamp'>): ConversionHistory {
    const record: ConversionHistory = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    store.unshift(record); // 최신순
    if (store.length > 100) store = store.slice(0, 100); // 최대 100건 유지
    return record;
  },

  // ─── 조회 ──────────────────────────────────────────────────────
  getAll(): ConversionHistory[] {
    return store;
  },

  getById(id: string): ConversionHistory | undefined {
    return store.find((h) => h.id === id);
  },

  // ─── 리뷰 등록 ─────────────────────────────────────────────────
  addReview(id: string, review: Omit<ConversionReview, 'timestamp'>): ConversionHistory | null {
    const entry = store.find((h) => h.id === id);
    if (!entry) return null;
    entry.review = { ...review, timestamp: new Date().toISOString() };
    return entry;
  },

  // ─── 성능 통계 ─────────────────────────────────────────────────
  getStats(): HistoryStats {
    const reviewed = store.filter((h) => h.review);

    if (reviewed.length === 0) {
      return {
        totalCount: store.length,
        avgScores: { profile: 0, career: 0, projects: 0, skills: 0, aiEnrichQuality: 0 },
        frequentlyWrongFields: [],
        aiEnrichEffectiveness: 0,
      };
    }

    // 섹션별 평균 점수
    const sum = reviewed.reduce(
      (acc, h) => {
        const s = h.review!.scores;
        return {
          profile:        acc.profile        + s.profile,
          career:         acc.career         + s.career,
          projects:       acc.projects       + s.projects,
          skills:         acc.skills         + s.skills,
          aiEnrichQuality: acc.aiEnrichQuality + s.aiEnrichQuality,
        };
      },
      { profile: 0, career: 0, projects: 0, skills: 0, aiEnrichQuality: 0 }
    );
    const n = reviewed.length;
    const avgScores = {
      profile:         Math.round((sum.profile / n) * 10) / 10,
      career:          Math.round((sum.career / n) * 10) / 10,
      projects:        Math.round((sum.projects / n) * 10) / 10,
      skills:          Math.round((sum.skills / n) * 10) / 10,
      aiEnrichQuality: Math.round((sum.aiEnrichQuality / n) * 10) / 10,
    };

    // 자주 틀리는 필드 집계
    const fieldCount: Record<string, number> = {};
    reviewed.forEach((h) => {
      h.review!.incorrectFields.forEach((f) => {
        fieldCount[f] = (fieldCount[f] ?? 0) + 1;
      });
    });
    const frequentlyWrongFields = Object.entries(fieldCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([field, count]) => ({ field, count }));

    // AI 보완 효과: AI 보완이 있는 항목의 평균 overall 점수 차이
    const withEnrich  = reviewed.filter((h) => h.enrichedPaths.length > 0);
    const withoutEnrich = reviewed.filter((h) => h.enrichedPaths.length === 0);
    const avgWithEnrich    = withEnrich.length    > 0 ? withEnrich.reduce((s, h)    => s + avgOfScores(h.review!.scores), 0) / withEnrich.length    : 0;
    const avgWithoutEnrich = withoutEnrich.length > 0 ? withoutEnrich.reduce((s, h) => s + avgOfScores(h.review!.scores), 0) / withoutEnrich.length : 0;
    const aiEnrichEffectiveness = Math.round((avgWithEnrich - avgWithoutEnrich) * 10) / 10;

    return { totalCount: store.length, avgScores, frequentlyWrongFields, aiEnrichEffectiveness };
  },
};

function avgOfScores(s: ReviewScores): number {
  return (s.profile + s.career + s.projects + s.skills) / 4;
}
```

---

## Step 2: 히스토리 API

### `src/app/api/pdf/history/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { historyStore } from '@/lib/pdf/history-store';
import type { ConversionHistory } from '@/types/history';

// 히스토리 목록 조회
export async function GET() {
  const list = historyStore.getAll().map((h) => ({
    id:             h.id,
    timestamp:      h.timestamp,
    fileName:       h.fileName,
    status:         h.status,
    enrichedCount:  h.enrichedPaths.length,
    hasReview:      !!h.review,
    reviewScores:   h.review?.scores ?? null,
  }));
  return NextResponse.json({ list });
}

// 변환 결과 저장
export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<ConversionHistory, 'id' | 'timestamp'>;
  const record = historyStore.add(body);
  return NextResponse.json({ success: true, id: record.id });
}
```

### `src/app/api/pdf/history/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { historyStore } from '@/lib/pdf/history-store';

// 상세 조회
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const entry = historyStore.getById(params.id);
  if (!entry) return NextResponse.json({ error: '히스토리를 찾을 수 없습니다' }, { status: 404 });
  return NextResponse.json(entry);
}
```

### `src/app/api/pdf/history/[id]/review/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { historyStore } from '@/lib/pdf/history-store';
import type { ConversionReview } from '@/types/history';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json() as Omit<ConversionReview, 'timestamp'>;

  // 점수 유효성 검사 (1~5)
  const scores = Object.values(body.scores);
  if (scores.some((s) => s < 1 || s > 5)) {
    return NextResponse.json({ error: '점수는 1~5 범위여야 합니다' }, { status: 400 });
  }

  const updated = historyStore.addReview(params.id, body);
  if (!updated) return NextResponse.json({ error: '히스토리를 찾을 수 없습니다' }, { status: 404 });

  return NextResponse.json({ success: true, review: updated.review });
}
```

### `src/app/api/pdf/history/stats/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { historyStore } from '@/lib/pdf/history-store';

export async function GET() {
  return NextResponse.json(historyStore.getStats());
}
```

---

## Step 3: 히스토리 저장 연동

> **참고**: 히스토리 저장/갱신 코드는 이미 `pdf-2.backend.md` (parse API)와 `pdf-3.ai-enrich.md` (enrich API)에 포함되어 있다.
> - `parse/route.ts` → `historyStore.add()` + `historyId` 반환
> - `enrich/route.ts` → `historyId`로 기존 히스토리 갱신
> - `pdf-4.frontend.md` → `historyId`를 sessionStorage에 저장 + enrich 호출 시 전달

---

## Step 4: 히스토리 목록 UI

`src/app/pdf/history/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const Layout = styled.div`max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;`;
const Title  = styled.h1`font-size: 1.5rem; font-weight: 700;`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 0.75rem 1rem; text-align: left; font-size: 0.8rem; color: #666; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;`;
const Td = styled.td`padding: 0.875rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem;`;
const TrHover = styled.tr`&:hover td { background: #f8f9fa; }`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => $status === 'success' ? '#c6f6d5' : '#fefcbf'};
  color:      ${({ $status }) => $status === 'success' ? '#276749' : '#744210'};
`;
const ReviewBadge = styled.span<{ $has: boolean }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: ${({ $has }) => $has ? '#ebf8ff' : '#f7fafc'};
  color:      ${({ $has }) => $has ? '#2b6cb0' : '#a0aec0'};
`;
const ScoreStar = styled.span`color: #f6ad55; font-weight: 700;`;
const LinkBtn = styled(Link)`color: #3182f6; font-size: 0.875rem; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; }`;

interface HistoryItem {
  id: string; timestamp: string; fileName: string;
  status: string; enrichedCount: number;
  hasReview: boolean; reviewScores: Record<string, number> | null;
}

export default function HistoryPage() {
  const [list, setList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/pdf/history').then(r => r.json()).then(d => setList(d.list));
  }, []);

  const avgScore = (scores: Record<string, number>) => {
    const vals = Object.values(scores).filter((_, i) => i < 4); // aiEnrichQuality 제외
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  return (
    <Layout>
      <Header>
        <Title>변환 히스토리</Title>
        <Link href="/pdf/history/stats" style={{ color: '#3182f6', fontWeight: 600 }}>📊 성능 통계</Link>
      </Header>

      {list.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '3rem' }}>아직 변환 이력이 없습니다</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>파일명</Th>
              <Th>변환 시각</Th>
              <Th>상태</Th>
              <Th>AI 보완</Th>
              <Th>리뷰</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {list.map((h) => (
              <TrHover key={h.id}>
                <Td style={{ fontWeight: 500 }}>{h.fileName}</Td>
                <Td style={{ color: '#666' }}>{new Date(h.timestamp).toLocaleString('ko-KR')}</Td>
                <Td><StatusBadge $status={h.status}>{h.status === 'success' ? '성공' : '부분 성공'}</StatusBadge></Td>
                <Td style={{ color: '#666' }}>{h.enrichedCount}개 필드</Td>
                <Td>
                  <ReviewBadge $has={h.hasReview}>
                    {h.hasReview && h.reviewScores
                      ? <><ScoreStar>★</ScoreStar> {avgScore(h.reviewScores)}</>
                      : '미작성'}
                  </ReviewBadge>
                </Td>
                <Td>
                  <LinkBtn href={`/pdf/history/${h.id}`}>상세보기 →</LinkBtn>
                </Td>
              </TrHover>
            ))}
          </tbody>
        </Table>
      )}
    </Layout>
  );
}
```

---

## Step 5: 리뷰 입력 UI

`src/app/pdf/history/[id]/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import type { ConversionHistory, ReviewScores } from '@/types/history';

const Layout = styled.div`max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem;`;
const Section = styled.div`border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;`;
const SectionTitle = styled.h2`font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;`;
const Label = styled.label`display: block; font-size: 0.8rem; font-weight: 600; color: #666; margin-bottom: 0.375rem; text-transform: uppercase;`;
const FieldRow = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`;
const FieldName = styled.span`font-size: 0.9rem; color: #444;`;
const AIBadge = styled.span`font-size: 0.7rem; background: #7c3aed; color: white; padding: 0.1rem 0.4rem; border-radius: 999px; margin-left: 0.4rem;`;

// 별점 컴포넌트
const Stars = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        onClick={() => onChange(n)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: n <= value ? '#f6ad55' : '#e2e8f0' }}
      >★</button>
    ))}
  </div>
);

const SCORE_LABELS: Record<keyof ReviewScores, string> = {
  profile:         '프로필 정확도',
  career:          '경력 정확도',
  projects:        '프로젝트 정확도',
  skills:          '스킬 정확도',
  aiEnrichQuality: 'AI 보완 품질',
};

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<ConversionHistory | null>(null);
  const [scores, setScores] = useState<ReviewScores>({ profile: 0, career: 0, projects: 0, skills: 0, aiEnrichQuality: 0 });
  const [incorrectFields, setIncorrectFields] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/pdf/history/${id}`).then(r => r.json()).then((d: ConversionHistory) => {
      setEntry(d);
      if (d.review) {
        setScores(d.review.scores);
        setIncorrectFields(d.review.incorrectFields);
        setComments(d.review.comments);
        setSubmitted(true);
      }
    });
  }, [id]);

  const toggleField = (path: string) =>
    setIncorrectFields((prev) => prev.includes(path) ? prev.filter(f => f !== path) : [...prev, path]);

  const handleSubmit = async () => {
    await fetch(`/api/pdf/history/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, incorrectFields, comments }),
    });
    setSubmitted(true);
  };

  const allScored = Object.values(scores).every(v => v > 0);

  if (!entry) return <div style={{ padding: '2rem' }}>로딩 중...</div>;

  // 리뷰 대상 필드 목록 (파싱된 필드 + AI 보완 필드)
  const reviewableFields = [
    'profile.name', 'profile.email', 'profile.phone', 'profile.bio',
    ...entry.enrichedPaths,
    ...entry.enrichedDto.career.experiences.map((_, i) => `career.experiences.${i}.description`),
    ...entry.enrichedDto.Project.cases.map((_, i) => `Project.cases.${i}.description`),
  ];
  const uniqueFields = [...new Set(reviewableFields)];

  return (
    <Layout>
      <h1 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>
        변환 리뷰 — {entry.fileName}
        <span style={{ fontSize: '0.875rem', color: '#999', marginLeft: '0.75rem' }}>
          {new Date(entry.timestamp).toLocaleString('ko-KR')}
        </span>
      </h1>

      {/* 변환 정보 */}
      <Section>
        <SectionTitle>변환 정보</SectionTitle>
        <FieldRow><FieldName>AI 보완 필드 수</FieldName><span>{entry.enrichedPaths.length}개</span></FieldRow>
        <FieldRow><FieldName>상태</FieldName><span>{entry.status}</span></FieldRow>
        {entry.enrichedPaths.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <Label>AI 보완 필드 목록</Label>
            {entry.enrichedPaths.map(p => <div key={p} style={{ fontSize: '0.85rem', color: '#7c3aed', marginBottom: '0.25rem' }}>• {p}</div>)}
          </div>
        )}
      </Section>

      {/* 섹션별 정확도 점수 */}
      <Section>
        <SectionTitle>섹션별 정확도 점수</SectionTitle>
        {(Object.keys(SCORE_LABELS) as Array<keyof ReviewScores>).map((key) => (
          <FieldRow key={key}>
            <FieldName>{SCORE_LABELS[key]}</FieldName>
            <Stars value={scores[key]} onChange={(v) => setScores(prev => ({ ...prev, [key]: v }))} />
          </FieldRow>
        ))}
      </Section>

      {/* 잘못 변환된 필드 체크 */}
      <Section>
        <SectionTitle>잘못 변환된 필드 선택</SectionTitle>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
          부정확하게 변환된 필드를 선택하세요. 성능 개선에 활용됩니다.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {uniqueFields.map((field) => (
            <button
              key={field}
              onClick={() => toggleField(field)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid',
                cursor: 'pointer',
                fontSize: '0.8rem',
                background: incorrectFields.includes(field) ? '#fed7d7' : '#f7fafc',
                borderColor: incorrectFields.includes(field) ? '#fc8181' : '#e2e8f0',
                color: incorrectFields.includes(field) ? '#c53030' : '#555',
              }}
            >
              {field}
              {entry.enrichedPaths.includes(field) && <AIBadge>AI</AIBadge>}
            </button>
          ))}
        </div>
      </Section>

      {/* 코멘트 */}
      <Section>
        <SectionTitle>개선 의견</SectionTitle>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="파싱 오류, 개선이 필요한 부분, Gemini 보완 품질 등 자유롭게 작성하세요"
          style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical', fontSize: '0.9rem' }}
        />
      </Section>

      <SubmitBtn onClick={handleSubmit} disabled={!allScored || submitted}>
        {submitted ? '✅ 리뷰 완료' : '리뷰 제출'}
      </SubmitBtn>
    </Layout>
  );
}
```

---

## Step 6: 성능 통계 대시보드

`src/app/pdf/history/stats/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import type { HistoryStats } from '@/types/history';

const Layout = styled.div`max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem;`;
const Grid   = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;`;
const StatCard = styled.div`background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; text-align: center;`;
const StatValue = styled.div`font-size: 2rem; font-weight: 700; color: #3182f6;`;
const StatLabel = styled.div`font-size: 0.8rem; color: #666; margin-top: 0.25rem;`;

const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 700, color: value >= 4 ? '#38a169' : value >= 3 ? '#d69e2e' : '#e53e3e' }}>
        {value.toFixed(1)} / 5
      </span>
    </div>
    <div style={{ background: '#e2e8f0', borderRadius: '999px', height: 8 }}>
      <div style={{ background: value >= 4 ? '#38a169' : value >= 3 ? '#d69e2e' : '#e53e3e', width: `${(value / 5) * 100}%`, height: '100%', borderRadius: '999px', transition: 'width 0.4s ease' }} />
    </div>
  </div>
);

export default function StatsPage() {
  const [stats, setStats] = useState<HistoryStats | null>(null);

  useEffect(() => {
    fetch('/api/pdf/history/stats').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return <div style={{ padding: '2rem' }}>로딩 중...</div>;

  const SCORE_LABELS: Record<string, string> = {
    profile: '프로필', career: '경력', projects: '프로젝트',
    skills: '스킬', aiEnrichQuality: 'AI 보완 품질',
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>변환 성능 통계</h1>
        <Link href="/pdf/history" style={{ color: '#3182f6', fontWeight: 600 }}>← 히스토리 목록</Link>
      </div>

      <Grid>
        <StatCard>
          <StatValue>{stats.totalCount}</StatValue>
          <StatLabel>총 변환 횟수</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: stats.aiEnrichEffectiveness > 0 ? '#38a169' : '#e53e3e' }}>
            {stats.aiEnrichEffectiveness > 0 ? '+' : ''}{stats.aiEnrichEffectiveness}
          </StatValue>
          <StatLabel>AI 보완 효과 (점수 차이)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.frequentlyWrongFields.length}</StatValue>
          <StatLabel>개선 필요 필드 수</StatLabel>
        </StatCard>
      </Grid>

      {/* 섹션별 평균 점수 */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>섹션별 평균 정확도</h2>
        {Object.entries(stats.avgScores).map(([key, val]) => (
          <ScoreBar key={key} label={SCORE_LABELS[key] ?? key} value={val} />
        ))}
      </div>

      {/* 자주 틀리는 필드 */}
      {stats.frequentlyWrongFields.length > 0 && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>자주 오류 발생 필드 (개선 우선순위)</h2>
          {stats.frequentlyWrongFields.map(({ field, count }, i) => (
            <div key={field} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: i < stats.frequentlyWrongFields.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <span style={{ fontSize: '0.9rem', color: i < 3 ? '#c53030' : '#555', fontWeight: i < 3 ? 600 : 400 }}>
                {i < 3 ? '🔴' : '🟡'} {field}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>{count}회 오류</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
```

---

## 완료 체크리스트

- [ ] `src/types/history.ts` — HistoryEntry, ReviewScores, HistoryStats 타입
- [ ] `src/lib/pdf/history-store.ts` — in-memory store (add/get/review/stats)
- [ ] `POST /api/pdf/history` — 히스토리 저장
- [ ] `GET /api/pdf/history` — 목록 조회
- [ ] `GET /api/pdf/history/[id]` — 상세 조회
- [ ] `POST /api/pdf/history/[id]/review` — 리뷰 등록
- [ ] `GET /api/pdf/history/stats` — 통계
- [ ] `pdf/parse` API — historyId 반환 추가
- [ ] `pdf/enrich` API — historyId 받아 갱신
- [ ] `src/app/pdf/history/page.tsx` — 히스토리 목록
- [ ] `src/app/pdf/history/[id]/page.tsx` — 리뷰 입력
- [ ] `src/app/pdf/history/stats/page.tsx` — 성능 통계 대시보드
- [ ] 잘못된 필드 선택 → 통계 집계 → 개선 우선순위 확인
