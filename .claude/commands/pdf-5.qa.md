---
description: PDF → resume.ts 변환 QA 테스트 — 파싱 정확도, Gemini 보완, 엣지 케이스, E2E 검증
---

# QA 테스트 — PDF → resume.ts 변환

선행: `pdf-1.spec.md` ~ `pdf-4.frontend.md` 개발 완료 필수

---

## 테스트 환경 설정

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D jest-environment-jsdom ts-jest
```

`jest.config.ts`:
```typescript
export default {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
```

---

## TC-01: PDF 파싱 정확도

`src/__tests__/pdf/parser.test.ts`:

```typescript
import { mapPdfToResumeDto } from '@/lib/pdf/dto-mapper';

describe('PDF DTO 매핑', () => {

  const SAMPLE_TEXT = `
이지혜
Full-Side Product Engineer
euneundh@gmail.com
010-7205-0408
서울
github.com/iimandoo

경력
(주)마타에듀
차장
2023.03 ~ 현재
서비스 전략 제안 및 PM, 기획 및 프론트엔드 개발
· 서비스 전략 제안 및 PM
· 기획 및 프론트엔드 개발

프로젝트
AI마타수학 2026년 리뉴얼
(주)마타에듀
전략, 서비스 기획, 프론트엔드 개발
Next.js, React, TypeScript, Redux
2023 ~ 현재

기술
Frontend
React, Next.js, TypeScript, Redux
`;

  test('profile.name 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.name).toBe('이지혜');
  });

  test('profile.email 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.email).toBe('euneundh@gmail.com');
  });

  test('profile.phone 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.phone).toMatch(/010/);
  });

  test('profile.social.github 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.social.github).toContain('github.com/iimandoo');
  });

  test('career.experiences 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences.length).toBeGreaterThan(0);
    expect(dto.career.experiences[0].company).toContain('마타에듀');
  });

  test('period.start 정규화 — YYYY.MM 형식', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences[0].period.start).toMatch(/^\d{4}\.\d{2}$/);
  });

  test('period.end = "present" 정규화', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences[0].period.end).toBe('present');
  });

  test('Project.cases 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.Project.cases.length).toBeGreaterThan(0);
    expect(dto.Project.cases[0].title).toContain('AI마타수학');
  });

  test('skills.categories 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.skills.categories.length).toBeGreaterThan(0);
  });
});
```

---

## TC-02: 내용 부족 감지

`src/__tests__/pdf/deficiency-detector.test.ts`:

```typescript
import { detectDeficientFields } from '@/lib/ai/deficiency-detector';
import type { ResumeDto } from '@/types/resume-dto';

const makeDto = (overrides: Partial<ResumeDto>): ResumeDto => ({
  meta: { siteTitle: '', siteDescription: '', siteUrl: '', ogImage: '', author: '', keywords: [], theme: 'toss' },
  profile: { name: '이지혜', title: 'FE', subtitle: '', email: 'test@test.com', phone: '', location: '', availability: '', bio: '', image: '', social: { github: '', linkedin: '' } },
  career: { summary: '', experiences: [] },
  Project: { intro: '', cases: [] },
  skills: { categories: [] },
  ...overrides,
});

