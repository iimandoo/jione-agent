# cursor-agent — AI 포트폴리오 자동 구축 커맨드 시스템

> Claude Code 슬래시 커맨드 8개로 **토스 스타일 Next.js 포트폴리오**를 자동 생성합니다.

---

## 이 프로젝트는?

포트폴리오를 만들 때 반복되는 구조 설계·컴포넌트 작성·설정 작업을 **Claude Code 커맨드**로 자동화한 템플릿 시스템입니다.

`/project-init` → `/toss-theme-on` → `/content-setup` → `/sample-page-create` 순서로 실행하면, **토스(Toss) 디자인 시스템** 기반의 단일 페이지 포트폴리오가 완성됩니다. 콘텐츠는 `resume.ts` 파일 하나만 수정하면 전체에 반영됩니다.

---

## 출력 결과

커맨드 실행 후 생성되는 포트폴리오:

- **섹션 구조**: Hero → About → Project(프로젝트 + 이미지 모달) → Contact
- **디자인**: 토스 스타일 (Pretendard 폰트, 토스 블루 `#3182F6`, 부드러운 그림자)
- **기술 스택**: Next.js 16 + React 19 + styled-components (Tailwind 미사용)
- **콘텐츠 관리**: `src/data/resume.ts` 단일 소스
- **단일 페이지**: 별도 라우트 없음, `/` 한 페이지에 모든 섹션 스크롤

---

## 사전 요건

- [Claude Code](https://github.com/anthropics/claude-code) 설치
- Node.js 18.17 이상
- npm

---

## 빠른 시작

### 1. 이 리포지토리를 클론 또는 다운로드

```bash
git clone https://github.com/iimandoo/cursor-agent.git
cd cursor-agent
```

### 2. Claude Code로 실행

```bash
claude
```

### 3. 커맨드를 순서대로 실행

```
/project-init
/toss-theme-on
/content-setup
/sample-page-create
```

Phase 1(4개) 완료 후 `http://localhost:3000`에서 포트폴리오 확인 가능.

---

## 커맨드 목록

### 🟢 Phase 1 — 포트폴리오 완성 (필수)

| #   | 커맨드                | 역할                                                              |
| --- | --------------------- | ----------------------------------------------------------------- |
| 1   | `/project-init`       | Next.js 프로젝트 생성, 의존성 설치, 폴더 구조 생성                |
| 2   | `/toss-theme-on`      | 토스 디자인 토큰 적용 (컬러, 타이포그래피, 쉐도우, ThemeProvider) |
| 3   | `/content-setup`      | `resume.ts` 존재 확인 후 누락 섹션 자동 보완                      |
| 4   | `/sample-page-create` | 섹션 컴포넌트 생성 (Hero / About / Project / Contact)             |

### 🔵 Phase 2 — 배포 & 운영 (선택)

| #   | 커맨드                 | 역할                                         |
| --- | ---------------------- | -------------------------------------------- |
| 5   | `/seo-optimize`        | 메타데이터, OG 태그, sitemap.xml, robots.txt |
| 6   | `/vercel-deploy`       | Vercel 배포 + GitHub 자동 배포 파이프라인    |
| 7   | `/admin-logging-setup` | 방문자 로그 수집 + `/admin` 대시보드         |
| 8   | `/monitoring-setup`    | Google Analytics + 성능 모니터링             |

---

## 프로젝트 구조

```
cursor-agent/
├── .claude/
│   ├── commands/               # 슬래시 커맨드 정의 파일 (핵심)
│   │   ├── 1.project-init.md
│   │   ├── 2.toss-theme-on.md
│   │   ├── 3.content-setup.md
│   │   ├── 4.sample-page-create.md
│   │   ├── 5.seo-optimize.md
│   │   ├── 6.vercel-deploy.md
│   │   ├── 7.admin-logging-setup.md
│   │   └── 8.monitoring-setup.md
│   └── README.md               # 커맨드 시스템 상세 설명
├── data/
│   └── resume.ts               # 샘플 콘텐츠 데이터
└── jione-portfolio/            # 커맨드 실행 후 생성되는 포트폴리오 결과물
    └── src/
        ├── app/
        │   └── page.tsx        # 단일 페이지 메인
        ├── components/
        │   └── sections/       # hero / about / Project / contact
        ├── data/
        │   └── resume.ts       # 콘텐츠 단일 소스 (이것만 수정)
        └── styles/
            ├── theme.ts        # 토스 디자인 토큰
            └── provider.tsx    # ThemeProvider
```

---

## 콘텐츠 수정 방법

포트폴리오 내용은 `jione-portfolio/src/data/resume.ts` 하나만 수정합니다.

```typescript
export const resume = {
  meta: { siteTitle, siteDescription, siteUrl, ... },  // SEO
  profile: { name, title, email, phone, bio, ... },     // 기본 정보
  career: { summary, experiences: [...] },              // 경력
  skills: { categories: [...] },                        // 기술 스택
  Project: {
    intro: '...',
    cases: [
      {
        id, title, company,
        Project,      // 비즈니스 관점 성과
        execution,   // 기술 실행 방식
        tools?,      // 사용 도구 (선택)
        images?,     // 스크린샷 경로 배열 (선택, 클릭 시 모달)
      },
    ],
  },
} as const;
```

---

## 주요 설계 결정

| 항목        | 결정                           | 이유                                                       |
| ----------- | ------------------------------ | ---------------------------------------------------------- |
| 스타일링    | styled-components              | Tailwind 없이 토스 디자인 토큰을 ThemeProvider로 일관 관리 |
| 페이지 구조 | 단일 페이지                    | 포트폴리오 특성상 라우팅 불필요, 스크롤 UX 최적            |
| 데이터 관리 | `resume.ts` 단일 소스          | JSON 분리 없이 타입 안전하게 `as const` + 타입 추출        |
| 이미지 모달 | 순수 React + styled-components | 외부 라이브러리 없이 구현, keyframes 애니메이션 포함       |
| 폰트        | Pretendard (CDN)               | 토스 스타일의 한국어 최적화 폰트                           |

---

## 라이선스

MIT
