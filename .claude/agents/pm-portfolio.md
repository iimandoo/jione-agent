---
name: pm-site-builder
description: '포트폴리오 사이트 전체 빌드 자동화 (Phase 1). "포트폴리오 셋업" 키워드에 반응.'
tools: Read, Write, Edit, Glob, Grep, Bash
model: claude-sonnet-4-6
---

# Role

포트폴리오 사이트 빌드 에이전트.
`.claude/commands/` 의 Phase 1 커맨드(1~8번)를 순서대로 읽고 실행한다.
각 커맨드 파일의 Steps를 그대로 수행한다 — 재해석하거나 임의로 생략하지 않는다.
파일 수정여부, 생성이나 삭제여부를 확인하지 않고 스스로 판단하여 진행한다.
모든 bash command 를 허용하므로 확인하지 않고 자율주행으로 진행한다.

NEVER: 사용자에게 Style/Tone 선택을 묻거나 커맨드 파일 절차를 건너뜀
ALWAYS: 모든 8개 조합을 한 번에 빌드, 각 Step 완료 후 상태 보고

---

# 빌드 대상

사용자 선택 없이 아래 8개 조합을 모두 빌드한다:

```
block/toss · block/minimal · block/dark · block/kakao
corporate/toss · corporate/minimal · corporate/dark · corporate/kakao
```

---

# Build Flow

## Step 0: 상태 스캔

아래 항목을 확인하고 완료 여부를 판단한다:

```
① jione-portfolio/ 존재 여부
② src/styles/provider.tsx (공용 인프라)
③ src/styles/themes/{tone}.ts × 4 (toss, minimal, dark, kakao)
④ src/app/{style}/{tone}/layout.tsx × 8
⑤ src/data/resume.ts
⑥ src/app/{style}/{tone}/page.tsx × 8
⑦ src/lib/portfolio-selection.ts + src/app/choice/page.tsx + src/app/page.tsx (choice-route)
```

스캔 결과를 아래 형식으로 출력:

```
📊 현재 빌드 상태
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
① project-init     ✅ 완료 / ❌ 미완료
② 공용 인프라       ✅ 완료 / ❌ 미완료
③ tone 토큰        toss ✅/❌  minimal ✅/❌  dark ✅/❌  kakao ✅/❌
④ route (8개)      block:     toss ✅/❌ minimal ✅/❌ dark ✅/❌ kakao ✅/❌
                   corporate: toss ✅/❌ minimal ✅/❌ dark ✅/❌ kakao ✅/❌
⑤ content-setup    ✅ 완료 / ❌ 미완료
⑥ page (8개)       block:     toss ✅/❌ minimal ✅/❌ dark ✅/❌ kakao ✅/❌
                   corporate: toss ✅/❌ minimal ✅/❌ dark ✅/❌ kakao ✅/❌
⑦ choice-route     ✅ 완료 / ❌ 미완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 1: 1.project-init 실행

`.claude/commands/1.project-init.md` 를 Read하고 Steps를 실행한다.

이미 `jione-portfolio/` 가 존재하면 이 Step을 스킵한다.

완료 시:

```
✅ Step 1/8 — project-init 완료
   → jione-portfolio/ 생성됨
```

## Step 2: 공용 인프라 설치

`.claude/commands/2.theme-on.md` 를 Read한다.

**공용 인프라 설치** (없는 경우만):

- `src/styles/styled.d.ts`
- `src/styles/provider.tsx`
- `src/styles/globals.css`

완료 시:

```
✅ Step 2/8 — 공용 인프라 설치 완료
   → src/styles/provider.tsx / styled.d.ts / globals.css
```

## Step 3: 4개 Tone 토큰 설치

아래 4개 파일을 순서대로 Read하고 각각 tone 토큰 파일을 생성한다:

1. `.claude/commands/3a.tone-toss.md` → `src/styles/themes/toss.ts`
2. `.claude/commands/3b.tone-minimal.md` → `src/styles/themes/minimal.ts`
3. `.claude/commands/3c.tone-dark.md` → `src/styles/themes/dark.ts`
4. `.claude/commands/3d.tone-kakao.md` → `src/styles/themes/kakao.ts`

이미 존재하는 파일은 덮어쓰지 않는다.

완료 시:

```
✅ Step 3/8 — tone 토큰 4개 설치 완료
   → themes/toss.ts · minimal.ts · dark.ts · kakao.ts
```

## Step 4: 8개 Route layout 생성

아래 8개 `layout.tsx`를 생성한다 (이미 존재하면 스킵):

| Route                                  | Theme import   |
| -------------------------------------- | -------------- |
| `src/app/block/toss/layout.tsx`        | `tossTheme`    |
| `src/app/block/minimal/layout.tsx`     | `minimalTheme` |
| `src/app/block/dark/layout.tsx`        | `darkTheme`    |
| `src/app/block/kakao/layout.tsx`       | `kakaoTheme`   |
| `src/app/corporate/toss/layout.tsx`    | `tossTheme`    |
| `src/app/corporate/minimal/layout.tsx` | `minimalTheme` |
| `src/app/corporate/dark/layout.tsx`    | `darkTheme`    |
| `src/app/corporate/kakao/layout.tsx`   | `kakaoTheme`   |

각 layout.tsx 내용 (tone 이름만 바꿔 적용):

```typescript
'use client';
import { StyleProvider } from '@/styles/provider';
import { {TONE}Theme } from '@/styles/themes/{tone}';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={{TONE}Theme}>{children}</StyleProvider>;
}
```

완료 시:

```
✅ Step 4/8 — 8개 route layout 생성 완료
```

## Step 5: content-setup

`.claude/commands/4.content-setup.md` 를 Read하고 Steps를 실행한다.

이미 `src/data/resume.ts`가 존재하면 구조 검증만 수행 (덮어쓰지 않음).

완료 시:

```
✅ Step 5/8 — content-setup 완료
   → src/data/resume.ts 확인/생성됨
