---
description: PDF → resume.ts AI 보완 개발 — Gemini API 연동, 내용 부족 필드 자동 보완
---

# AI 개발 — Gemini API 보완

선행: `pdf-1.spec.md` + `pdf-2.backend.md` 완료 필수

---

## 개발 범위

1. Gemini API 클라이언트 설정
2. 내용 부족 필드 감지 로직
3. 필드별 보완 프롬프트 설계
4. 보완 API 엔드포인트

---

## Step 1: 패키지 설치

```bash
npm install @google/generative-ai
```

`.env.local` 에 API 키 추가:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Step 2: Gemini 클라이언트

`src/lib/ai/gemini-client.ts` 생성:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 1024,
    temperature: 0.4,       // 낮을수록 일관된 출력
  },
});

export async function callGemini(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text().trim();
}
```

---

## Step 3: 부족 필드 감지기

`src/lib/ai/deficiency-detector.ts` 생성:

```typescript
import type { ResumeDto } from '@/types/resume-dto';

export interface DeficientField {
  path: string;         // 예: "profile.bio", "career.experiences.0.description"
  currentValue: string;
  reason: string;
  context: Record<string, string>;  // Gemini에 넘길 컨텍스트
}

export function detectDeficientFields(data: ResumeDto): DeficientField[] {
  const fields: DeficientField[] = [];

  // ─── profile.bio ─────────────────────────────────────────────
  if (!data.profile.bio || data.profile.bio.length < 100) {
    fields.push({
      path: 'profile.bio',
      currentValue: data.profile.bio,
      reason: `bio가 ${data.profile.bio.length}자로 100자 미만`,
      context: {
        name:  data.profile.name,
        title: data.profile.title,
        experiences: data.career.experiences
          .map((e) => `${e.company} ${e.position}`)
          .join(', '),
      },
    });
  }

  // ─── career.experiences ──────────────────────────────────────
  data.career.experiences.forEach((exp, i) => {
    if (!exp.description || exp.description.length < 50) {
      fields.push({
        path: `career.experiences.${i}.description`,
        currentValue: exp.description,
        reason: `description이 ${exp.description.length}자로 50자 미만`,
        context: {
          company:  exp.company,
          position: exp.position,
          period:   `${exp.period.start} ~ ${exp.period.end}`,
        },
      });
    }
    if (!exp.achievements || exp.achievements.length === 0) {
      fields.push({
        path: `career.experiences.${i}.achievements`,
        currentValue: '',
        reason: 'achievements 배열이 비어 있음',
        context: {
          company:     exp.company,
          position:    exp.position,
          description: exp.description,
        },
      });
    }
  });

  // ─── skills.level ──────────────────────────────────────────
  data.skills.categories.forEach((cat, ci) => {
    cat.skills.forEach((skill, si) => {
      if (skill.level === 'intermediate') {
        // intermediate는 기본값이므로 추론 불가일 수 있음 → 보완 대상
        fields.push({
          path: `skills.categories.${ci}.skills.${si}.level`,
          currentValue: skill.level,
          reason: 'level이 기본값(intermediate)으로 추론 불가',
          context: {
            skillName: skill.name,
            category:  cat.name,
          },
        });
      }
    });
  });

  // ─── Project.cases ───────────────────────────────────────────
  data.Project.cases.forEach((c, i) => {
    if (!c.description || c.description.length < 50) {
      fields.push({
        path: `Project.cases.${i}.description`,
        currentValue: c.description,
        reason: `description이 ${c.description.length}자로 50자 미만`,
        context: {
          title:     c.title,
          company:   c.company,
          role:      c.role,
          execution: c.execution,
        },
      });
    }
    if (!c.role) {
      fields.push({
        path: `Project.cases.${i}.role`,
        currentValue: '',
        reason: 'role이 비어 있음',
        context: {
          title:     c.title,
          execution: c.execution,
        },
      });
    }
  });

  return fields;
}
```

---

## Step 4: 필드별 프롬프트

`src/lib/ai/prompts.ts` 생성:

```typescript
import type { DeficientField } from './deficiency-detector';

