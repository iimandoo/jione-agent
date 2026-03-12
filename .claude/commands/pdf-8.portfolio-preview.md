# pdf-8: 포트폴리오 자동 생성 & 미리보기

Portfolio Builder에서 PDF 변환 완료 후, 변환된 데이터를 기반으로 포트폴리오를 자동 생성하고 미리보기한다.
기존 pm-portfolio(pm-site-builder)에서 구축한 block/corporate 컴포넌트와 theme 시스템을 재사용한다.

---

## 담당 역할

| 역할      | 미션                                                                |
| --------- | ------------------------------------------------------------------- |
| 기획자    | 포트폴리오 미리보기 UX 플로우 설계, 와이어프레임                    |
| FE 개발자 | 미리보기 페이지 UI 구현, 8개 조합 선택 그리드, 동적 렌더링          |
| BE 개발자 | 포트폴리오 빌드 API, resume.ts 데이터 → 컴포넌트 주입 로직         |
| 디자이너  | 미리보기 썸네일 레이아웃, 선택 UI 디자인, 반응형 그리드             |
| QA        | 8개 조합 렌더링 검증, resume.ts 데이터 반영 확인, 반응형 테스트     |

---

## 인증 정책

> **이 페이지는 공개** — 로그인 없이 누구나 접근 가능.
> ZIP 다운로드만 카카오 로그인 필요 (pdf-9 참고).

---

## 선행 조건

- `pdf-4.frontend.md` (FE UI) 완료 — `/pdf/result` 페이지 존재
- `data/resume.ts` 파일이 변환 완료 상태
- `jione-portfolio/` 프로젝트가 빌드되어 있어야 함 (pm-site-builder로 생성)

---

## UX 플로우

```
/pdf/result (변환 결과 미리보기 + 편집 페이지)
  │
  ├→ [resume.ts 다운로드] 버튼 (기존)
  │
  └→ [포트폴리오 미리보기] 버튼 (NEW)
       │
       ▼
/pdf/portfolio-preview
  │
  ├→ Style × Tone 선택 그리드 (8개 조합 — 라이브 썸네일)
  │   ┌────────────────────────────────────────────────────────┐
  │   │  Block                                                 │
  │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
  │   │  │▒▒▒▒▒▒▒▒▒▒│ │░░░░░░░░░░│ │██████████│ │▓▓▓▓▓▓▓▓▓▓│  │
  │   │  │▒ 축소된  ▒│ │░ 축소된  ░│ │█ 축소된  █│ │▓ 축소된  ▓│  │
  │   │  │▒포트폴리오▒│ │░포트폴리오░│ │█포트폴리오█│ │▓포트폴리오▓│  │
  │   │  │▒ 렌더링  ▒│ │░ 렌더링  ░│ │█ 렌더링  █│ │▓ 렌더링  ▓│  │
  │   │  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤  │
  │   │  │🔵 Toss   │ │⚫ Minimal│ │🟣 Dark   │ │🟡 Kakao  │  │
  │   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
  │   │                                                        │
  │   │  Corporate                                             │
  │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
  │   │  │▒▒▒▒▒▒▒▒▒▒│ │░░░░░░░░░░│ │██████████│ │▓▓▓▓▓▓▓▓▓▓│  │
  │   │  │▒ 축소된  ▒│ │░ 축소된  ░│ │█ 축소된  █│ │▓ 축소된  ▓│  │
  │   │  │▒포트폴리오▒│ │░포트폴리오░│ │█포트폴리오█│ │▓포트폴리오▓│  │
  │   │  │▒ 렌더링  ▒│ │░ 렌더링  ░│ │█ 렌더링  █│ │▓ 렌더링  ▓│  │
  │   │  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤  │
  │   │  │🔵 Toss   │ │⚫ Minimal│ │🟣 Dark   │ │🟡 Kakao  │  │
  │   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
  │   └────────────────────────────────────────────────────────┘
  │   * 각 카드 = 실제 포트폴리오를 CSS scale(0.22)로 축소 렌더링
  │   * 사용자의 resume 데이터가 썸네일에 실시간 반영됨
  │
  ├→ 선택된 조합 미리보기 (iframe 또는 동적 렌더링)
  │   - resume.ts 데이터가 실시간으로 반영됨
  │   - 반응형 미리보기 (데스크탑/태블릿/모바일 전환)
  │
  └→ [ZIP 다운로드] 버튼 → pdf-9 기능으로 연결
```