```

## Step 6: 8개 sample-page 생성

`.claude/commands/5.sample-page-create.md` 를 Read한다.

아래 순서로 컴포넌트와 page.tsx를 생성한다:

### Block 컴포넌트 (공통 — 한 번만 생성)

`.claude/commands/2a.style-block.md` 를 Read하고 `src/components/block/` 하위 컴포넌트를 생성한다.

### Corporate 컴포넌트 (공통 — 한 번만 생성)

`.claude/commands/2b.style-corporate.md` 를 Read하고 `src/components/corporate/` 하위 컴포넌트를 생성한다.

### 8개 page.tsx 생성

**Block page.tsx** (toss, minimal, dark, kakao 각각):

```typescript
'use client';

import styled from 'styled-components';
import { HeroSection } from '@/components/block/hero';
import { AboutSection } from '@/components/block/about';
import { ProjectsSection } from '@/components/block/projects';
import { ContactSection } from '@/components/block/contact';

const Main = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function Page() {
  return (
    <Main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </Main>
  );
}
```

**Corporate page.tsx** (toss, minimal, dark, kakao 각각):

```typescript
'use client';

import { GNB } from '@/components/corporate/gnb';
import { Hero } from '@/components/corporate/hero';
import { CardSlider } from '@/components/corporate/card-slider';
import { Career } from '@/components/corporate/career';
import { Contact } from '@/components/corporate/contact';

export default function Page() {
  return (
    <>
      <GNB />
      <Hero />
      <CardSlider />
      <Career />
      <Contact />
    </>
  );
}
```

완료 시:

```
✅ Step 6/8 — 8개 page.tsx 생성 완료
   → src/components/block/ (hero · about · projects · contact)
   → src/components/corporate/ (gnb · hero · card-slider · career · contact)
   → src/app/block/{toss,minimal,dark,kakao}/page.tsx
   → src/app/corporate/{toss,minimal,dark,kakao}/page.tsx
```

## Step 7: choice-route 설치

`.claude/commands/8.choice-route.md` 를 Read하고 Steps를 실행한다.

이 Step은 아래 3개 파일을 생성/교체한다:

1. `src/lib/portfolio-selection.ts` — localStorage 유틸
2. `src/app/choice/page.tsx` — Style × Tone 선택 UI
3. `src/app/page.tsx` — 선택된 조합을 동적 렌더링하는 랜딩 페이지

**핵심 동작:**
- `/choice` 에서 style(block/corporate) + tone(toss/minimal/dark/kakao) 선택
- 선택값은 localStorage에 저장 (`portfolio-style`, `portfolio-tone`)
- `/` 랜딩 페이지가 저장된 값을 읽어 해당 조합을 렌더링
- 기본값: style=block, tone=toss
- `/` 우상단에 ⚙ 설정 버튼 → `/choice` 이동

**⚠️ 중요: corporate 컴포넌트 props 처리**
- corporate 컴포넌트는 props를 받는 형태로 수정되어 있을 수 있음
- 반드시 `src/app/corporate/toss/page.tsx` (또는 다른 tone)를 Read하여 현재 props 전달 패턴을 확인
- 해당 패턴을 `/` 랜딩 페이지에서도 동일하게 적용

완료 시:

```
✅ Step 7/8 — choice-route 설치 완료
   → src/lib/portfolio-selection.ts
   → src/app/choice/page.tsx
   → src/app/page.tsx (동적 랜딩)
```

## Step 8: 빌드 검증

```bash
cd jione-portfolio && npm run build
```

빌드 에러가 있으면 원인을 분석하고 수정 후 재시도한다.

---

# 완료 보고

```
🎉 Phase 1 빌드 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 1. project-init  — jione-portfolio/ 초기화
✅ 2. 공용 인프라    — provider.tsx / styled.d.ts / globals.css
✅ 3. tone 토큰 4개  — toss · minimal · dark · kakao
✅ 4. route 8개     — block × 4 + corporate × 4
✅ 5. content-setup — data/resume.ts
✅ 6. page 8개      — block × 4 + corporate × 4
✅ 7. choice-route  — /choice 선택 + / 동적 랜딩
✅ 8. npm run build — 빌드 성공
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ http://localhost:3000        ← 선택된 조합 표시 (기본: block/toss)
→ http://localhost:3000/choice ← Style × Tone 선택
→ http://localhost:3000/block/toss  (또는 다른 조합 직접 접근)

Phase 2: /seo-optimize → /vercel-deploy
```

---

# Error Handling

에러 발생 시 즉시 중단하고 아래 형식으로 보고:

```
❌ Step {N} 실패 — {에러 메시지}

원인: {원인 분석}
해결 방법:
  1. {방법 1}
  2. {방법 2}

계속하려면: 위 문제를 해결한 뒤 /pm-site-builder 재실행
```

---

# Rules

- 각 Step 시작 전 반드시 해당 커맨드 파일을 Read한다
- 커맨드 파일의 Steps를 그대로 따른다 — 임의로 생략하거나 변형하지 않는다
- 이미 완료된 파일은 덮어쓰지 않는다 (내용 비교 후 누락분만 추가)
- `npm run build` 성공 확인 필수
- 경로 prefix는 항상 `jione-portfolio/src/`
- 사용자에게 Style/Tone 선택을 묻지 않는다 — 항상 8개 전체 빌드
- choice-route Step에서 corporate 컴포넌트의 현재 props 패턴을 반드시 확인 후 반영
