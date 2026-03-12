---
description: PDF → resume.ts 변환 백엔드 개발 — PDF 파싱 API, DTO 매핑, 데이터 정규화
---

# BE 개발 — PDF 파싱 API

선행: `pdf-1.spec.md` 기획 스펙 확인 필수

---

## 개발 범위

> **인증 정책**: PDF 파싱/다운로드 API는 **공개** — `requireSession` 사용하지 않음.
> 미로그인 사용자도 PDF 업로드 → 변환 → 다운로드 가능.

1. PDF 업로드 수신 API
2. PDF 텍스트 추출 (pdf-parse)
3. 섹션 분류 및 DTO 매핑
4. resume.ts 구조로 정규화 출력

---

## Step 1: 패키지 설치

```bash
npm install pdf-parse
npm install -D @types/pdf-parse
```

---

## Step 2: PDF 업로드 API

`src/app/api/pdf/parse/route.ts` 생성:

```typescript
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { mapPdfToResumeDto } from "@/lib/pdf/dto-mapper";

// ✅ 공개 API — requireSession 사용하지 않음
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "PDF 파일이 없습니다" },
        { status: 400 },
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 10MB 이하여야 합니다" },
        { status: 400 },
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "PDF 파일만 업로드 가능합니다" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json(
        { error: "텍스트를 추출할 수 없는 PDF입니다 (이미지 전용 PDF)" },
        { status: 422 },
      );
    }

    const resumeData = mapPdfToResumeDto(parsed.text);

    return NextResponse.json({
      success: true,
      data: resumeData,
    });
  } catch (err) {
    console.error("PDF 파싱 오류:", err);
    return NextResponse.json(
      { error: "PDF 파싱 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
```

---

## Step 3: 섹션 분류기

`src/lib/pdf/section-classifier.ts` 생성:

```typescript
export type PdfSection =
  | "profile"
  | "career"
  | "projects"
  | "skills"
  | "unknown";

const SECTION_KEYWORDS: Record<PdfSection, string[]> = {
  profile: [
    "이름",
    "연락처",
    "이메일",
    "email",
    "phone",
    "주소",
    "자기소개",
    "summary",
    "about",
    "profile",
  ],
  career: ["경력", "경험", "work experience", "career", "이력", "직장"],
  projects: ["프로젝트", "project", "포트폴리오", "portfolio"],
  skills: ["기술", "스킬", "skill", "tech", "사용 기술", "stack"],
  unknown: [],
};

export function classifySection(line: string): PdfSection {
  const lower = line.toLowerCase().trim();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (section === "unknown") continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return section as PdfSection;
    }
  }
  return "unknown";
}

export function splitIntoSections(text: string): Record<PdfSection, string[]> {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const sections: Record<PdfSection, string[]> = {
    profile: [],
    career: [],
    projects: [],
    skills: [],
    unknown: [],
  };

  let current: PdfSection = "unknown";
  for (const line of lines) {
    const classified = classifySection(line);
    if (classified !== "unknown") {
      current = classified;
    } else {
      sections[current].push(line);
    }
  }
  return sections;
}
```

---

## Step 4: DTO 매퍼

`src/lib/pdf/dto-mapper.ts` 생성:

```typescript
import type { ResumeDto } from "@/types/resume-dto";
import { splitIntoSections } from "./section-classifier";

// ─── 정규화 헬퍼 ──────────────────────────────────────────────────

/** "2023.03" 또는 "2023년 3월" → "YYYY.MM" 또는 "present" */
function normalizePeriod(raw: string): string {
  if (/현재|present|now/i.test(raw)) return "present";
  const match = raw.match(/(\d{4})[.\-년\s]+(\d{1,2})/);
  if (match) return `${match[1]}.${match[2].padStart(2, "0")}`;
  const yearOnly = raw.match(/(\d{4})/);
  if (yearOnly) return yearOnly[1];
  return raw.trim();
}

/** 기술 스택 문자열을 콤마 구분으로 정규화 */
function normalizeStack(raw: string): string {
  return raw
    .split(/[,·|/\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

/** 스킬 레벨 추론 */
function inferSkillLevel(
  context: string,
): "expert" | "advanced" | "intermediate" {
  if (/전문|expert|5년|6년|7년|8년|10년/i.test(context)) return "expert";
  if (/숙련|advanced|3년|4년/i.test(context)) return "advanced";
  return "intermediate";
}

// ─── 섹션별 매퍼 ──────────────────────────────────────────────────

function mapProfile(lines: string[]): ResumeDto["profile"] {
  const text = lines.join("\n");
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\d{2,3}[-.\s]\d{3,4}[-.\s]\d{4}/);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);

  return {
    name: lines[0] ?? "",
    title: lines[1] ?? "",
    subtitle: "",
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0] ?? "",
    location: "",
    availability: "협업 가능",
    bio: "", // AI 보완 대상
    image: "/images/profile.jpg",
    social: {
      github: githubMatch ? `https://${githubMatch[0]}` : "",
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
    },
  };
}

