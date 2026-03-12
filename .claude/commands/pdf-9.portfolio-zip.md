# pdf-9: 포트폴리오 ZIP 다운로드

미리보기에서 선택한 포트폴리오 조합(style × tone)을 정적 파일로 export하여 ZIP으로 다운로드한다.
다운로드한 ZIP을 로컬에서 풀고 `index.html`을 열어 포트폴리오를 확인할 수 있다.

---

## 담당 역할

| 역할      | 미션                                                              |
| --------- | ----------------------------------------------------------------- |
| 기획자    | ZIP 다운로드 UX 플로우 설계, 파일 구조 정의                       |
| BE 개발자 | ZIP 생성 API, 정적 HTML/CSS/JS 번들링, 파일 스트리밍              |
| FE 개발자 | ZIP 다운로드 버튼 UI, 진행률 표시, 완료 안내 모달                 |
| QA        | ZIP 파일 무결성 검증, 로컬 실행 테스트, 크로스 브라우저 확인      |

---

## 인증 정책

> **ZIP 다운로드는 카카오 로그인 필수**.
> 미로그인 상태에서 [ZIP 다운로드] 클릭 시 → 로그인 유도 모달 표시 → 로그인 후 자동 다운로드.
> API(`/api/portfolio/zip`)에서도 `requireSession`으로 401 반환.

---

## 선행 조건

- `pdf-8.portfolio-preview.md` 완료 — 미리보기 페이지 존재
- `pdf-7.auth-kakao.md` 완료 — 카카오 로그인 + LoginModal 컴포넌트 존재
- 사용자가 미리보기에서 style × tone 조합을 선택한 상태

---

## UX 플로우

```
/pdf/portfolio-preview (미리보기 페이지) — 공개
  │
  ├→ 8개 조합 중 하나 선택 완료
  │
  └→ [ZIP 다운로드] 버튼 클릭
       │
       ├→ 미로그인 상태
       │    ▼
       │  ┌──────────────────────────────────┐
       │  │ 카카오 로그인                      │
       │  │                                  │
       │  │ ZIP 다운로드를 위해               │
       │  │ 카카오 로그인이 필요합니다.       │
       │  │                                  │
       │  │  [카카오로 로그인]                │
       │  │  (닫기)                           │
       │  └──────────────────────────────────┘
       │       └→ 로그인 완료 → 자동으로 다운로드 시작
       │
       └→ 로그인됨
            ▼
       ┌──────────────────────────────────┐
       │ 다운로드 중...                    │
       │ ████████████░░░░ 75%             │
       │ 선택: block / toss               │
       └──────────────────────────────────┘
            ▼
       ┌──────────────────────────────────┐
       │ ✅ 다운로드 완료!                 │
       │                                  │
       │ portfolio-block-toss.zip         │
       │                                  │
       │ 📂 ZIP을 풀고 index.html을       │
       │    브라우저에서 열어보세요        │
       │                                  │
       │         [확인]                   │
       └──────────────────────────────────┘
```

---

## ZIP 파일 구조

```
portfolio-{style}-{tone}.zip
  └── portfolio/
       ├── index.html          ← 메인 페이지 (브라우저에서 바로 열기)
       ├── styles/
       │    ├── global.css      ← 글로벌 스타일
       │    └── theme.css       ← 선택된 tone의 테마 변수
       ├── assets/
       │    └── images/         ← 프로필/프로젝트 이미지 (있는 경우)
       └── data/
            └── resume.json     ← 변환된 resume 데이터 (JSON)
```

---

## 구현 Steps

### Step 1: 기획 — ZIP 구조 및 UX 확정

**기획자 미션**:

1. ZIP 파일 명명 규칙: `portfolio-{style}-{tone}.zip`
   - 예: `portfolio-block-toss.zip`, `portfolio-corporate-kakao.zip`
2. ZIP 내부 파일 구조 확정 (위 구조 참고)
3. 다운로드 완료 후 안내 모달 문구 확정
4. 에러 케이스 정의:
   - resume 데이터 없음 → "먼저 PDF를 변환해주세요"
   - 조합 미선택 → "포트폴리오 스타일을 선택해주세요"

### Step 2: BE — ZIP 생성 API

**BE 개발자 미션**:

1. 패키지 설치: `jszip` (ZIP 생성 라이브러리)
   ```bash
   npm install jszip
   npm install -D @types/jszip
   ```

2. `src/lib/portfolio/zip-generator.ts` 생성:

   ```typescript
   import JSZip from 'jszip';

   interface ZipOptions {
     style: 'block' | 'corporate';
     tone: 'toss' | 'minimal' | 'dark' | 'kakao';
     resumeData: ResumeDto;
   }

   export async function generatePortfolioZip(options: ZipOptions): Promise<Buffer> {
     const { style, tone, resumeData } = options;
     const zip = new JSZip();
     const folder = zip.folder('portfolio')!;

     // 1. index.html — 선택된 style/tone의 포트폴리오를 정적 HTML로 렌더링
     const html = generateStaticHtml(style, tone, resumeData);
     folder.file('index.html', html);

     // 2. styles/global.css — 글로벌 스타일
     const globalCss = generateGlobalCss();
     folder.folder('styles')!.file('global.css', globalCss);

     // 3. styles/theme.css — 선택된 tone의 CSS 변수
     const themeCss = generateThemeCss(tone);
     folder.folder('styles')!.file('theme.css', themeCss);

     // 4. data/resume.json — resume 데이터
     folder.folder('data')!.file('resume.json', JSON.stringify(resumeData, null, 2));

     // 5. 이미지 파일 (URL이면 fetch, 로컬이면 복사)
     // await addImagesToZip(folder, resumeData);

     return zip.generateAsync({ type: 'nodebuffer' }) as Promise<Buffer>;
   }
   ```

