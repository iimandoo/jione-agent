---
description: 포트폴리오에 토스(Toss) 스타일 디자인 시스템을 적용합니다
argument-hint: "<강조할 포인트 컬러 (선택, 기본: Toss Blue #3182F6)>"
---

포트폴리오 프로젝트에 토스 스타일 디자인 시스템을 적용합니다.

## 사전 체크

아래 파일들을 Read 툴로 읽어 현재 상태를 파악하세요:
- `portfolio/src/app/globals.css` — 현재 CSS 변수
- `portfolio/tailwind.config.ts` (없으면 `tailwind.config.js`) — 현재 Tailwind 설정
- `portfolio/src/components/ui/button.tsx` — 버튼 컴포넌트
- `portfolio/src/components/ui/badge.tsx` — 배지 컴포넌트
- `portfolio/src/components/ui/card.tsx` — 카드 컴포넌트

## 토스 디자인 시스템 토큰

### 컬러
```
--background:        #FFFFFF
--foreground:        #1B1C1F
--primary:           "$ARGUMENTS" 있으면 해당 컬러, 없으면 #3182F6  (Toss Blue)
--primary-foreground:#FFFFFF
--secondary:         #F2F4F6
--secondary-foreground: #4E5968
--muted:             #F9FAFB
--muted-foreground:  #8B95A1
--border:            #E5E8EB
--card:              #FFFFFF
--card-foreground:   #1B1C1F
--destructive:       #FF4D4F
--radius:            0.75rem   (12px — 토스 특유의 둥근 모서리)
```

### 타이포그래피
- 폰트: `Pretendard Variable` (Google Fonts 또는 CDN)
- layout.tsx의 폰트를 Geist → Pretendard로 교체
- 제목 font-weight: 700, 본문: 400~500, 보조: 400

### 쉐도우 (토스 카드 스타일)
```
--shadow-sm:  0 1px 4px rgba(0,0,0,0.06)
--shadow-md:  0 4px 16px rgba(0,0,0,0.08)
--shadow-lg:  0 8px 32px rgba(0,0,0,0.10)
```

## Steps

1. **globals.css 업데이트**
   - `:root` CSS 변수를 위 토큰으로 교체
   - `body` 에 `font-family: 'Pretendard Variable', -apple-system, sans-serif` 추가
   - smooth scroll, antialiased 확인

2. **layout.tsx 업데이트**
   - Geist 폰트 import 제거
   - Pretendard CDN link 태그 추가 (`<link>` in `<head>`)
   - `<html>` className 정리

3. **섹션 컴포넌트 스타일 보정**
   - `portfolio/src/components/sections/` 하위 파일들을 Read 후
   - 배경 교대 패턴: `bg-white` / `bg-[#F9FAFB]` (회색 대신 극도로 옅은 회색)
   - 카드에 `shadow-sm` + `rounded-xl` 적용
   - 버튼 primary: `bg-[#3182F6]` hover `bg-[#1B64DA]` (또는 --primary 변수 사용)
   - 섹션 헤딩: `tracking-tight font-bold`

4. **빌드 확인**
   ```bash
   cd portfolio && npm run build
   ```
   빌드 에러가 있으면 수정 후 재시도

5. **완료 보고**
   변경된 파일 목록과 적용된 토큰 요약 출력

## Rules

- shadcn/ui 컴포넌트 내부 코드는 수정하지 말고 CSS 변수로만 제어
- 기존 콘텐츠(텍스트, 이미지 경로, data.ts)는 절대 변경하지 않음
- 빌드 성공까지 완료로 간주
- 폰트 로딩은 `next/font` 또는 `<link>` 중 현재 프로젝트 방식에 맞춰 적용