function mapCareer(lines: string[]): ResumeDto["career"]["experiences"] {
  const experiences: ResumeDto["career"]["experiences"] = [];
  let current: (typeof experiences)[0] | null = null;
  let expIndex = 0;

  for (const line of lines) {
    const periodMatch = line.match(/(\d{4}[.\-년]\d{1,2})\s*[~\-–]\s*(\S+)/);

    if (periodMatch) {
      if (current) experiences.push(current);
      current = {
        id: `exp-${++expIndex}`,
        company: line.split(periodMatch[0])[0].trim(),
        position: "",
        period: {
          start: normalizePeriod(periodMatch[1]),
          end: normalizePeriod(periodMatch[2]),
        },
        description: "", // AI 보완 대상
        achievements: [], // AI 보완 대상
      };
    } else if (current) {
      // 새 회사명 감지: (주), ㈜, 주식회사 등 패턴이면 현재 경력 마무리 후 pending 전환
      const isCompanyPattern = /^[㈜(주)]|^주식회사|^\(주\)|Co\.|Corp\.|Inc\.|Ltd\./i.test(line);
      if (isCompanyPattern && line.length < 40) {
        experiences.push(current);
        current = null;
        // → 다음 기간 패턴에서 새 경력으로 처리됨
        continue;
      }
      if (!current.position) {
        current.position = line;
      } else if (
        line.startsWith("·") ||
        line.startsWith("-") ||
        line.startsWith("•")
      ) {
        current.achievements.push(line.replace(/^[·\-•]\s*/, ""));
      } else if (!current.description && line.length > 3) {
        current.description = line;
      }
    }
  }
  if (current) experiences.push(current);
  return experiences;
}

function mapProjects(lines: string[]): ResumeDto["Project"]["cases"] {
  const cases: ResumeDto["Project"]["cases"] = [];
  let current: (typeof cases)[0] | null = null;
  let caseIndex = 0;

  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/\S+/);
    if (urlMatch && current) {
      current.urls = [
        ...(current.urls ?? []),
        { label: "서비스 보기", href: urlMatch[0] },
      ];
      continue;
    }

    if (/^[A-Z가-힣]/.test(line) && line.length < 60 && !line.includes(":")) {
      if (current) cases.push(current);
      current = {
        id: `proj-${++caseIndex}`,
        title: line,
        company: "",
        role: "", // AI 보완 대상
        description: "", // AI 보완 대상
        execution: "",
        tools: "",
        year: "",
        images: [],
      };
    } else if (current) {
      if (/기술|stack|사용|react|next|typescript|node/i.test(line)) {
        current.execution = normalizeStack(line);
      } else if (/도구|tool|notion|figma|jira/i.test(line)) {
        current.tools = normalizeStack(line);
      } else if (/\d{4}/.test(line) && line.length < 30) {
        current.year = line.trim();
      } else if (!current.description) {
        current.description = line;
      }
    }
  }
  if (current) cases.push(current);
  return cases;
}

