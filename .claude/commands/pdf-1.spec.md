---
description: pofogen 기획 스펙 — 요구사항, UX 플로우, DTO 매핑 정의
---

# 기획 스펙 — pofogen

---

## 1. 프로젝트 목적

PDF 이력서를 업로드하면 자동으로 `data/resume.ts` 형식으로 변환하고,
내용이 부족한 필드는 **Gemini API**가 보완하여 완성도 높은 포트폴리오 데이터를 생성한다.
변환 완료 후 **8가지 디자인의 포트폴리오를 자동 생성**하여 미리보기하고, **ZIP으로 다운로드**할 수 있다.
PDF 업로드 → 변환 → 편집 → 포트폴리오 미리보기까지는 **로그인 없이 사용 가능**하며,
ZIP 다운로드 시에만 **카카오 로그인**이 필요하다 (첫 로그인 시 자동 회원가입).

---

## 2. 사용자 스토리

```
AS 포트폴리오 사이트를 만들려는 사용자
I WANT PDF 이력서를 업로드하면 포트폴리오가 자동으로 완성되길
SO THAT 데이터 작성부터 디자인 선택, 배포까지 원스톱으로 처리할 수 있다
```

---

## 3. 기능 요구사항

### Must Have (MVP)

| ID   | 기능                    | 설명                                                                                                     |
| ---- | ----------------------- | -------------------------------------------------------------------------------------------------------- |
| F-00 | 카카오 로그인           | OAuth 2.0, 첫 로그인 시 자동 회원가입, **ZIP 다운로드 시에만 로그인 필요** (업로드/변환/미리보기는 공개) |
| F-01 | PDF 업로드              | 드래그&드롭 또는 파일 선택 (최대 10MB)                                                                   |
| F-02 | PDF 파싱                | 텍스트 추출 → DTO 섹션별 분류                                                                            |
| F-03 | DTO 매핑                | 추출 텍스트 → resume.ts 필드 매핑                                                                        |
| F-04 | 결과 미리보기           | 변환된 데이터를 섹션별 편집 UI로 표시                                                                    |
| F-05 | resume.ts 다운로드      | 최종 결과를 `resume.ts` 파일로 저장                                                                      |
| F-06 | AI 보완                 | 내용 부족 필드를 Gemini API로 자동 보완                                                                  |
| F-07 | 포트폴리오 미리보기     | 변환된 resume.ts 기반으로 8개 조합(block/corporate × 4 tone) 포트폴리오 자동 생성 및 미리보기            |
| F-08 | 포트폴리오 ZIP 다운로드 | 선택한 조합의 포트폴리오를 정적 HTML로 export하여 ZIP 다운로드 (로컬 실행 가능)                          |

### Nice to Have

| ID   | 기능                             |
| ---- | -------------------------------- |
| F-20 | 다국어 PDF 지원 (영문 이력서)    |
| F-21 | 이력서 이미지/스크린샷 자동 수집 |
| F-22 | 여러 PDF 병합 변환               |

---

## 4. UX 플로우

```
[랜딩페이지] (/) — 공개
  └→ "시작하기" 클릭 → /pdf 이동

[업로드 화면] (/pdf) — 공개 (로그인 불필요)
  └→ PDF 드래그&드롭 or 파일 선택
       └→ [로딩] 파싱 중... (BE API 호출)
            ├→ 성공
            │    └→ [미리보기 화면]
            │         ├→ 섹션별 탭: 프로필 / 경력 / 프로젝트 / 스킬
            │         ├→ 각 필드 인라인 편집 가능
            │         ├→ AI 보완 필드 → 보라색 배경 + "AI 생성" 뱃지
            │         ├→ [AI 보완 실행]
            │         ├→ [resume.ts 다운로드]
            │         └→ [포트폴리오 미리보기] → /pdf/portfolio-preview
            └→ 실패 → 에러 메시지 + 재시도

[포트폴리오 미리보기] (/pdf/portfolio-preview) — 공개
  ├→ Style × Tone 선택 그리드 (block/corporate × toss/minimal/dark/kakao = 8개)
  ├→ 선택된 조합의 포트폴리오 실시간 렌더링 (resume.ts 데이터 반영)
  ├→ 반응형 미리보기 전환 (Desktop / Tablet / Mobile)
  └→ [ZIP 다운로드] 클릭
       ├→ 미로그인 → 카카오 로그인 유도 모달 → 로그인 후 자동 다운로드
       └→ 로그인됨 → portfolio-{style}-{tone}.zip 즉시 다운로드
            └→ 로컬에서 index.html 열어 확인 가능
```