---

## 구현 Steps

### Step 1: 기획 — UX 플로우 확정

**기획자 미션**:

1. `/pdf/result` 페이지에 "포트폴리오 미리보기" 버튼 위치 결정
2. `/pdf/portfolio-preview` 페이지 와이어프레임 작성:
   - 상단: Style × Tone 선택 그리드 (2행 × 4열)
   - 하단: 선택된 조합의 미리보기 영역
   - 우측 하단: "ZIP 다운로드" 버튼
3. 기본 선택값: block/toss

### Step 2: BE — 포트폴리오 빌드 API

**BE 개발자 미션**:

1. `src/lib/portfolio/builder.ts` 생성:
   ```typescript
   // resume.ts 데이터를 받아 포트폴리오 렌더링에 필요한 props 생성
   export function buildPortfolioProps(resumeData: ResumeDto) {
     return {
       profile: resumeData.profile,
       career: resumeData.career,
       projects: resumeData.Project,
       skills: resumeData.skills,
       meta: resumeData.meta,
     };
   }
   ```

2. `POST /api/portfolio/build` 엔드포인트 (`src/app/api/portfolio/build/route.ts`):
   - Request: `{ resumeData: ResumeDto, style: string, tone: string }`
   - 변환된 resume.ts 데이터를 포트폴리오 컴포넌트에 주입할 props 구조로 변환
   - Response: `{ success: true, props: PortfolioProps }`

3. jione-portfolio의 컴포넌트를 참조하여 props 인터페이스 맞추기:
   - Block 컴포넌트: `HeroSection`, `AboutSection`, `ProjectsSection`, `ContactSection`
   - Corporate 컴포넌트: `GNB`, `Hero`, `CardSlider`, `Career`, `Contact`

### Step 3: FE — 미리보기 페이지 구현

**FE 개발자 미션**:

1. `/pdf/result` 페이지에 "포트폴리오 미리보기" 버튼 추가:
   ```typescript
   // sessionStorage에 저장된 변환 데이터를 포트폴리오 미리보기로 전달
   <Button onClick={() => router.push('/pdf/portfolio-preview')}>
     포트폴리오 미리보기
   </Button>
   ```

2. `src/app/pdf/portfolio-preview/page.tsx` 생성:
   - sessionStorage에서 변환된 resume 데이터 로드
   - `StyleToneGrid` 컴포넌트로 8개 조합 **라이브 썸네일** 표시
   - 선택된 조합의 포트폴리오를 `PreviewFrame`에서 렌더링

3. `src/components/portfolio-preview/StyleToneGrid.tsx`:
   - 2행(Block/Corporate) × 4열(Toss/Minimal/Dark/Kakao) 그리드
   - **각 카드에 라이브 썸네일 표시** (사용자 데이터가 실시간 반영)
   - 선택 시 하이라이트 + 미리보기 영역 업데이트

