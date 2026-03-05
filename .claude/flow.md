# Portfolio Agent — 전체 플로우 가이드

> Claude Code 슬래시 커맨드 8개로 **멀티 테마 Next.js 포트폴리오**를 자동 생성합니다.

---

## 개요

`data/resume.ts` 파일에 콘텐츠를 채우고 커맨드를 순서대로 실행하면, **테마별 독립 라우트**를 가진 포트폴리오가 완성됩니다.

```
/          ← 테마 선택 랜딩 페이지
/toss      ← Toss 스타일 (Blue)
/minimal   ← 미니멀 스타일 (흑백)
/dark      ← 다크 스타일 (Purple glow)
/kakao     ← 카카오 스타일 (Yellow)
/naver     ← 네이버 스타일 (Green)
```

각 라우트는 **동일한 섹션 컴포넌트**를 공유하며, 테마 토큰(`props.theme.*`)으로 스타일이 분기됩니다.

---

## 사전 요건

| 항목 | 버전 |
|------|------|
| [Claude Code](https://github.com/anthropics/claude-code) | 최신 |
| Node.js | 18.17 이상 |
| npm | — |

---

## 전체 플로우

```
[이 리포지토리 클론]
        │
        ▼
┌─────────────────────────────────────────────────┐
│  🟢 Phase 1 — 포트폴리오 완성 (필수, ~40분)      │
│                                                 │
│  /1.project-init                                │
│       ↓                                         │
│  /2.toss-theme-on  ← 필수 (provider 생성)       │
│  /2b.theme-minimal ← 선택                       │
│  /2c.theme-dark    ← 선택                       │
│  /2d.theme-kakao   ← 선택                       │
│  /2e.theme-naver   ← 선택                       │
│       ↓  (1개 이상 실행)                         │
│  /3.content-setup                               │
│       ↓                                         │
│  /4.sample-page-create                          │
└─────────────────────────────────────────────────┘
        │
        ▼
  ✅ localhost:3000 에서 포트폴리오 확인
        │
        ▼
┌─────────────────────────────────────────────────┐
│  🔵 Phase 2 — 배포 & 운영 (선택, 순서 무관)      │
│                                                 │
│  /5.seo-optimize                                │
│  /6.vercel-deploy                               │
│  /7.admin-logging-setup                         │
│  /8.monitoring-setup                            │
└─────────────────────────────────────────────────┘
```

---

## Phase 1 — 상세

### 1. `/project-init` — 프로젝트 초기화

**역할**: Next.js 16 프로젝트 생성 + 멀티 테마 폴더 구조 구축

**생성 결과:**
```
jione-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (Pretendard CDN)
│   │   ├── page.tsx            # 테마 선택 랜딩 (5개 버튼)
│   │   ├── toss/layout.tsx     # 플레이스홀더 (2.toss-theme-on 이 교체)
│   │   ├── minimal/layout.tsx
│   │   ├── dark/layout.tsx
│   │   ├── kakao/layout.tsx
│   │   ├── naver/layout.tsx
│   │   └── api/admin/logs/
│   ├── components/sections/    # 빈 폴더 (4.sample-page-create 가 채움)
│   ├── data/                   # 빈 폴더 (3.content-setup 이 채움)
│   ├── lib/memory-db.ts
│   ├── actions/logging.ts
│   ├── proxy.ts                # Next.js 16 proxy (middleware 대신)
│   └── styles/
│       └── globals.css
├── next.config.ts              # styledComponents 컴파일러 활성화
└── .env.local
```

**핵심 설정:**
- `next.config.ts` → `compiler.styledComponents: true` (Babel 없이 SSR 지원)
- `src/proxy.ts` 사용 (Next.js 16에서 `middleware.ts`는 deprecated)

**재실행 옵션:**
- 폴더 존재 시 → "초기화 후 재생성" 또는 "콘텐츠만 재설정" 선택

---

### 2. 테마 커맨드 (1개 이상 필수)

> ⚠️ **`/2.toss-theme-on` 은 반드시 먼저 실행** — `provider.tsx`, `styled.d.ts`를 생성합니다.
> 나머지 테마는 이 파일들을 재사용합니다.

#### `/2.toss-theme-on` — Toss 테마 (필수)

생성 파일:

| 파일 | 역할 |
|------|------|
| `src/styles/themes/toss.ts` | Toss 디자인 토큰 (`#3182F6` Blue) |
| `src/styles/provider.tsx` | **공용** StyleProvider (SSR FOUC 방지) |
| `src/styles/styled.d.ts` | DefaultTheme 구조 인터페이스 정의 |
| `src/styles/globals.css` | 전역 CSS 리셋 |
| `src/app/toss/layout.tsx` | `<StyleProvider theme={tossTheme}>` 래퍼 |

**`styled.d.ts` 구조** (literal 타입 충돌 방지):
```typescript
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: { background: string; foreground: string; primary: string; ... [key: string]: string };
    radius: { xs: string; sm: string; md: string; lg: string; xl: string };
    shadows: { sm: string; md: string; lg: string };
    fonts: { primary: string };
    typography: { h1: {...}; h2: {...}; body: {...}; small: {...} };
  }
}
```
> `[key: string]: string` — kakao의 `nav`, `badge` 같은 추가 토큰 허용

---

#### `/2b.theme-minimal` — Minimal 테마 (선택)
- 배경 흰색 · 강조색 검정 · 폰트 weight 300 · 각진 모서리 (radius 0)
- 생성: `themes/minimal.ts`, `app/minimal/layout.tsx`

#### `/2c.theme-dark` — Dark 테마 (선택)
- 배경 `#0F1117` · 강조색 `#7C3AED` (Purple) · 그림자 purple glow
- `dark/layout.tsx`에 `backgroundColor: '#0F1117'` wrapper 포함

#### `/2d.theme-kakao` — Kakao 테마 (선택)
- 배경 흰색 · 강조색 `#FEE500` (Yellow) · 다크 nav `#1A1A1A`
- 추가 토큰: `nav`, `navForeground`, `badge`, `badgeForeground`
- `primaryForeground: '#1A1A1A'` (Yellow 배경 위 검정 텍스트 필수)

#### `/2e.theme-naver` — Naver 테마 (선택)
- Hero/Contact 다크(`#0D0D0D`) ↔ About/Project 화이트 교차
- 강조색 `#03C75A` (Naver Green) · 타이포 Light weight (300)
- Hero 배경은 테마 토큰이 아닌 하드코딩 설계 결정

---

### 3. `/content-setup` — 콘텐츠 입력

**역할**: `resume.ts` 존재 확인 → 누락 섹션 보완

**탐색 순서:**
1. `jione-portfolio/src/data/resume.ts` 확인
2. 없으면 `data/resume.ts` (루트) 확인 → 있으면 구조 변환 후 복사
3. 둘 다 없으면 **작업 중단** (파일을 먼저 만들도록 안내)

**`resume.ts` 구조 (단일 소스):**
```typescript
export const resume = {
  meta:    { siteTitle, siteDescription, siteUrl, ogImage, author, keywords, theme },
  profile: { name, title, subtitle, email, phone, bio, image, social, availability },
  career:  { summary, experiences: [{ id, company, position, period, description, highlights, skills }] },
  skills:  { categories: [{ name, skills: [{ name, level, years }] }] },
  projects: [{ id, title, year, company, role, description, highlights, tags, image, screenshots }],
} as const;

export type Resume = typeof resume;
export type Experience = (typeof resume.career.experiences)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type Project = (typeof resume.projects)[number];
```

**이미지 경로**: `public/projects/` 하위에 스크린샷 추가
- `screenshots: []` → 이미지 패널 미표시
- `screenshots: [{ src, alt }]` (1장) → 단일 이미지
- `screenshots: [...]` (2장+) → 슬라이더

---

### 4. `/sample-page-create` — 페이지 생성

**역할**: 섹션 컴포넌트 + 각 테마 page.tsx 생성

**Step 0**: 설치된 테마 확인 후 생성할 테마 선택
- 여러 테마 동시 선택 가능

**생성 파일:**

| 파일 | 역할 |
|------|------|
| `src/components/sections/hero.tsx` | 풀스크린 히어로 (Framer Motion stagger) |
| `src/components/sections/about.tsx` | 경력 타임라인 + 기술 스택 그리드 |
| `src/components/sections/Project.tsx` | 프로젝트 카드 (이미지 슬라이더 + 클릭 모달) |
| `src/components/sections/contact.tsx` | 이메일·전화 텍스트 링크 |
| `src/app/{theme}/page.tsx` | 선택 테마 포트폴리오 페이지 |

**섹션 컴포넌트 규칙:**
- `props.theme.*` 토큰만 사용 → 모든 테마에서 자동 분기
- Hero: `animate` (페이지 로드 시 stagger)
- About/Project/Contact: `whileInView` + `viewport={{ once: true }}`
- 이미지: `next/image` + `fill` + `objectFit: 'cover'`
- 이미지 hover: `cursor: zoom-in` 금지, dim overlay `rgba(0,0,0,0.08)` 사용

**Kakao page.tsx 특이사항:**
- 섹션 컴포넌트 위에 다크 NavBar 추가 (페이지 레벨 처리)

---

## Phase 2 — 상세

> Phase 1 완료 후 독립적으로 실행 가능 (순서 무관)

### `/5.seo-optimize`
- `resume.meta` 기반 Next.js Metadata API 설정
- `sitemap.xml`, `robots.txt` 생성
- OG 이미지, Twitter Card 메타태그

### `/6.vercel-deploy`
- `vercel.json` 설정
- GitHub Actions CI/CD 파이프라인
- 환경 변수 설정 가이드

### `/7.admin-logging-setup`
- 방문자 로그 수집 (in-memory DB)
- `/admin` 대시보드 페이지 활성화
- 페이지별 방문 통계

### `/8.monitoring-setup`
- Google Analytics 4 연동
- Core Web Vitals 모니터링
- `web-vitals` 라이브러리 활용

---

## 결과물 구조

```
jione-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx               ← 루트 레이아웃 (Pretendard, Material Symbols CDN)
│   │   ├── page.tsx                 ← 테마 선택 랜딩
│   │   ├── toss/
│   │   │   ├── layout.tsx           ← StyleProvider theme={tossTheme}
│   │   │   └── page.tsx             ← /toss 포트폴리오
│   │   ├── kakao/
│   │   │   ├── layout.tsx           ← StyleProvider theme={kakaoTheme}
│   │   │   └── page.tsx             ← /kakao 포트폴리오 (NavBar 포함)
│   │   ├── minimal/ dark/ naver/    ← 동일 패턴
│   │   └── api/admin/logs/
│   ├── components/
│   │   └── sections/
│   │       ├── hero.tsx
│   │       ├── about.tsx
│   │       ├── Project.tsx          ← 이미지 슬라이더 + 모달
│   │       └── contact.tsx
│   ├── data/
│   │   └── resume.ts                ← 콘텐츠 단일 소스 (이것만 수정)
│   ├── lib/memory-db.ts
│   ├── actions/logging.ts
│   ├── proxy.ts
│   └── styles/
│       ├── globals.css
│       ├── styled.d.ts              ← DefaultTheme 구조 인터페이스
│       ├── provider.tsx             ← 공용 StyleProvider (SSR)
│       └── themes/
│           ├── toss.ts
│           ├── minimal.ts
│           ├── dark.ts
│           ├── kakao.ts
│           └── naver.ts
├── public/
│   ├── projects/                    ← 프로젝트 스크린샷 (resume.ts에서 참조)
│   └── images/                     ← 프로필, OG 이미지
├── next.config.ts                   ← styledComponents: true
└── .env.local
```

---

## 콘텐츠 수정

포트폴리오 내용은 **`jione-portfolio/src/data/resume.ts` 하나만** 수정합니다.

```typescript
// 이름, 역할, 연락처
profile: { name: '홍길동', title: 'Frontend Engineer', email: '...', ... }

// 경력 추가
career.experiences: [{ company: '회사명', period: { start: '2023-01', end: 'present' }, ... }]

// 프로젝트 추가 (이미지는 public/projects/ 에 파일 추가 후 경로 입력)
projects: [{ title: '프로젝트명', screenshots: [{ src: '/projects/img.png', alt: '설명' }], ... }]
```

저장 후 `npm run dev` 재시작 없이 자동 반영됩니다.

---

## 자주 묻는 것들 / 트러블슈팅

### `styled.d.ts` TypeScript 오류
`extends typeof tossTheme`은 ambient declaration에서 사용 불가.
→ 구조적 인터페이스 (`string`, `number` 타입)로 정의해야 함. (이미 반영됨)

### Kakao 테마 타입 오류 (`foreground` 타입 불일치)
`as const`로 인한 literal 타입 충돌.
→ `styled.d.ts`에서 `[key: string]: string` index signature 추가로 해결. (이미 반영됨)

### `middleware.ts` deprecated 경고
Next.js 16에서 `middleware.ts` → `proxy.ts`로 이름 변경 필요.
→ 내부 함수명도 `middleware` → `proxy`로 변경. (이미 반영됨)

### 이미지가 보이지 않음
`public/projects/` 폴더에 스크린샷 파일이 없는 경우.
→ 파일 추가 전까지 이미지 영역은 배경색(secondary)으로 표시됨.

### 테마 추가 후 빌드 에러
테마 커맨드 실행 순서: `/2.toss-theme-on` 먼저 → 나머지 테마 순서 무관.
`provider.tsx`, `styled.d.ts`는 toss 커맨드가 생성하므로 반드시 선행 실행.

---

## 빠른 시작 요약

```bash
# 1. 클론
git clone https://github.com/iimandoo/cursor-agent.git
cd cursor-agent

# 2. 콘텐츠 미리 작성 (선택)
# data/resume.ts 편집 → 3.content-setup 이 자동으로 jione-portfolio/src/data/resume.ts 로 변환

# 3. Claude Code 실행
claude

# 4. 커맨드 순서대로 실행
/1.project-init
/2.toss-theme-on        # 필수 (provider 생성)
/2d.theme-kakao         # 선택 — 원하는 테마 추가
/3.content-setup
/4.sample-page-create   # 테마 선택 후 페이지 생성

# 5. 로컬 확인
cd jione-portfolio && npm run dev
# http://localhost:3000        — 테마 선택 랜딩
# http://localhost:3000/toss   — Toss 포트폴리오
# http://localhost:3000/kakao  — Kakao 포트폴리오
```