export function buildPrompt(field: DeficientField): string {
  const ctx = field.context;

  const prompts: Record<string, string> = {

    'profile.bio': `
당신은 포트폴리오 작성 전문가입니다.
아래 개발자의 정보를 바탕으로 자기소개(bio)를 한국어 2~3문장으로 작성하세요.
전문성과 강점이 드러나야 하며, 자연스럽고 진솔한 톤으로 작성하세요.

이름: ${ctx.name}
직함: ${ctx.title}
경력: ${ctx.experiences}

bio만 출력하세요. 따옴표나 레이블 없이.
`.trim(),

    'career.experiences.description': `
아래 경력 정보를 바탕으로 담당 업무를 한국어 1~2문장으로 작성하세요.
구체적이고 전문적으로 작성하되, 과장하지 마세요.

회사: ${ctx.company}
직책: ${ctx.position}
기간: ${ctx.period}

description만 출력하세요.
`.trim(),

    'career.experiences.achievements': `
아래 경력 정보를 바탕으로 주요 성과/업무를 한국어 2~3개 bullet point로 작성하세요.
각 항목은 동사로 시작하며, JSON 배열 형식으로 반환하세요.

회사: ${ctx.company}
직책: ${ctx.position}
업무: ${ctx.description}

출력 형식 (배열만, 다른 텍스트 없이):
["성과1", "성과2", "성과3"]
`.trim(),

    'Project.cases.description': `
아래 프로젝트 정보를 바탕으로 프로젝트 설명을 한국어 2~3문장으로 작성하세요.
서비스의 목적, 주요 기능, 가치를 포함하세요.

프로젝트명: ${ctx.title}
회사: ${ctx.company}
역할: ${ctx.role}
기술스택: ${ctx.execution}

description만 출력하세요.
`.trim(),

    'Project.cases.role': `
아래 프로젝트의 기술스택을 바탕으로 담당 역할을 한국어로 간결하게 작성하세요.
예시: "기획+개발", "프론트엔드 개발", "PM, 서비스 기획", "풀스택 개발"

프로젝트명: ${ctx.title}
기술스택: ${ctx.execution}

역할만 출력하세요 (10자 이내, 짧게).
`.trim(),
  };

  // path의 인덱스 제거하여 프롬프트 키 매핑
  const key = field.path.replace(/\.\d+\./, '.').replace(/\.\d+$/, '');
  return prompts[key] ?? `다음 필드를 적절히 보완해 주세요: ${field.path}`;
}
```

---

## Step 5: 보완 실행기

`src/lib/ai/enricher.ts` 생성:

```typescript
import type { ResumeDto } from '@/types/resume-dto';
import { detectDeficientFields } from './deficiency-detector';
import { buildPrompt } from './prompts';
import { callGemini } from './gemini-client';

export interface EnrichResult {
  data: ResumeDto;
  enrichedPaths: string[];
  errors: string[];
}

export async function enrichResumeData(data: ResumeDto): Promise<EnrichResult> {
  const deficientFields = detectDeficientFields(data);
  const enrichedPaths: string[] = [];
  const errors: string[] = [];

  // 깊은 복사 (원본 수정 방지)
  const enriched: ResumeDto = JSON.parse(JSON.stringify(data));

  for (const field of deficientFields) {
    try {
      const prompt = buildPrompt(field);
      const result = await callGemini(prompt);

      // path를 파싱하여 enriched 객체에 값 적용
      applyValueToPath(enriched, field.path, result);
      enrichedPaths.push(field.path);
    } catch (err) {
      console.error(`Gemini 보완 실패 [${field.path}]:`, err);
      errors.push(field.path);
    }
  }

  return { data: enriched, enrichedPaths, errors };
}

function applyValueToPath(obj: Record<string, unknown>, path: string, value: string): void {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];

  // achievements는 JSON 배열 파싱
  if (lastKey === 'achievements') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        (current as Record<string, unknown[]>)[lastKey] = parsed;
        return;
      }
    } catch {
      // 파싱 실패 시 단일 항목 배열로
      (current as Record<string, string[]>)[lastKey] = [value];
      return;
    }
  }

  (current as Record<string, string>)[lastKey] = value;
}
```

---

## Step 6: 보완 API 엔드포인트

`src/app/api/pdf/enrich/route.ts` 생성:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { enrichResumeData } from '@/lib/ai/enricher';
import type { ResumeDto } from '@/types/resume-dto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, fields, historyId } = body as {
      data: ResumeDto;
      fields?: string[];
      historyId?: string;
    };

    if (!data) {
      return NextResponse.json({ error: 'data가 없습니다' }, { status: 400 });
    }

    const result = await enrichResumeData(data);

    // 히스토리 갱신 (historyId가 있으면)
    if (historyId) {
      const { historyStore } = await import('@/lib/pdf/history-store');
      const entry = historyStore.getById(historyId);
      if (entry) {
        entry.enrichedDto   = result.data;
        entry.enrichedPaths = result.enrichedPaths;
        entry.status        = result.errors.length > 0 ? 'partial' : 'success';
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      enrichedPaths: result.enrichedPaths,
      errors: result.errors,
    });
  } catch (err) {
    console.error('AI 보완 오류:', err);
    return NextResponse.json({ error: 'AI 보완 중 오류가 발생했습니다' }, { status: 500 });
  }
}
```

---

## 완료 체크리스트

- [ ] `GEMINI_API_KEY` 환경변수 설정
- [ ] `src/lib/ai/gemini-client.ts` — Gemini 클라이언트
- [ ] `src/lib/ai/deficiency-detector.ts` — 부족 필드 감지
- [ ] `src/lib/ai/prompts.ts` — 필드별 프롬프트
- [ ] `src/lib/ai/enricher.ts` — 보완 실행기
- [ ] `POST /api/pdf/enrich` — 보완 API
- [ ] Gemini API 실패 시 graceful fallback 확인
- [ ] achievements JSON 파싱 정상 동작 확인