4. `src/components/portfolio-preview/ThumbnailCard.tsx` (**NEW — 라이브 썸네일 카드**):

   각 조합을 CSS 축소 렌더링하여 실제 포트폴리오 모습을 썸네일로 보여줌:

   ```typescript
   interface ThumbnailCardProps {
     style: 'block' | 'corporate';
     tone: 'toss' | 'minimal' | 'dark' | 'kakao';
     resumeData: ResumeDto;
     selected: boolean;
     onClick: () => void;
   }

   export function ThumbnailCard({ style, tone, resumeData, selected, onClick }: ThumbnailCardProps) {
     return (
       <CardWrapper selected={selected} onClick={onClick}>
         {/* ── 라이브 썸네일 영역 ── */}
         <ThumbnailViewport>
           <ScaledContent>
             {/*
               실제 포트폴리오 컴포넌트를 1280px 기준으로 렌더링 후
               CSS transform: scale()로 축소하여 썸네일화.
               사용자의 resume 데이터가 그대로 반영됨.
             */}
             <StyleProvider tone={tone}>
               {style === 'block'
                 ? <BlockLayout data={resumeData} />
                 : <CorporateLayout data={resumeData} />
               }
             </StyleProvider>
           </ScaledContent>
         </ThumbnailViewport>

         {/* ── 라벨 영역 ── */}
         <CardLabel>
           <ToneDot color={TONE_COLORS[tone]} />
           <span>{STYLE_LABELS[style]} · {TONE_LABELS[tone]}</span>
         </CardLabel>
       </CardWrapper>
     );
   }
   ```

   **CSS 축소 렌더링 원리**:
   ```typescript
   const THUMBNAIL_WIDTH  = 280;   // 카드 표시 크기
   const THUMBNAIL_HEIGHT = 180;
   const RENDER_WIDTH     = 1280;  // 실제 렌더링 기준 폭
   const SCALE = THUMBNAIL_WIDTH / RENDER_WIDTH;  // ≈ 0.22

   const ThumbnailViewport = styled.div`
     width: ${THUMBNAIL_WIDTH}px;
     height: ${THUMBNAIL_HEIGHT}px;
     overflow: hidden;
     border-radius: 8px 8px 0 0;
     position: relative;
   `;

   const ScaledContent = styled.div`
     width: ${RENDER_WIDTH}px;
     transform: scale(${SCALE});
     transform-origin: top left;
     pointer-events: none;    /* 썸네일 내부 클릭 방지 */
     user-select: none;
   `;
   ```

   **톤별 대표 색상**:
   ```typescript
   const TONE_COLORS: Record<string, string> = {
     toss:    '#3182F6',  // 토스 블루
     minimal: '#000000',  // 미니멀 블랙
     dark:    '#7C3AED',  // 다크 퍼플
     kakao:   '#FEE500',  // 카카오 옐로
   };
   ```

5. `src/components/portfolio-preview/PreviewFrame.tsx`:
   - jione-portfolio의 block/corporate 컴포넌트를 동적 import
   - 선택된 tone의 theme를 `StyleProvider`로 감싸서 렌더링
   - resume.ts 데이터를 각 컴포넌트 props로 주입
   - 반응형 미리보기 전환 버튼 (Desktop / Tablet / Mobile)

6. 컴포넌트 재사용 전략:
   - `jione-portfolio/src/components/block/*` → 동적 import
   - `jione-portfolio/src/components/corporate/*` → 동적 import
   - `jione-portfolio/src/styles/themes/*` → theme 토큰 import
   - `jione-portfolio/src/styles/provider.tsx` → StyleProvider import

### Step 4: 디자이너 — UI 디자인

**디자이너 미션**:

1. **ThumbnailCard 디자인** (라이브 썸네일 카드):
   ```
   ┌─────────────────────────┐
   │                         │  ← 라이브 썸네일 영역
   │   [축소된 포트폴리오]    │     280×180px, overflow hidden
   │   사용자 데이터 반영     │     CSS scale(0.22) 렌더링
   │                         │
   ├─────────────────────────┤
   │  ● Block · Toss         │  ← 라벨 (톤 컬러 dot + 이름)
   └─────────────────────────┘
   ```
   - 카드 크기: **280px × 220px** (썸네일 180px + 라벨 40px)
   - 모바일: 2열 그리드로 축소 (카드 폭 100%)
   - 기본 상태: `border: 1px solid #E5E7EB`, `border-radius: 12px`
   - **호버**: `transform: translateY(-4px)`, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`
   - **선택됨**: `border: 2px solid #3182F6`, 우측 상단 ✓ 체크 뱃지
   - 톤 컬러 도트: 라벨 좌측 8px 원형, 각 톤 대표색

