// data/resume.ts
// portfolio content single source — modify only this file to reflect changes everywhere.
// ⚠️ 이 파일을 수정한 후 /sample-page-create 로 page.tsx를 재생성하세요.

export const resume = {
  // SEO & metadata
  meta: {
    siteTitle: "이지혜 포트폴리오",
    siteDescription:
      "Full-Side Product Engineer 이지혜 포트폴리오 — 기획 · UX 설계 · 개발",
    siteUrl: "https://example.com",
    ogImage: "/images/og.png",
    author: "이지혜",
    keywords: [
      "포트폴리오",
      "이지혜",
      "Full-Side Product Engineer",
      "기획",
      "PM",
      "React",
      "Next.js",
      "TypeScript",
    ],
    theme: "toss",
  },

  // profile
  profile: {
    name: "이지혜",
    title: "Full-Side Product Engineer",
    subtitle: "전략 기획 · UX 설계 · 개발",
    email: "euneundh@gmail.com",
    phone: "010-7205-0408",
    location: "서울",
    availability: "협업 가능",
    bio: "기획의 의도를 기술 명세로 전환하고, 디자인과 개발의 경계를 허물어 비즈니스 가치를 제품으로 빠르게 구현하는 Full-Side 엔지니어입니다. AI 도구와 자동화 프로세스를 적극 활용하여 개발 생산성을 극대화하며, 사용자 중심의 서비스 구조 개선에 강점이 있습니다.",
    image: "/images/profile.jpg",
    social: { github: "https://github.com/iimandoo", linkedin: "" },
  },

  // career timeline
  career: {
    summary:
      "20년 이상 기획·PM·개발을 넘나들며 서비스를 만들어온 Full-Side 엔지니어",
    experiences: [
      {
        id: "exp-1",
        company: "(주)마타에듀",
        position: "차장",
        period: { start: "2023.03", end: "present" },
        description: "서비스 전략 제안 및 PM, 기획 및 프론트엔드 개발",
        achievements: ["서비스 전략 제안 및 PM", "기획 및 프론트엔드 개발"],
      },
      {
        id: "exp-2",
        company: "프리랜서",
        position: "프리랜서 개발자",
        period: { start: "2014.01", end: "2022.12" },
        description: "React / TypeScript 기반 프론트엔드 개발",
        achievements: ["React / TypeScript 프론트엔드 개발"],
      },
      {
        id: "exp-3",
        company: "㈜한양정보통신",
        position: "프리랜서",
        period: { start: "2012.07", end: "2013.08" },
        description: "서브셋엔진 개발 (JQuery), UI개발 (HTML5)",
        achievements: ["서브셋엔진 개발 (JQuery)", "UI개발 (HTML5)"],
      },
      {
        id: "exp-4",
        company: "㈜GRETECH JAPAN",
        position: "PM",
        period: { start: "2007.12", end: "2011.02" },
        description:
          "서비스/웹 기획·운영·고객 대응, 개발 (CGI, VC++/Xcode), 퍼블리싱 (HTML, Javascript)",
        achievements: [
          "서비스/웹 기획, 서비스 운영, 고객 대응",
          "개발 (CGI, VC++/Xcode)",
          "퍼블리싱 (HTML, Javascript)",
        ],
      },
      {
        id: "exp-5",
        company: "㈜AlquiMedia",
        position: "매니저",
        period: { start: "2007.01", end: "2007.09" },
        description: "웹 기획, 웹 운영, ASP/PHP/AJAX 개발",
        achievements: ["웹 기획, 웹 운영, ASP/PHP/AJAX 개발"],
      },
      {
        id: "exp-6",
        company: "㈜아이온 글로벌",
        position: "사원",
        period: { start: "2005.01", end: "2006.06" },
        description: "UI 기획, ASP/JSP/AJAX/VC++ 개발",
        achievements: ["UI 기획, ASP/JSP/AJAX/VC++ 개발"],
      },
      {
        id: "exp-7",
        company: "㈜GettoSoft",
        position: "팀장",
        period: { start: "2003.07", end: "2004.12" },
        description: "금융권 WEB 시스템 기획, 프로젝트 관리, VC++/ASP 개발",
        achievements: [
          "금융권 WEB 시스템 기획",
          "프로젝트 관리, VC++/ASP 개발",
        ],
      },
      {
        id: "exp-8",
        company: "㈜ITWILL",
        position: "강사",
        period: { start: "2001.12", end: "2002.12" },
        description: "C, C++, VC++ 언어 강의",
        achievements: ["C, C++, VC++ 언어 강의"],
      },
    ],
  },

  // projects
  Project: {
    intro: "AI 기반 EdTech부터 어드민 시스템 프로젝트들입니다.",
    cases: [
      {
        id: "ai-mata",
        title: "AI마타수학 2026년 리뉴얼",
        company: "(주)마타에듀",
        role: "전략, 서비스 기획, 프론트엔드 개발, 매뉴얼 제작",
        description:
          "AI 진단 기반 수학 학습 플랫폼. 교사는 수업을 설계하고, 학생은 개인 맞춤 학습으로 실력을 키웁니다. 초등·중고등 전 과정을 커버하며 EBS 초등온에 납품된 서비스입니다.",
        execution: "Next.js, React, TypeScript, Redux",
        tools: "Notion, Figma, Figma(Design, Make), GCP Vertex AI, Arcade",
        year: "2023 ~ 현재",
        images: [
          "/projects/AI마타수학2026_선생님 홈화면_1.png",
          "/projects/AI마타수학2026_선생님 수업현황보드.png",
          "/projects/AI마타수학2026_선생님 문제풀이.png",
          "/projects/AI마타수학2026_학생 홈화면_2.png",
          "/projects/AI마타수학2026_학생 문제풀이.png",
          "/projects/AI마타수학2026_학생_AI첨삭.png",
        ],
      },
      {
        id: "ai-mata-highschool",
        title: "AI마타수학 (중고등)",
        company: "(주)마타에듀",
        description:
          "중학교·고등학교 대상 AI 수학 학습 플랫폼. 교사는 커리큘럼·문제풀이·실시간 현황보드로 수업을 운영하고, 보고서 기능으로 학생 성취를 분석합니다.",
        execution: "React, TypeScript, Redux",
        role: "프론트엔드 개발",
        tools: "Notion",
        year: "2023 ~ 현재",
        images: [
          "/projects/AI마타수학_중고등_선생님_홈.png",
          "/projects/AI마타수학_중고등_선생님_커리큘럼.png",
          "/projects/AI마타수학_중고등_선생님_실시간현황보드.png",
          "/projects/AI마타수학_중고등_선생님_문제풀이.png",
          "/projects/AI마타수학_중고등_선생님_보고서.png",
          "/projects/AI마타수학_중고등_학생_홈.png",
        ],
      },
      {
        id: "ai-mata-elementary",
        title: "AI마타수학 (초등)",
        company: "(주)마타에듀",
        description:
          "초등학교 대상 AI 수학 학습 플랫폼. 그림 로그인으로 어린 학생도 쉽게 접근하며, 교사는 커리큘럼과 문제풀이를 직접 구성합니다. EBS 초등온에 납품된 서비스입니다.",
        execution: "React, TypeScript, Redux",
        tools: "Notion, Figma",
        year: "2023 ~ 현재",
        role: "PM",
        images: [
          "/projects/AI마타수학_초등_선생님_홈.png",
          "/projects/AI마타수학_초등_선생님_커리큘럼.png",
          "/projects/AI마타수학_초등_선생님_문제풀이.png",
          "/projects/AI마타수학_초등_학생_홈.png",
          "/projects/AI마타수학_초등_학생_그림로그인.png",
        ],
      },
      {
        id: "paddly",
        title: "패들리",
        company: "(주)마타에듀",
        description:
          "수학 모둠활동 서비스. 교사가 수업 활동을 직접 만들고 공유하는 학급 활동 플랫폼으로, 카드 뒤집기·퀴즈·마법대전·퍼즐맞추기 등 다양한 인터랙티브 활동을 지원합니다.",
        execution: "Figma, Make(업무자동화)",
        tools: "Notion",
        year: "2025",
        role: "PM, 서비스 기획",
        images: [
          "/projects/패들리_홈.png",
          "/projects/패들리_카드뒤집기1.png",
          "/projects/패들리_카드뒤집기2.png",
          "/projects/패들리_마법대전1.png",
          "/projects/패들리_마법대전2.png",
          "/projects/패들리_퍼즐맞추기1.png",
          "/projects/패들리_퍼즐맞추기2.png",
        ],
      },
      {
        id: "cool-hanja",
        title: "쿨한자",
        company: "개인 사이드 프로젝트",
        description:
          "한자 학습 서비스. 학년·급수 설정부터 한자 카드·뜻음 학습까지 지원. Next.js 풀스택으로 직접 구축하고 Vercel에 배포한 EdTech MVP 서비스입니다.",
        execution: "Next.js, TypeScript, Vercel",
        tools: "AI (Claude, Gemini)",
        role: "PM, 서비스 기획, 개발",
        year: "2025",
        urls: [{ label: "서비스 보기", href: "https://cool-hanja.vercel.app" }],
        images: [
          "/projects/쿨한자_한자카드.png",
          "/projects/쿨한자_뜻음.png",
          "/projects/쿨한자_학년설정.png",
          "/projects/쿨한자_급수설정.png",
          "/projects/쿨한자_한자추가.png",
        ],
      },
      {
        id: "modofit",
        title: "모도핏",
        company: "개인 사이드 프로젝트",
        description:
          "운동 기록·인바디 관리 서비스. 로그인 후 홈 대시보드에서 캘린더 기반 운동 이력을 확인하고, 인바디 측정 데이터를 관리할 수 있는 헬스케어 플랫폼입니다.",
        execution: "Next.js, TypeScript, Vercel",
        tools: "AI (Claude, Gemini)",
        year: "2025",
        role: "프론트엔드 개발",
        urls: [{ label: "서비스 보기", href: "https://modofit.vercel.app" }],
        images: [
          "/projects/모도핏_홈.png",
          "/projects/모도핏_홈_로그인후.png",
          "/projects/모도핏_홈_캘린더.png",
          "/projects/모도핏_인바디.png",
        ],
      },
      {
        id: "baemin-sangwoe",
        title: "배민상회 Admin",
        company: "우아한형제들",
        description:
          "배민상회 어드민 시스템 및 권한관리 서비스 개발. React-Query 기반 데이터 패칭 최적화와 Storybook을 통한 UI 컴포넌트 시스템을 구축했습니다.",
        execution:
          "React, TypeScript, Styled-Components, React-Query, Storybook",
        tools: "GitLab, Jira",
        year: "2014 ~ 2022",
        role: "프론트엔드 개발",
        images: [],
      },
    ],
  },

  // skills
  skills: {
    categories: [
      {
        name: "Frontend",
        skills: [
          { name: "React", level: "expert" as const },
          { name: "Next.js", level: "expert" as const },
          { name: "TypeScript", level: "expert" as const },
          { name: "Styled-Components", level: "advanced" as const },
          { name: "Redux", level: "advanced" as const },
          { name: "JavaScript", level: "advanced" as const },
          { name: "Recoil", level: "intermediate" as const },
          { name: "Tailwind CSS", level: "intermediate" as const },
        ],
      },
      {
        name: "기획 / PM",
        skills: [
          { name: "서비스 전략", level: "expert" as const },
          { name: "UX/UI 설계", level: "expert" as const },
          { name: "PRD 작성", level: "expert" as const },
          { name: "Figma", level: "advanced" as const },
          { name: "Make (자동화)", level: "advanced" as const },
          { name: "Notion", level: "advanced" as const },
        ],
      },
      {
        name: "AI / 자동화",
        skills: [
          { name: "Claude Code", level: "advanced" as const },
          { name: "Gemini", level: "advanced" as const },
          { name: "GCP Vertex AI", level: "intermediate" as const },
          { name: "AI 워크플로우", level: "intermediate" as const },
        ],
      },
      {
        name: "Infrastructure",
        skills: [
          { name: "Vercel", level: "advanced" as const },
          { name: "AWS", level: "intermediate" as const },
          { name: "Storybook", level: "intermediate" as const },
          { name: "GitLab", level: "intermediate" as const },
          { name: "Jira", level: "intermediate" as const },
        ],
      },
    ],
  },
} as const;

export type Resume = typeof resume;
export type Experience = (typeof resume.career.experiences)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type ProjectCase = (typeof resume.Project.cases)[number];