---

## 5. DTO 매핑 규칙

PDF 섹션 텍스트 → `data/resume.ts` 필드 매핑:

| PDF 섹션 키워드                | resume.ts 필드         |
| ------------------------------ | ---------------------- |
| 이름, Name                     | `profile.name`         |
| 이메일, Email                  | `profile.email`        |
| 연락처, Phone, Tel             | `profile.phone`        |
| 주소, Location                 | `profile.location`     |
| 자기소개, Summary, About       | `profile.bio`          |
| 직함, Title, Position (최상단) | `profile.title`        |
| 경력, Work Experience, Career  | `career.experiences[]` |
| 프로젝트, Projects             | `Project.cases[]`      |
| 기술, Skills, Tech Stack       | `skills.categories[]`  |
| GitHub, LinkedIn               | `profile.social.*`     |

### experience 매핑 세부 규칙

```
회사명        → company
직책          → position
기간 (시작)   → period.start  ("YYYY.MM" 형식으로 정규화)
기간 (종료)   → period.end    ("present" 또는 "YYYY.MM")
업무 내용     → description   (첫 문장 또는 요약)
성과 목록     → achievements  (bullet point → 배열)
```

### ProjectCase 매핑 세부 규칙

```
프로젝트명    → title
회사/소속     → company
역할          → role         (예: "기획+개발", "FE 개발")
설명          → description
기술 스택     → execution    (콤마 구분 문자열)
사용 도구     → tools        (콤마 구분 문자열)
기간/연도     → year
링크 URL      → urls[{ label, href }]
```

### SkillLevel 추론 규칙

```
경력 5년+ 또는 "전문" 표현     → 'expert'
경력 2~4년 또는 "숙련" 표현   → 'advanced'
경력 1년 미만 또는 "사용 가능" → 'intermediate'
추론 불가                      → 'intermediate' (기본값)
```

---

## 6. AI 보완 조건

Gemini API를 호출하는 조건:

| 필드                      | 보완 조건         |
| ------------------------- | ----------------- |
| `profile.bio`             | 없거나 100자 미만 |
| `experience.description`  | 없거나 50자 미만  |
| `experience.achievements` | 빈 배열           |
| `ProjectCase.description` | 없거나 50자 미만  |
| `ProjectCase.role`        | 없음              |
| `skill.level`             | 추론 불가         |

---

## 7. 에러 처리

| 상황                 | 처리                                                       |
| -------------------- | ---------------------------------------------------------- |
| PDF 텍스트 추출 실패 | "텍스트를 추출할 수 없는 PDF입니다 (이미지 전용 PDF)" 안내 |
| Gemini API 실패      | AI 보완 없이 추출 결과만 제공, 사용자에게 알림             |
| 필드 매핑 실패       | 빈 값으로 처리, 사용자가 직접 입력                         |
| 파일 용량 초과       | 업로드 전 10MB 초과 시 즉시 안내                           |

---

## 8. 기술 스택

| 레이어      | 기술                                        |
| ----------- | ------------------------------------------- |
| Frontend    | Next.js, React, TypeScript                  |
| Backend     | Next.js API Routes (또는 별도 Node.js 서버) |
| PDF 파싱    | `pdf-parse` npm 패키지                      |
| AI          | Google Gemini API (`@google/generative-ai`) |
| 파일 핸들링 | `multer` 또는 Next.js built-in              |

---

## 완료 기준 (Definition of Done)

- [ ] PDF 업로드 → resume.ts 변환 E2E 동작
- [ ] Gemini API 보완 결과가 편집 가능한 형태로 표시
- [ ] 다운로드한 resume.ts가 빌드 오류 없이 사용 가능
- [ ] 한글/영문 PDF 모두 처리
- [ ] 에러 케이스 전부 처리 (파싱 실패, API 실패 등)
- [ ] 포트폴리오 미리보기 8개 조합 모두 정상 렌더링
- [ ] ZIP 다운로드 후 로컬에서 index.html 정상 실행

---

## Rules

- **구현 프로젝트는 `c:\work\jione-transformer`** — `jione-transformer`에 모든 코드를 작성한다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
- 리뷰 완료 후 수정사항이 있으면 **confirm 없이 바로 진행**한다 — 사용자에게 진행 여부를 묻지 않는다
