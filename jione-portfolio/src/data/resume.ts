// src/data/resume.ts
// ⚠️ 포트폴리오 콘텐츠 단일 소스 — 이 파일만 수정하면 전체 반영됩니다.

export const resume = {
  // ─── SEO & 메타데이터 ────────────────────────────────────────────
  meta: {
    siteTitle: '이지혜 | Full-Side Engineer',
    siteDescription:
      'AI 기반 제품 개발 및 자동화. 20년 경력의 Full-Side Engineer — EdTech, Commerce, Public Education 도메인 전문.',
    siteUrl: 'https://jione-portfolio.vercel.app',
    ogImage: '/images/og-image.jpg',
    author: '이지혜',
    keywords: ['Full-Side Engineer', 'Next.js', 'React', 'TypeScript', 'AI Automation', 'EdTech'],
    theme: {
      primaryColor: '#3182F6',
      accentColor: '#000000',
    },
  },

  // ─── 기본 프로필 ─────────────────────────────────────────────────
  profile: {
    name: '이지혜',
    title: 'Full-Side Engineer',
    subtitle: '기획 · 설계 · 개발을 아우르는 AI 기반 제품 엔지니어',
    email: 'euneundh@gmail.com',
    phone: '010-7205-0408',
    bio: '기획의 의도를 기술 명세로 전환하고, 디자인과 개발의 경계를 허물어 비즈니스 가치를 제품으로 빠르게 구현하는 Full-Side 엔지니어입니다. AI 도구와 자동화 프로세스를 적극 활용하여 개발 생산성을 극대화하며, 사용자 중심의 서비스 구조 개선에 강점이 있습니다.',
    image: '/images/profile.jpg',
    social: {
      github: 'https://github.com/iimandoo',
      linkedin: '',
    },
  },

  // ─── 경력 타임라인 ───────────────────────────────────────────────
  career: {
    summary:
      '20년 이상의 Full-Side Product Engineer로 EdTech, Commerce, Public Education 도메인을 넘나들며 전략 수립 → UX 설계 → 프론트엔드 아키텍처 설계 → 구현 → 확장까지 제품의 전 과정을 주도해왔습니다.',
    experiences: [
      {
        id: 'mata-edu',
        company: '(주)마타에듀',
        position: '차장 · Product Engineer (AI 마타수학 팀)',
        period: { start: '2023-03', end: 'present' },
        description:
          'AI 기반 진단 학습 플랫폼의 서비스 전략 수립, 기획, 프론트엔드 아키텍처 설계 및 개발',
        highlights: [
          'AI 마타수학 2026 리뉴얼 — 전체 IA 재설계 및 프론트엔드 아키텍처 개편 주도',
          'React / Next.js / TypeScript / Redux 기반 구조 개선 및 공통 컴포넌트 체계 정립',
          'EBS 초등온 납품 (2025) — 공교육 서비스 품질 기준 충족',
          '패들리(Paddly) 모둠활동 서비스 기획 및 UX 설계',
        ],
        skills: ['Next.js', 'React', 'TypeScript', 'Redux', 'Figma', 'AI Automation', 'PM'],
      },
      {
        id: 'freelance',
        company: '프리랜서',
        position: 'Frontend Engineer · Full-Stack Engineer',
        period: { start: '2014-01', end: '2022-12' },
        description: '다수 기업 프론트엔드 개발 및 EdTech 서비스 기획·개발',
        highlights: [
          '우아한형제들 — 배민상회 Admin 시스템 개발 (React-Query, Storybook)',
          '쿨한자(Cool-Hanja) MVP 기획 · 개발 · Vercel 배포 단독 수행',
          '맘토링(Momtoring) 멘토링 매칭 플랫폼 서비스 전략 기획 및 UX 설계',
          'React / TypeScript 기반 프론트엔드 개발 다수',
        ],
        skills: ['React', 'Next.js', 'TypeScript', 'React-Query', 'Storybook', 'Styled-Components'],
      },
      {
        id: 'gretech-japan',
        company: '㈜GRETECH JAPAN',
        position: '매니저',
        period: { start: '2007-12', end: '2011-02' },
        description: '일본 법인 서비스 기획·운영 및 개발 담당',
        highlights: [
          '서비스/웹 기획, 서비스 운영, 고객 대응',
          'CGI, VC++/Xcode 개발 및 HTML/Javascript 퍼블리싱',
        ],
        skills: ['웹 기획', '서비스 운영', 'Javascript', 'HTML'],
      },
    ],
  },

  // ─── 기술 스택 ───────────────────────────────────────────────────
  skills: {
    categories: [
      {
        name: 'Frontend',
        skills: [
          { name: 'React', level: 'expert' as const, years: 12 },
          { name: 'Next.js', level: 'expert' as const, years: 6 },
          { name: 'TypeScript', level: 'expert' as const, years: 8 },
          { name: 'JavaScript', level: 'expert' as const, years: 15 },
          { name: 'Styled-Components', level: 'expert' as const, years: 8 },
          { name: 'Redux', level: 'advanced' as const, years: 8 },
          { name: 'React Query', level: 'advanced' as const, years: 4 },
          { name: 'Recoil', level: 'advanced' as const, years: 3 },
        ],
      },
      {
        name: '기획 / PM',
        skills: [
          { name: '서비스 전략', level: 'expert' as const, years: 10 },
          { name: 'UX/UI 설계', level: 'expert' as const, years: 10 },
          { name: 'Figma', level: 'advanced' as const, years: 4 },
          { name: 'Make (자동화)', level: 'advanced' as const, years: 2 },
        ],
      },
      {
        name: 'AI & Automation',
        skills: [
          { name: 'Claude API', level: 'advanced' as const, years: 2 },
          { name: 'Gemini', level: 'intermediate' as const, years: 1 },
          { name: 'Prompt Engineering', level: 'advanced' as const, years: 2 },
          { name: 'AI 워크플로우', level: 'advanced' as const, years: 2 },
        ],
      },
      {
        name: 'Tools & Platforms',
        skills: [
          { name: 'Git / GitHub', level: 'expert' as const, years: 12 },
          { name: 'Vercel', level: 'advanced' as const, years: 4 },
          { name: 'AWS', level: 'intermediate' as const, years: 3 },
          { name: 'Storybook', level: 'advanced' as const, years: 4 },
        ],
      },
    ],
  },

  // ─── 프로젝트 ───────────────────────────────────────────────
  Project: {
    intro:
      '저는 기획과 개발의 경계를 허무는 Full-Side Product Engineer입니다. 단순히 기능을 구현하는 것이 아니라, 비즈니스 전략을 기술 구조로 정교하게 전환하는 역할을 수행합니다. 에듀테크, 커머스(배민상회), 공교육(EBS) 도메인을 넘나들며 전략 수립 → UX 설계 → 프론트엔드 아키텍처 설계 → 구현 → 확장까지 제품의 전 과정을 주도해왔습니다. 현재는 AI 기반 자동화 워크플로우를 적극 활용하여 개발 속도와 품질을 동시에 끌어올리는 데 집중하고 있습니다.',
    cases: [
      {
        id: 'mata-renewal',
        title: 'AI 마타수학 서비스 2026 리뉴얼 주도',
        company: '마타에듀',
        Project:
          '서비스 전략 제안부터 전체 정보구조(IA) 재설계, 프론트엔드 아키텍처 개편까지 리뉴얼 전 과정을 주도했습니다. AI 도구를 기획·설계·개발 단계에 통합하여, 복잡한 교육 도메인의 요구사항을 기술 명세로 빠르게 정제하고 제품화하는 프로세스를 구축했습니다.',
        execution:
          'React / Next.js / TypeScript / Redux 기반 구조 개선 및 공통 컴포넌트 체계 정립. 기획과 개발 간 간극을 줄이는 협업 방식을 설계했습니다.',
        tools: 'Figma (Design, Make), AI 기반 워크플로우',
        images: ['/images/project/mata-teacher.png', '/images/project/mata-student.png'],
      },
      {
        id: 'mata-multiplatform',
        title: 'AI 마타수학 멀티 플랫폼 확장 및 EBS 공급',
        company: '마타에듀',
        Project:
          "초등·중고등·대학 과정으로 확장되는 AI 진단 기반 학습 플랫폼의 안정적 운영과 구조 확장을 이끌었습니다. 'EBS 초등온' 납품을 통해 공교육 환경에서 요구되는 서비스 안정성과 품질 기준을 충족했습니다.",
        execution:
          '대상별 학습 UX 구조 설계 및 프론트엔드 최적화 수행. 대규모 사용 환경에서도 일관성을 유지할 수 있도록 공통 UI/컴포넌트 구조를 설계했습니다.',
        images: ['/images/project/mata-elementary.png', '/images/project/mata-middle-high.png'],
      },
      {
        id: 'paddly',
        title: '패들리(Paddly) 모둠활동 서비스 기획 및 설계',
        company: '마타에듀',
        Project:
          '실시간 인터랙티브 학급 활동 플랫폼의 서비스 전략 수립과 UX 설계를 총괄했습니다. 교사가 직접 활동을 설계·공유할 수 있는 구조를 정의했습니다.',
        execution:
          'Figma 기반 인터랙션 설계 및 프로토타이핑. Make(업무 자동화) 도입으로 기획 산출물 생성 프로세스를 체계화했습니다.',
        images: ['/images/project/paddly.png'],
      },
      {
        id: 'cool-hanja',
        title: '쿨한자(Cool-Hanja) MVP 풀스택 개발',
        company: '개인 프로젝트',
        Project:
          '아이디어 단계에서 시장 검증을 목표로 기획·설계·개발·배포까지 전 과정을 단독 수행한 EdTech MVP입니다.',
        execution:
          'Next.js 기반 풀스택 구조 설계 및 Vercel 배포. AI 워크플로우를 활용해 개발 속도를 단축하고 초기 서비스 완성도를 확보했습니다.',
        images: ['/images/project/cool-hanja.png'],
      },
      {
        id: 'momtoring',
        title: '맘토링(Momtoring) 서비스 전략 기획 및 UX 설계',
        company: '개인 프로젝트',
        Project:
          '고입·대입 입시 시장의 정보 비대칭 문제 해결을 목표로 한 멘토링 매칭 플랫폼을 기획했습니다. 학부모 고민 등록 → 전문가 매칭 → 컨설팅 구조를 설계했습니다.',
        execution: '서비스 구조 정의 및 비즈니스 모델 설계. 2025년 K-Startup 사업지원 준비.',
      },
      {
        id: 'baemin-admin',
        title: '배민상회 어드민 시스템 및 권한 관리',
        company: '우아한형제들',
        Project:
          '배민상회 Admin 및 권한 관리 시스템의 성능 최적화와 UI 체계 정립에 기여했습니다. 대규모 데이터 환경에서의 안정성과 유지보수성을 개선했습니다.',
        execution:
          'React-Query 기반 데이터 패칭 및 캐싱 구조 개선. Storybook 기반 UI 컴포넌트 시스템 구축. GitLab·Jira 기반 애자일 협업 수행.',
      },
    ],
  },
} as const;

// ─── 타입 추출 ────────────────────────────────────────────────────
export type Resume = typeof resume;
export type Experience = (typeof resume.career.experiences)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type ProjectCase = (typeof resume.Project.cases)[number];
