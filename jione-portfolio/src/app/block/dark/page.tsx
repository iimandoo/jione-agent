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

// ─── 콘텐츠 데이터 (data/resume.ts 기준) ──────────────────────────
// data/resume.ts 를 수정한 경우 /sample-page-create 명령어로 재생성하세요.

const profile = {
  name: '이지혜',
  title: 'Full-Side Product Engineer',
  subtitle: '전략 기획 · UX 설계 · 개발',
  bio: '기획의 의도를 기술 명세로 전환하고, 디자인과 개발의 경계를 허물어 비즈니스 가치를 제품으로 빠르게 구현하는 Full-Side 엔지니어입니다. AI 도구와 자동화 프로세스를 적극 활용하여 개발 생산성을 극대화하며, 사용자 중심의 서비스 구조 개선에 강점이 있습니다.',
  email: 'euneundh@gmail.com',
  phone: '010-7205-0408',
  github: 'https://github.com/iimandoo',
};

const experiences = [
  { id: 'exp-1', company: '(주)마타에듀', position: '차장', period: { start: '2023.03', end: 'present' }, description: '서비스 전략 제안 및 PM, 기획 및 프론트엔드 개발' },
  { id: 'exp-2', company: '프리랜서', position: '프리랜서 개발자', period: { start: '2014.01', end: '2022.12' }, description: 'React / TypeScript 기반 프론트엔드 개발' },
  { id: 'exp-3', company: '㈜한양정보통신', position: '프리랜서', period: { start: '2012.07', end: '2013.08' }, description: '서브셋엔진 개발 (JQuery), UI개발 (HTML5)' },
  { id: 'exp-4', company: '㈜GRETECH JAPAN', position: 'PM', period: { start: '2007.12', end: '2011.02' }, description: '서비스/웹 기획·운영·고객 대응, 개발 (CGI, VC++/Xcode), 퍼블리싱 (HTML, Javascript)' },
  { id: 'exp-5', company: '㈜AlquiMedia', position: '매니저', period: { start: '2007.01', end: '2007.09' }, description: '웹 기획, 웹 운영, ASP/PHP/AJAX 개발' },
  { id: 'exp-6', company: '㈜아이온 글로벌', position: '사원', period: { start: '2005.01', end: '2006.06' }, description: 'UI 기획, ASP/JSP/AJAX/VC++ 개발' },
  { id: 'exp-7', company: '㈜GettoSoft', position: '팀장', period: { start: '2003.07', end: '2004.12' }, description: '금융권 WEB 시스템 기획, 프로젝트 관리, VC++/ASP 개발' },
  { id: 'exp-8', company: '㈜ITWILL', position: '강사', period: { start: '2001.12', end: '2002.12' }, description: 'C, C++, VC++ 언어 강의' },
];

const skillCategories = [
  { name: 'Frontend', skills: [{ name: 'React', level: 'expert' }, { name: 'Next.js', level: 'expert' }, { name: 'TypeScript', level: 'expert' }, { name: 'Styled-Components', level: 'advanced' }, { name: 'Redux', level: 'advanced' }, { name: 'JavaScript', level: 'advanced' }, { name: 'Recoil', level: 'intermediate' }, { name: 'Tailwind CSS', level: 'intermediate' }] },
  { name: '기획 / PM', skills: [{ name: '서비스 전략', level: 'expert' }, { name: 'UX/UI 설계', level: 'expert' }, { name: 'PRD 작성', level: 'expert' }, { name: 'Figma', level: 'advanced' }, { name: 'Make (자동화)', level: 'advanced' }, { name: 'Notion', level: 'advanced' }] },
  { name: 'AI / 자동화', skills: [{ name: 'Claude Code', level: 'advanced' }, { name: 'Gemini', level: 'advanced' }, { name: 'GCP Vertex AI', level: 'intermediate' }, { name: 'AI 워크플로우', level: 'intermediate' }] },
  { name: 'Infrastructure', skills: [{ name: 'Vercel', level: 'advanced' }, { name: 'AWS', level: 'intermediate' }, { name: 'Storybook', level: 'intermediate' }, { name: 'GitLab', level: 'intermediate' }, { name: 'Jira', level: 'intermediate' }] },
];

const projectIntro = 'AI 기반 EdTech부터 어드민 시스템 프로젝트들입니다.';