3. `POST /api/portfolio/zip` 엔드포인트 (`src/app/api/portfolio/zip/route.ts`):

   > **인증 필수** — `requireSession`으로 미로그인 시 401 반환.

   ```typescript
   import { requireSession } from '@/lib/auth/require-session';

   export async function POST(request: Request) {
     // 🔒 로그인 확인
     const { session, response } = await requireSession();
     if (response) return response; // 401

     const { style, tone, resumeData } = await request.json();

     // 유효성 검사
     if (!style || !tone || !resumeData) {
       return Response.json({ error: '필수 데이터 누락' }, { status: 400 });
     }

     const zipBuffer = await generatePortfolioZip({ style, tone, resumeData });
     const filename = `portfolio-${style}-${tone}.zip`;

     return new Response(zipBuffer, {
       headers: {
         'Content-Type': 'application/zip',
         'Content-Disposition': `attachment; filename="${filename}"`,
       },
     });
   }
   ```

4. `src/lib/portfolio/static-html-generator.ts` — 정적 HTML 생성:
   - jione-portfolio의 block/corporate 컴포넌트 구조를 참고하여 정적 HTML 생성
   - 선택된 tone의 색상/폰트를 CSS 변수로 주입
   - resume 데이터를 HTML 요소에 직접 삽입
   - 외부 의존 없이 단독 실행 가능한 HTML (인라인 CSS)

### Step 3: FE — 다운로드 UI

**FE 개발자 미션**:

1. `/pdf/portfolio-preview` 페이지에 "ZIP 다운로드" 버튼 추가:

   > 미로그인 시 `LoginModal`을 띄우고, 로그인 후 자동 다운로드한다.

   ```typescript
   import { useSession } from 'next-auth/react';
   import { LoginModal } from '@/components/auth/login-modal';

   const { data: session } = useSession();
   const [showLoginModal, setShowLoginModal] = useState(false);

   const handleDownloadZip = async () => {
     // 🔒 미로그인 → 로그인 모달
     if (!session?.user) {
       setShowLoginModal(true);
       return;
     }

     setIsDownloading(true);
     try {
       const response = await fetch('/api/portfolio/zip', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           style: selectedStyle,
           tone: selectedTone,
           resumeData: resumeData,
         }),
       });

       if (response.status === 401) {
         setShowLoginModal(true);
         return;
       }

       const blob = await response.blob();
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `portfolio-${selectedStyle}-${selectedTone}.zip`;
       a.click();
       URL.revokeObjectURL(url);

       setShowCompleteModal(true);
     } finally {
       setIsDownloading(false);
     }
   };

   // JSX에 LoginModal 포함
   <LoginModal
     isOpen={showLoginModal}
     onClose={() => setShowLoginModal(false)}
     message="ZIP 다운로드를 위해 카카오 로그인이 필요합니다."
   />
   ```

2. `src/components/portfolio-preview/DownloadButton.tsx`:
   - 다운로드 진행 중: 스피너 + "다운로드 중..." 텍스트
   - 조합 미선택 시: 비활성화 상태 + 툴팁 "스타일을 선택해주세요"

3. `src/components/portfolio-preview/DownloadCompleteModal.tsx`:
   - 다운로드 완료 안내
   - 파일명 표시
   - "ZIP을 풀고 index.html을 브라우저에서 열어보세요" 안내
   - [확인] 버튼으로 닫기

### Step 4: QA — ZIP 다운로드 검증

**QA 미션**:

1. **ZIP 생성 검증**:
   - 8개 조합 각각 ZIP 생성 성공 확인
   - ZIP 내부 파일 구조가 스펙과 일치하는지 확인
   - resume.json 데이터가 올바른지 확인

2. **로컬 실행 테스트**:
   - ZIP 압축 해제 후 `index.html`을 브라우저에서 열기
   - 포트폴리오가 정상 렌더링되는지 확인
   - 이미지, 스타일이 올바르게 적용되는지 확인
   - Chrome, Firefox, Safari에서 테스트

3. **에러 케이스 테스트**:
   - resume 데이터 없이 다운로드 시도 → 에러 메시지 확인
   - 조합 미선택 시 → 버튼 비활성화 확인
   - 대용량 이미지 포함 시 → ZIP 생성 시간 확인

4. **파일 크기 확인**:
   - 이미지 미포함 시 ZIP 크기 < 500KB
   - 이미지 포함 시 ZIP 크기 < 10MB

---

## 의존 관계

```
pdf-8.portfolio-preview.md (미리보기) → pdf-9 (ZIP 다운로드)
```

---

## Rules

- ZIP은 **선택된 1개 조합만** 포함 — 8개 전체를 묶지 않는다
- 생성된 HTML은 **외부 의존 없이 단독 실행** 가능해야 한다 (CDN, 서버 불필요)
- resume 데이터는 JSON 형태로 ZIP에 포함하여 재사용 가능하게 한다
- 이미지가 외부 URL인 경우 fetch하여 로컬 파일로 포함시킨다
- ZIP 파일명은 `portfolio-{style}-{tone}.zip` 형식을 따른다
- **구현 프로젝트는 `c:\work\jione-transformer`** — `jione-portfolio`가 아닌 `jione-transformer`에 모든 코드를 작성한다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
- 리뷰 완료 후 수정사항이 있으면 **confirm 없이 바로 진행**한다 — 사용자에게 진행 여부를 묻지 않는다
