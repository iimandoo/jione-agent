// data/resume.ts
// ⚠️ 포트폴리오 콘텐츠 단일 소스 — 이 파일만 수정하면 전체 반영됩니다.

export const resume = {
  // ─── SEO & 메타데이터 ────────────────────────────────────────────
  meta: {
    siteTitle: 'Jihye Lee | Full-Side Engineer',
    siteDescription:
      'AI-driven product development & automation. Full-Stack engineer with 20 years of experience in EdTech, Commerce, and Public Education.',
    siteUrl: 'https://yourportfolio.com',
    ogImage: '/images/og-image.jpg',
    author: 'Jihye Lee',
    keywords: ['Full-Stack Engineer', 'Next.js', 'React', 'TypeScript', 'AI Automation', 'EdTech'],
    theme: {
      primaryColor: '#3182F6',
      accentColor: '#000000',
    },
  },

  // ─── 기본 프로필 ─────────────────────────────────────────────────
  profile: {
    name: 'Jihye Lee',
    title: 'Full-Side Engineer',
    subtitle: 'AI-Driven Product Development & Automation',
    email: 'your.email@example.com',
    phone: '+82-10-xxxx-xxxx',
    location: 'Seoul, South Korea',
    bio: 'Full-Side Product Engineer with 20 years of experience in EdTech, Commerce, and Public Education. Specialized in AI-driven automation workflows and Next.js-based platform architecture.',
    image: '/images/profile.jpg',
    social: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
    },
    availability: {
      status: 'open' as const,
      message: 'Available for contract, freelance, or full-time roles',
    },
  },

  // ─── 경력 타임라인 ───────────────────────────────────────────────
  career: {
    summary:
      '20년 경력의 Full-Side Product Engineer로 EdTech, Commerce, Public Education 도메인을 넘나들며 제품 전략 수립부터 기술 구현까지 전 과정을 주도해왔습니다.',
    experiences: [
      {
        id: 'mata-edu',
        company: '마타에듀',
        position: 'Product Engineer (AI 마타수학 팀)',
        period: { start: '2024-01', end: 'present' },
        description: 'AI 기반 진단 학습 플랫폼의 전략 수립부터 프론트엔드 아키텍처 설계 및 구현',
        highlights: [
          'Next.js 기반 마타수학 2026 리뉴얼 주도',
          'React / Redux 구조 개선 및 공통 컴포넌트 체계 정립',
          'AI 워크플로우를 통한 개발 속도 3배 향상',
          'EBS 초등온 납품 (공교육 표준화)',
        ],
        skills: ['Next.js', 'React', 'TypeScript', 'Redux', 'Figma', 'AI Automation'],
      },
      {
        id: 'woowa-brothers',
        company: '우아한형제들',
        position: 'Frontend Engineer (배민상회 Admin)',
        period: { start: '2022-06', end: '2023-12' },
        description: '배민상회 어드민 시스템의 성능 최적화 및 UI 체계 정립',
        highlights: [
          'React-Query 기반 데이터 패칭 및 캐싱 구조 개선',
          'Storybook 기반 UI 컴포넌트 시스템 구축',
          '대규모 데이터 환경에서의 안정성 및 유지보수성 개선',
        ],
        skills: ['React', 'React-Query', 'Storybook', 'TypeScript', 'Redux'],
      },
      {
        id: 'freelance',
        company: '자유계약자',
        position: 'Full-Stack Engineer',
        period: { start: '2020-01', end: '2022-05' },
        description: 'EdTech MVP 개발 및 개인 프로젝트 진행',
        highlights: [
          'Cool-Hanja MVP 개발 (Next.js + Vercel 배포)',
          'Momtoring 서비스 기획 및 UX 설계',
          'AI 기반 콘텐츠 자동화 워크플로우 구축',
        ],
        skills: ['Next.js', 'TypeScript', 'Vercel', 'Claude API'],
      },
    ],
  },

  // ─── 주요 프로젝트 ───────────────────────────────────────────────
  projects: [
    {
      id: 'mata-math-renewal',
      title: 'AI 마타수학 2026 리뉴얼',
      company: '마타에듀',
      description:
        '교육 도메인의 복잡한 요구사항을 AI 워크플로우로 빠르게 정제하고, 전체 IA 재설계 및 프론트엔드 아키텍처 개편을 주도한 리뉴얼 프로젝트',
      role: 'Lead Product Engineer',
      period: { start: '2024-01', end: 'present' },
      impact: [
        '기획 → 설계 → 개발까지 Full-Side 주도',
        'AI 도구 활용으로 개발 속도 3배 향상',
        '복잡한 교육 도메인을 기술 명세로 빠르게 정제',
      ],
      tech: ['Next.js 16', 'React 19', 'TypeScript', 'Redux', 'Styled-Components', 'Claude API'],
      link: 'https://mata-math.com',
      image: '/images/projects/mata-math.png',
    },
    {
      id: 'baemin-sangkoe-admin',
      title: '배민상회 어드민 시스템',
      company: '우아한형제들',
      description: '대규모 데이터 환경에서의 어드민 시스템 성능 최적화 및 UI 컴포넌트 시스템 정립',
      role: 'Frontend Engineer',
      period: { start: '2022-06', end: '2023-12' },
      impact: [
        'React-Query 기반 캐싱으로 API 호출 50% 감소',
        'Storybook 도입으로 UI 일관성 확보',
        '대규모 데이터 테이블 성능 최적화',
      ],
      tech: ['React', 'React-Query', 'TypeScript', 'Storybook', 'Redux'],
      image: '/images/projects/baemin-admin.png',
    },
    {
      id: 'cool-hanja-mvp',
      title: '쿨한자(Cool-Hanja) MVP',
      company: '개인 프로젝트',
      description:
        '한자 학습을 위한 EdTech MVP. 아이디어 → 기획 → 설계 → 개발 → 배포까지 풀스택으로 단독 진행',
      role: 'Founder & Full-Stack Engineer',
      period: { start: '2021-06', end: '2022-03' },
      impact: ['3개월 만에 MVP 완성 및 Vercel 배포', 'AI 워크플로우로 개발 속도 단축'],
      tech: ['Next.js', 'TypeScript', 'Vercel', 'Claude API'],
      github: 'https://github.com/yourusername/cool-hanja',
      image: '/images/projects/cool-hanja.png',
    },
  ],

  // ─── 기술 스택 ───────────────────────────────────────────────────
  skills: {
    categories: [
      {
        name: 'Frontend',
        skills: [
          { name: 'React', level: 'expert' as const, years: 8 },
          { name: 'Next.js', level: 'expert' as const, years: 6 },
          { name: 'TypeScript', level: 'expert' as const, years: 5 },
          { name: 'Styled-Components', level: 'expert' as const, years: 5 },
          { name: 'Framer Motion', level: 'advanced' as const, years: 3 },
          { name: 'React Query', level: 'advanced' as const, years: 3 },
          { name: 'Redux', level: 'advanced' as const, years: 5 },
        ],
      },
      {
        name: 'Design & UX',
        skills: [
          { name: 'Figma', level: 'advanced' as const, years: 4 },
          { name: 'UI/UX Design', level: 'advanced' as const, years: 7 },
          { name: 'Design Systems', level: 'advanced' as const, years: 5 },
        ],
      },
      {
        name: 'AI & Automation',
        skills: [
          { name: 'Claude API', level: 'advanced' as const, years: 2 },
          { name: 'Prompt Engineering', level: 'advanced' as const, years: 2 },
          {
            name: 'Make (Automation)',
            level: 'intermediate' as const,
            years: 2,
          },
        ],
      },
      {
        name: 'Tools & Platforms',
        skills: [
          { name: 'Vercel', level: 'advanced' as const, years: 4 },
          { name: 'Git / GitHub', level: 'expert' as const, years: 10 },
          { name: 'Storybook', level: 'advanced' as const, years: 3 },
        ],
      },
    ],
  },

  // ─── 임팩트 케이스 ───────────────────────────────────────────────
  impact: {
    intro:
      '저는 기획과 개발의 경계를 허무는 Full-Side Product Engineer입니다. 단순히 기능을 구현하는 것이 아니라, 비즈니스 전략을 기술 구조로 정교하게 전환하는 역할을 수행합니다. 에듀테크, 커머스(배민상회), 공교육(EBS) 도메인을 넘나들며 전략 수립 → UX 설계 → 프론트엔드 아키텍처 설계 → 구현 → 확장까지 제품의 전 과정을 주도해왔습니다. 현재는 AI 기반 자동화 워크플로우를 적극 활용하여 개발 속도와 품질을 동시에 끌어올리는 데 집중하고 있습니다.',
    cases: [
      {
        id: 'mata-renewal',
        title: 'AI 마타수학 서비스 2026 리뉴얼 주도',
        company: '마타에듀',
        impact:
          '서비스 전략 제안부터 전체 정보구조(IA) 재설계, 프론트엔드 아키텍처 개편까지 리뉴얼 전 과정을 주도했습니다. AI 도구를 기획·설계·개발 단계에 통합하여, 복잡한 교육 도메인의 요구사항을 기술 명세로 빠르게 정제하고 제품화하는 프로세스를 구축했습니다.',
        execution:
          'React / Next.js / TypeScript / Redux 기반 구조 개선 및 공통 컴포넌트 체계 정립. 기획과 개발 간 간극을 줄이는 협업 방식을 설계했습니다.',
        tools: 'Figma (Design, Make), AI 기반 워크플로우',
      },
      {
        id: 'mata-multiplatform',
        title: 'AI 마타수학 멀티 플랫폼 확장 및 EBS 공급',
        company: '마타에듀',
        impact:
          "초등·중고등·대학 과정으로 확장되는 AI 진단 기반 학습 플랫폼의 안정적 운영과 구조 확장을 이끌었습니다. 'EBS 초등온' 납품을 통해 공교육 환경에서 요구되는 서비스 안정성과 품질 기준을 충족했습니다.",
        execution:
          '대상별 학습 UX 구조 설계 및 프론트엔드 최적화 수행. 대규모 사용 환경에서도 일관성을 유지할 수 있도록 공통 UI/컴포넌트 구조를 설계했습니다.',
      },
      {
        id: 'paddly',
        title: '패들리(Paddly) 모둠활동 서비스 기획 및 설계',
        company: '마타에듀',
        impact:
          '실시간 인터랙티브 학급 활동 플랫폼의 서비스 전략 수립과 UX 설계를 총괄했습니다. 교사가 직접 활동을 설계·공유할 수 있는 구조를 정의했습니다.',
        execution:
          'Figma 기반 인터랙션 설계 및 프로토타이핑. Make(업무 자동화) 도입으로 기획 산출물 생성 프로세스를 체계화했습니다.',
      },
      {
        id: 'cool-hanja',
        title: '쿨한자(Cool-Hanja) MVP 풀스택 개발',
        company: '개인 프로젝트',
        impact:
          '아이디어 단계에서 시장 검증을 목표로 기획·설계·개발·배포까지 전 과정을 단독 수행한 EdTech MVP입니다.',
        execution:
          'Next.js 기반 풀스택 구조 설계 및 Vercel 배포. AI 워크플로우를 활용해 개발 속도를 단축하고 초기 서비스 완성도를 확보했습니다.',
      },
      {
        id: 'momtoring',
        title: '맘토링(Momtoring) 서비스 전략 기획 및 UX 설계',
        company: '개인 프로젝트',
        impact:
          '고입·대입 입시 시장의 정보 비대칭 문제 해결을 목표로 한 멘토링 매칭 플랫폼을 기획했습니다. 학부모 고민 등록 → 전문가 매칭 → 컨설팅 구조를 설계했습니다.',
        execution: '서비스 구조 정의 및 비즈니스 모델 설계. 2025년 K-Startup 사업지원 준비.',
      },
      {
        id: 'baemin-admin',
        title: '배민상회 어드민 시스템 및 권한 관리',
        company: '우아한형제들',
        impact:
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
export type Project = (typeof resume.projects)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type ImpactCase = (typeof resume.impact.cases)[number];