2. **StyleToneGrid 레이아웃**:
   ```
   Block                              (스타일 행 라벨)
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │ Toss │ │Mnml  │ │ Dark │ │Kakao │   ← 라이브 썸네일 4장
   │ 축소 │ │ 축소 │ │ 축소 │ │ 축소 │
   │ 렌더 │ │ 렌더 │ │ 렌더 │ │ 렌더 │
   └──────┘ └──────┘ └──────┘ └──────┘

   Corporate                          (스타일 행 라벨)
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │ Toss │ │Mnml  │ │ Dark │ │Kakao │   ← 라이브 썸네일 4장
   │ 축소 │ │ 축소 │ │ 축소 │ │ 축소 │
   │ 렌더 │ │ 렌더 │ │ 렌더 │ │ 렌더 │
   └──────┘ └──────┘ └──────┘ └──────┘
   ```
   - 데스크탑: 4열 그리드, `gap: 16px`
   - 태블릿: 2열 그리드
   - 모바일: 2열 그리드, 카드 축소

3. **PreviewFrame 디자인**:
   - 브라우저 모양 프레임 (주소창 mock 포함)
   - 반응형 전환 버튼 (Desktop / Tablet / Mobile)
   - 미리보기 영역 최소 높이: 600px

4. **전체 페이지 레이아웃**:
   ```
   ┌─────────────────────────────────────────────────┐
   │  Portfolio Builder > 포트폴리오 미리보기          │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  🎨 스타일 & 톤 선택                             │
   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
   │  │thumb │ │thumb │ │thumb │ │thumb │  Block     │
   │  └──────┘ └──────┘ └──────┘ └──────┘           │
   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
   │  │thumb │ │thumb │ │thumb │ │thumb │  Corporate │
   │  └──────┘ └──────┘ └──────┘ └──────┘           │
   │                                                 │
   │  ─────────────────────────────────────────      │
   │                                                 │
   │  👁 미리보기          [Desktop] [Tablet] [Mobile]│
   │  ┌───────────────────────────────────────┐      │
   │  │  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │      │
   │  │  │                                 │  │      │
   │  │  │  선택된 조합의 포트폴리오         │  │      │
   │  │  │  풀사이즈 렌더링                 │  │      │
   │  │  │                                 │  │      │
   │  │  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │      │
   │  └───────────────────────────────────────┘      │
   │                                                 │
   │                         [📦 ZIP 다운로드]        │
   └─────────────────────────────────────────────────┘
   ```
   - 상단: 썸네일 그리드 (선택 영역)
   - 하단: 풀사이즈 미리보기 (선택 결과)
   - 최하단: ZIP 다운로드 버튼

### Step 5: QA — 미리보기 검증

**QA 미션**:

1. **썸네일 렌더링 검증**:
   - 8개 썸네일 카드 모두 정상 렌더링 확인
   - 각 썸네일에 사용자 데이터(이름, 프로젝트 등)가 표시되는지 확인
   - 각 톤별 색상이 썸네일에서 구분 가능한지 확인
   - 썸네일 내부 클릭이 차단되는지 확인 (`pointer-events: none`)
2. **썸네일 → 미리보기 연동**:
   - 썸네일 클릭 시 하단 PreviewFrame이 해당 조합으로 전환되는지 확인
   - 선택된 카드에 체크 뱃지 + 파란색 보더 표시 확인
3. resume.ts 데이터 필드가 각 컴포넌트에 올바르게 표시되는지 확인:
   - profile → Hero 섹션
   - career → About/Career 섹션
   - projects → Projects/CardSlider 섹션
   - skills → About/Career 섹션
4. 반응형 미리보기 전환 동작 확인
5. sessionStorage 데이터 유실 없이 페이지 이동 확인
6. jione-portfolio 컴포넌트 import 에러 없음 확인
7. **성능**: 8개 동시 렌더링 시 페이지 로딩 지연 확인 (필요 시 lazy loading 적용)

---

## 의존 관계

```
pdf-1.spec.md (기획) → pdf-4.frontend.md (FE UI) → pdf-8 (포트폴리오 미리보기)
                                                         ↓
                                                    pdf-9 (ZIP 다운로드)
```

---

## Rules

- jione-portfolio의 컴포넌트는 **import하여 재사용** — 복사하여 중복 생성하지 않는다
- resume.ts 데이터는 sessionStorage에서 가져온다 (PDF 변환 결과)
- 미리보기는 클라이언트 사이드 렌더링 (SSR 불필요)
- 8개 조합 모두 미리보기 가능해야 한다 — 특정 조합만 지원하지 않는다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