const projectCases = [
  { id: 'ai-mata', title: 'AI마타수학 2026년 리뉴얼', company: '(주)마타에듀', role: '전략, 서비스 기획, 프론트엔드 개발, 매뉴얼 제작', description: 'AI 진단 기반 수학 학습 플랫폼. 교사는 수업을 설계하고, 학생은 개인 맞춤 학습으로 실력을 키웁니다. 초등·중고등 전 과정을 커버하며 EBS 초등온에 납품된 서비스입니다.', execution: 'Next.js, React, TypeScript, Redux', tools: 'Notion, Figma, Figma(Design, Make), GCP Vertex AI, Arcade', year: '2023 ~ 현재', images: ['/projects/AI마타수학2026_선생님 홈화면_1.png', '/projects/AI마타수학2026_선생님 수업현황보드.png', '/projects/AI마타수학2026_선생님 문제풀이.png', '/projects/AI마타수학2026_학생 홈화면_2.png', '/projects/AI마타수학2026_학생 문제풀이.png', '/projects/AI마타수학2026_학생_AI첨삭.png'] },
  { id: 'ai-mata-highschool', title: 'AI마타수학 (중고등)', company: '(주)마타에듀', role: '프론트엔드 개발', description: '중학교·고등학교 대상 AI 수학 학습 플랫폼. 교사는 커리큘럼·문제풀이·실시간 현황보드로 수업을 운영하고, 보고서 기능으로 학생 성취를 분석합니다.', execution: 'React, TypeScript, Redux', tools: 'Notion', year: '2023 ~ 현재', images: ['/projects/AI마타수학_중고등_선생님_홈.png', '/projects/AI마타수학_중고등_선생님_커리큘럼.png', '/projects/AI마타수학_중고등_선생님_실시간현황보드.png', '/projects/AI마타수학_중고등_선생님_문제풀이.png', '/projects/AI마타수학_중고등_선생님_보고서.png', '/projects/AI마타수학_중고등_학생_홈.png'] },
  { id: 'ai-mata-elementary', title: 'AI마타수학 (초등)', company: '(주)마타에듀', role: 'PM', description: '초등학교 대상 AI 수학 학습 플랫폼. 그림 로그인으로 어린 학생도 쉽게 접근하며, 교사는 커리큘럼과 문제풀이를 직접 구성합니다. EBS 초등온에 납품된 서비스입니다.', execution: 'React, TypeScript, Redux', tools: 'Notion, Figma', year: '2023 ~ 현재', images: ['/projects/AI마타수학_초등_선생님_홈.png', '/projects/AI마타수학_초등_선생님_커리큘럼.png', '/projects/AI마타수학_초등_선생님_문제풀이.png', '/projects/AI마타수학_초등_학생_홈.png', '/projects/AI마타수학_초등_학생_그림로그인.png'] },
  { id: 'paddly', title: '패들리', company: '(주)마타에듀', role: 'PM, 서비스 기획', description: '수학 모둠활동 서비스. 교사가 수업 활동을 직접 만들고 공유하는 학급 활동 플랫폼으로, 카드 뒤집기·퀴즈·마법대전·퍼즐맞추기 등 다양한 인터랙티브 활동을 지원합니다.', execution: 'Figma, Make(업무자동화)', tools: 'Notion', year: '2025', images: ['/projects/패들리_홈.png', '/projects/패들리_카드뒤집기1.png', '/projects/패들리_카드뒤집기2.png', '/projects/패들리_마법대전1.png', '/projects/패들리_마법대전2.png', '/projects/패들리_퍼즐맞추기1.png', '/projects/패들리_퍼즐맞추기2.png'] },
  { id: 'cool-hanja', title: '쿨한자', company: '개인 사이드 프로젝트', role: 'PM, 서비스 기획, 개발', description: '한자 학습 서비스. 학년·급수 설정부터 한자 카드·뜻음 학습까지 지원. Next.js 풀스택으로 직접 구축하고 Vercel에 배포한 EdTech MVP 서비스입니다.', execution: 'Next.js, TypeScript, Vercel', tools: 'AI (Claude, Gemini)', year: '2025', images: ['/projects/쿨한자_한자카드.png', '/projects/쿨한자_뜻음.png', '/projects/쿨한자_학년설정.png', '/projects/쿨한자_급수설정.png', '/projects/쿨한자_한자추가.png'] },
  { id: 'modofit', title: '모도핏', company: '개인 사이드 프로젝트', role: '프론트엔드 개발', description: '운동 기록·인바디 관리 서비스. 로그인 후 홈 대시보드에서 캘린더 기반 운동 이력을 확인하고, 인바디 측정 데이터를 관리할 수 있는 헬스케어 플랫폼입니다.', execution: 'Next.js, TypeScript, Vercel', tools: 'AI (Claude, Gemini)', year: '2025', images: ['/projects/모도핏_홈.png', '/projects/모도핏_홈_로그인후.png', '/projects/모도핏_홈_캘린더.png', '/projects/모도핏_인바디.png'] },
  { id: 'baemin-sangwoe', title: '배민상회 Admin', company: '우아한형제들', role: '프론트엔드 개발', description: '배민상회 어드민 시스템 및 권한관리 서비스 개발. React-Query 기반 데이터 패칭 최적화와 Storybook을 통한 UI 컴포넌트 시스템을 구축했습니다.', execution: 'React, TypeScript, Styled-Components, React-Query, Storybook', tools: 'GitLab, Jira', year: '2014 ~ 2022', images: [] },
];

export default function Page() {
  return (
    <Main>
      <HeroSection
        name={profile.name}
        title={profile.title}
        subtitle={profile.subtitle}
        bio={profile.bio}
      />
      <AboutSection
        experiences={experiences}
        skillCategories={skillCategories}
      />
      <ProjectsSection
        intro={projectIntro}
        cases={projectCases}
      />
      <ContactSection
        email={profile.email}
        phone={profile.phone}
        github={profile.github}
      />
    </Main>
  );
}