function mapSkills(lines: string[]): ResumeDto["skills"]["categories"] {
  const categories: ResumeDto["skills"]["categories"] = [];
  let current: (typeof categories)[0] | null = null;

  for (const line of lines) {
    if (
      /frontend|백엔드|backend|ai|인프라|infrastructure|기획|pm/i.test(line)
    ) {
      if (current) categories.push(current);
      current = { name: line.trim(), skills: [] };
    } else if (current) {
      const skillNames = line
        .split(/[,·|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const name of skillNames) {
        current.skills.push({ name, level: inferSkillLevel(line) });
      }
    }
  }
  if (current) categories.push(current);
  return categories;
}

// ─── 메인 매퍼 ────────────────────────────────────────────────────

export function mapPdfToResumeDto(pdfText: string): ResumeDto {
  const sections = splitIntoSections(pdfText);

  return {
    meta: {
      siteTitle: "포트폴리오",
      siteDescription: "",
      siteUrl: "https://example.com",
      ogImage: "/images/og.png",
      author: "",
      keywords: [],
      theme: "toss",
    },
    profile: mapProfile(sections.profile),
    career: {
      summary: "",
      experiences: mapCareer(sections.career),
    },
    Project: {
      intro: "",
      cases: mapProjects(sections.projects),
    },
    skills: {
      categories: mapSkills(sections.skills),
    },
  };
}
```

---

## Step 5: ResumeDto 타입 정의

`src/types/resume-dto.ts` 생성:

```typescript
// data/resume.ts 의 as const 구조와 동일하게 맞춤
export interface ResumeDto {
  meta: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    ogImage: string;
    author: string;
    keywords: string[];
    theme: string;
  };
  profile: {
    name: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    bio: string;
    image: string;
    social: { github: string; linkedin: string };
  };
  career: {
    summary: string;
    experiences: Array<{
      id: string;
      company: string;
      position: string;
      period: { start: string; end: string };
      description: string;
      achievements: string[];
    }>;
  };
  Project: {
    intro: string;
    cases: Array<{
      id: string;
      title: string;
      company: string;
      role: string;
      description: string;
      execution: string;
      tools: string;
      year: string;
      urls?: Array<{ label: string; href: string }>;
      images: string[];
    }>;
  };
  skills: {
    categories: Array<{
      name: string;
      skills: Array<{
        name: string;
        level: "expert" | "advanced" | "intermediate";
      }>;
    }>;
  };
}
```

---

## Step 6: resume.ts 파일 생성기

`src/lib/pdf/resume-generator.ts` 생성:

```typescript
import type { ResumeDto } from "@/types/resume-dto";

export function generateResumeTsContent(data: ResumeDto): string {
  const json = JSON.stringify(data, null, 2);

  return `// data/resume.ts
// portfolio content single source — modify only this file to reflect changes everywhere.
// ⚠️ 이 파일을 수정한 후 /sample-page-create 로 page.tsx를 재생성하세요.
// 🤖 PDF에서 자동 생성됨

export const resume = ${
    json
      .replace(/"([^"]+)":/g, "$1:") // "key": → key:
      .replace(/: "expert"/g, ": 'expert' as const")
      .replace(/: "advanced"/g, ": 'advanced' as const")
      .replace(/: "intermediate"/g, ": 'intermediate' as const")
      .replace(/"/g, "'") // 나머지 " → '
  } as const;

export type Resume        = typeof resume;
export type Experience    = (typeof resume.career.experiences)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type ProjectCase   = (typeof resume.Project.cases)[number];
`;
}
```

---

## Step 7: 다운로드 API

`src/app/api/pdf/download/route.ts` 생성:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { generateResumeTsContent } from "@/lib/pdf/resume-generator";
import type { ResumeDto } from "@/types/resume-dto";

export async function POST(req: NextRequest) {
  const data: ResumeDto = await req.json();
  const content = generateResumeTsContent(data);

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="resume.ts"',
    },
  });
}
```

---

## 완료 체크리스트

- [ ] `POST /api/pdf/parse` — PDF 업로드 및 DTO 반환
- [ ] `POST /api/pdf/download` — resume.ts 파일 다운로드
- [ ] `src/types/resume-dto.ts` — DTO 타입 정의
- [ ] `src/lib/pdf/section-classifier.ts` — 섹션 분류
- [ ] `src/lib/pdf/dto-mapper.ts` — DTO 매핑
- [ ] `src/lib/pdf/resume-generator.ts` — resume.ts 생성
- [ ] 에러 핸들링 (파싱 실패, 용량 초과, 텍스트 없음)

---

## Rules

- **구현 프로젝트는 `c:\work\jione-transformer`** — `jione-transformer`에 모든 코드를 작성한다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
- 리뷰 완료 후 수정사항이 있으면 **confirm 없이 바로 진행**한다 — 사용자에게 진행 여부를 묻지 않는다