describe('내용 부족 감지', () => {

  test('bio가 없으면 deficient로 감지', () => {
    const dto = makeDto({ profile: { ...makeDto({}).profile, bio: '' } });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'profile.bio')).toBe(true);
  });

  test('bio가 100자 이상이면 deficient 아님', () => {
    const longBio = 'a'.repeat(101);
    const dto = makeDto({ profile: { ...makeDto({}).profile, bio: longBio } });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'profile.bio')).toBe(false);
  });

  test('experience.description이 50자 미만이면 deficient', () => {
    const dto = makeDto({
      career: {
        summary: '',
        experiences: [{
          id: 'exp-1', company: '테스트', position: '개발자',
          period: { start: '2023.01', end: 'present' },
          description: '짧은 설명',
          achievements: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('description'))).toBe(true);
  });

  test('achievements가 비어있으면 deficient', () => {
    const dto = makeDto({
      career: {
        summary: '',
        experiences: [{
          id: 'exp-1', company: '테스트', position: '개발자',
          period: { start: '2023.01', end: 'present' },
          description: 'a'.repeat(60),
          achievements: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('achievements'))).toBe(true);
  });

  test('skills.level이 intermediate이면 deficient', () => {
    const dto = makeDto({
      skills: {
        categories: [{
          name: 'Frontend',
          skills: [{ name: 'React', level: 'intermediate' }],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('skills.categories') && f.path.includes('level'))).toBe(true);
  });

  test('skills.level이 advanced이면 deficient 아님', () => {
    const dto = makeDto({
      skills: {
        categories: [{
          name: 'Frontend',
          skills: [{ name: 'React', level: 'advanced' }],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('level'))).toBe(false);
  });

  test('Project.cases.description이 50자 미만이면 deficient', () => {
    const dto = makeDto({
      Project: {
        intro: '',
        cases: [{
          id: 'proj-1', title: '테스트 프로젝트', company: '회사',
          role: '개발자', description: '짧은 설명', execution: '',
          tools: '', year: '2024', images: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'Project.cases.0.description')).toBe(true);
  });

  test('Project.cases.role이 비어있으면 deficient', () => {
    const dto = makeDto({
      Project: {
        intro: '',
        cases: [{
          id: 'proj-1', title: '테스트 프로젝트', company: '회사',
          role: '', description: 'a'.repeat(60), execution: '',
          tools: '', year: '2024', images: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'Project.cases.0.role')).toBe(true);
  });

  test('모든 필드 충분하면 deficient 없음', () => {
    const dto = makeDto({
      profile: { ...makeDto({}).profile, bio: 'a'.repeat(101) },
      career: {
        summary: '',
        experiences: [{
          id: 'exp-1', company: '회사', position: '개발자',
          period: { start: '2023.01', end: 'present' },
          description: 'a'.repeat(60),
          achievements: ['성과1', '성과2'],
        }],
      },
      skills: {
        categories: [{
          name: 'Frontend',
          skills: [{ name: 'React', level: 'expert' }],
        }],
      },
      Project: {
        intro: '',
        cases: [{
          id: 'proj-1', title: '프로젝트', company: '회사',
          role: '개발자', description: 'a'.repeat(60), execution: '',
          tools: '', year: '2024', images: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.length).toBe(0);
  });
});
```

---

## TC-03: resume.ts 생성 출력 검증

`src/__tests__/pdf/resume-generator.test.ts`:

```typescript
import { generateResumeTsContent } from '@/lib/pdf/resume-generator';
import type { ResumeDto } from '@/types/resume-dto';

const sampleData: ResumeDto = {
  meta: { siteTitle: '테스트 포트폴리오', siteDescription: '', siteUrl: '', ogImage: '', author: '이지혜', keywords: [], theme: 'toss' },
  profile: { name: '이지혜', title: 'FE', subtitle: '', email: 'test@test.com', phone: '', location: '', availability: '', bio: 'bio 내용', image: '', social: { github: '', linkedin: '' } },
  career: { summary: '', experiences: [] },
  Project: { intro: '', cases: [] },
  skills: { categories: [] },
};

describe('resume.ts 파일 생성', () => {

  test('export const resume = 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('export const resume =');
  });

  test('as const 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('} as const');
  });

  test('타입 export 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('export type Resume');
    expect(content).toContain('export type ProjectCase');
  });

  test('큰따옴표 없음 (작은따옴표만)', () => {
    const content = generateResumeTsContent(sampleData);
    // as const 이후의 값들은 작은따옴표여야 함
    const valueSection = content.split('export const resume =')[1];
    expect(valueSection).not.toContain('"이지혜"');
    expect(valueSection).toContain("'이지혜'");
  });
});
```

---

## TC-04: 엣지 케이스

| ID | 케이스 | 기대 결과 |
|----|--------|----------|
| EC-01 | 이미지만 있는 PDF (스캔본) | "텍스트 추출 불가" 에러 반환 |
| EC-02 | 10MB 초과 파일 | 업로드 전 클라이언트 에러 |
| EC-03 | PDF가 아닌 파일 (jpg, docx) | "PDF 파일만 가능" 에러 |
| EC-04 | 경력이 없는 PDF | `career.experiences = []` |
| EC-05 | 영문 이력서 | 영문 키워드로 섹션 분류 확인 |
| EC-06 | Gemini API 타임아웃 | AI 보완 없이 원본 반환, 에러 필드 목록 표시 |
| EC-07 | 빈 PDF (내용 없음) | 빈 DTO 반환, 모든 필드 수동 입력 유도 |
| EC-08 | 다중 경력 항목 (2개 이상 회사) | 회사별로 분리 파싱, company에 회사명 정확히 매핑 |
| EC-09 | 테이블 형식 PDF (성 명 이지혜 경 력 20년) | 테이블 key-value 파싱으로 프로필 추출 |
| EC-10 | LinkedIn URL 포함 이력서 | profile.social.linkedin 정확히 추출 |
| EC-11 | 짧은 description + 다양한 불릿 기호 | description/achievements 정확히 분리 |

`src/__tests__/pdf/edge-cases.test.ts`:

```typescript
import { mapPdfToResumeDto } from '@/lib/pdf/dto-mapper';

describe('TC-04: 엣지 케이스', () => {

  test('EC-04: 경력이 없는 PDF → career.experiences = []', () => {
    const text = `\n이지혜\nFrontend Developer\neuneundh@gmail.com\n010-1234-5678\n\n기술\nReact, Next.js, TypeScript\n`;
    const dto = mapPdfToResumeDto(text);
    expect(dto.career.experiences).toEqual([]);
    expect(dto.profile.name).toBe('이지혜');
  });

  test('EC-05: 영문 이력서 → 영문 키워드로 섹션 분류', () => {
    const text = `\nJohn Doe\nFrontend Developer\njohn@example.com\ngithub.com/johndoe\n\nExperience\nGoogle\nSenior Engineer\n2020.01 ~ present\nLed frontend architecture redesign\n· Improved page load by 40%\n\nProjects\nDesign System v2\nGoogle\nReact, TypeScript, Storybook\n2021 ~ 2023\n\nSkills\nFrontend\nReact, TypeScript, Storybook\n`;
    const dto = mapPdfToResumeDto(text);
    expect(dto.career.experiences.length).toBeGreaterThan(0);
    expect(dto.career.experiences[0].company).toContain('Google');
  });

  test('EC-07: 빈 텍스트 → 빈 DTO 반환', () => {
    const dto = mapPdfToResumeDto('');
    expect(dto.profile.name).toBe('');
    expect(dto.career.experiences).toEqual([]);
    expect(dto.Project.cases).toEqual([]);
  });

  test('EC-08: 다중 경력 — 회사별 분리 파싱', () => {
    const text = `\n홍길동\nBackend Developer\nhong@test.com\n\n경력\n(주)네이버\n시니어 개발자\n2020.01 ~ 현재\n백엔드 API 설계 및 개발\n· MSA 전환 프로젝트 리드\n\n(주)카카오\n주니어 개발자\n2017.03 ~ 2019.12\n서비스 개발 및 유지보수\n· 결제 시스템 개선\n`;
    const dto = mapPdfToResumeDto(text);
    expect(dto.career.experiences.length).toBe(2);
    expect(dto.career.experiences[0].company).toContain('네이버');
    expect(dto.career.experiences[1].company).toContain('카카오');
    // achievements에 회사명이 혼입되지 않아야 함
    expect(dto.career.experiences[0].achievements.join(' ')).not.toContain('카카오');
  });

  test('EC-09: 테이블 형식 PDF', () => {
    const text = `\n성 명 이지혜 경 력 20년 성 별 여\n전 화 010-1234-5678 email test@test.com 주 소 서울\n\n경력\n(주)테스트\n개발자\n2020.01 ~ 현재\n개발 업무\n\n기술\nReact, TypeScript\n`;
    const dto = mapPdfToResumeDto(text);
    expect(dto.profile.name).toBe('이지혜');
    expect(dto.profile.phone).toMatch(/010/);
  });

  test('EC-11: description/achievements 정확 분리', () => {
    const text = `\n테스터\n\n경력\n테스트회사\n개발자\n2023.01 ~ 현재\n프론트엔드 개발\n· 첫 번째 성과\n- 두 번째 성과\n• 세 번째 성과\n`;
    const dto = mapPdfToResumeDto(text);
    expect(dto.career.experiences[0].description).toBe('프론트엔드 개발');
    expect(dto.career.experiences[0].achievements.length).toBe(3);
    expect(dto.career.experiences[0].achievements).toContain('첫 번째 성과');
  });
});
```

---

## TC-05: E2E 시나리오

**정상 플로우:**
```
1. /pdf 접속
2. 샘플 PDF 드래그&드롭
3. "변환 시작" 클릭
4. /pdf/result 이동 확인
5. 프로필/경력/프로젝트/스킬 탭 모두 데이터 표시 확인
6. "AI 보완" 클릭 → 보라색 배경 필드 표시 확인
7. 필드 직접 편집 → 값 반영 확인
8. "resume.ts 다운로드" → 파일 정상 다운로드 확인
9. 다운로드된 파일 → jione-portfolio에 복사 후 빌드 성공 확인
```

---

## 테스트 실행

```bash
# 단위 테스트 전체
npx jest

# 특정 파일
npx jest src/__tests__/pdf/parser.test.ts

# 커버리지
npx jest --coverage
```

---

## 완료 기준 (QA Done)

- [ ] TC-01 파싱 정확도: 핵심 필드 80% 이상 추출 (9 TC)
- [ ] TC-02 부족 감지: 모든 조건 정확히 감지 — bio, description, achievements, skills.level, Project.cases (10 TC)
- [ ] TC-03 resume.ts 출력: 빌드 오류 없이 jione-portfolio에서 사용 가능 (4 TC)
- [ ] TC-04 엣지 케이스 11개 전부 처리 — 빈 PDF, 영문, 다중 경력, 테이블, achievements 분리 등 (10 TC)
- [ ] TC-05 E2E: 한글 PDF 샘플 1건 완전 통과
- [ ] Gemini API 실패 시 graceful fallback 동작 확인
- [ ] 전체 커버리지 80% 이상

---

## Rules

- **구현 프로젝트는 `c:\work\jione-transformer`** — `jione-portfolio`가 아닌 `jione-transformer`에 모든 코드를 작성한다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
- 리뷰 완료 후 수정사항이 있으면 **confirm 없이 바로 진행**한다 — 사용자에게 진행 여부를 묻지 않는다
