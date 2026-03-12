---
description: 카카오 로그인 인증 — OAuth 2.0, 첫 로그인 시 자동 회원가입, ZIP 다운로드 시에만 로그인 필요
---

# 인증 — 카카오 로그인

선행: `pdf-1.spec.md` 확인 필수.

**핵심 정책**: PDF 업로드 → 변환 → 편집 → 포트폴리오 미리보기는 **로그인 없이 공개**.
**ZIP 다운로드**만 카카오 로그인 필요.

---

## 개발 범위

1. 카카오 OAuth 2.0 연동 (NextAuth.js)
2. 첫 로그인 → 자동 회원가입 (별도 폼 없음)
3. Middleware — `/api/portfolio/zip` 만 인증 보호
4. 로그인 유도 모달 (ZIP 다운로드 시) + 세션 헤더 UI

---

## Step 0: 카카오 Developers 설정

[Kakao Developers](https://developers.kakao.com) 에서 앱 생성 후 설정:

```
앱 설정 → 플랫폼
  Web 사이트 도메인: http://localhost:3000

앱 설정 → 카카오 로그인
  활성화 상태: ON
  Redirect URI: http://localhost:3000/api/auth/callback/kakao

제품 설정 → 카카오 로그인 → 동의항목
  프로필 정보 (닉네임/프로필 사진): 필수
  카카오계정 (이메일): 선택 (권장)
```

`.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-32chars   # openssl rand -base64 32

KAKAO_CLIENT_ID=your_rest_api_key
KAKAO_CLIENT_SECRET=your_client_secret
```

---

## Step 1: 패키지 설치

```bash
npm install next-auth
```

---

## Step 2: 유저 스토어

`src/lib/auth/user-store.ts` 생성:

```typescript
export interface AppUser {
  id: string;            // 카카오 sub (고유 ID)
  nickname: string;
  profileImage: string;
  email: string | null;
  joinedAt: string;      // ISO 8601
  lastLoginAt: string;
}

// in-memory (재시작 시 초기화 — 프로덕션은 DB로 교체)
const users = new Map<string, AppUser>();

export const userStore = {

  /** 첫 로그인 시 자동 가입, 이후 lastLoginAt 갱신 */
  upsert(profile: Omit<AppUser, 'joinedAt' | 'lastLoginAt'>): AppUser {
    const now = new Date().toISOString();
    const existing = users.get(profile.id);

    if (existing) {
      existing.lastLoginAt = now;
      existing.nickname     = profile.nickname;      // 닉네임 변경 반영
      existing.profileImage = profile.profileImage;
      return existing;
    }

    const newUser: AppUser = { ...profile, joinedAt: now, lastLoginAt: now };
    users.set(profile.id, newUser);
    console.log(`[Auth] 신규 회원가입: ${profile.nickname} (${profile.id})`);
    return newUser;
  },

  getById(id: string): AppUser | undefined {
    return users.get(id);
  },

  getAll(): AppUser[] {
    return [...users.values()].sort((a, b) =>
      new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );
  },
};
```

---

## Step 3: NextAuth 설정

`src/app/api/auth/[...nextauth]/route.ts` 생성:

```typescript
import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import { userStore } from '@/lib/auth/user-store';

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId:     process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // 로그인 시 호출 — 자동 회원가입 처리
    async signIn({ user, profile }) {
      const kakaoProfile = profile as {
        id: number;
        kakao_account?: { email?: string };
        properties?: { nickname?: string; profile_image?: string };
      };

      userStore.upsert({
        id:           String(kakaoProfile.id ?? user.id),
        nickname:     kakaoProfile.properties?.nickname ?? user.name ?? '사용자',
        profileImage: kakaoProfile.properties?.profile_image ?? user.image ?? '',
        email:        kakaoProfile.kakao_account?.email ?? user.email ?? null,
      });

      return true; // 로그인 허용
    },

    // JWT에 카카오 ID 추가
    async jwt({ token, profile }) {
      if (profile) {
        const kakaoProfile = profile as { id: number };
        token.kakaoId = String(kakaoProfile.id);
      }
      return token;
    },

    // 세션에 kakaoId 노출
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.kakaoId as string,
      };
      return session;
    },
  },

  pages: {
    signIn: '/login',     // 커스텀 로그인 페이지
    error:  '/login',     // 에러도 로그인으로
  },

  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // 7일
});

export { handler as GET, handler as POST };
```

---

## Step 4: 타입 확장

`src/types/next-auth.d.ts` 생성:

```typescript
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    kakaoId?: string;
  }
}
```

---

## Step 5: Middleware — 라우트 보호 (최소 범위)

`src/middleware.ts` 생성:

> **핵심**: PDF 업로드 → 변환 → 편집 → 미리보기는 **공개**. ZIP 다운로드 API만 인증 보호한다.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  if (request.nextUrl.pathname.startsWith('/api/portfolio/zip') && !token) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/portfolio/zip'],
};
```

---

## Step 6: 로그인 유도 모달

> **변경**: 별도 로그인 페이지(`/login`) 대신 **모달**로 처리한다.
> ZIP 다운로드 클릭 시 미로그인이면 모달을 띄워 카카오 로그인을 유도한다.

### 6-1. 로그인 모달 컴포넌트

`src/components/auth/login-modal.tsx` 생성:

```typescript
'use client';

import { signIn } from 'next-auth/react';
import styled from 'styled-components';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl?: string;   // 로그인 후 돌아올 URL
  message?: string;        // 안내 문구 커스터마이징
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const Title = styled.h2`font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 0.5rem;`;
const Desc = styled.p`font-size: 0.9375rem; color: #666; line-height: 1.6; margin-bottom: 2rem;`;

const KakaoBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #FEE500;
  color: #191919;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  &:hover  { background: #F0D900; }
  &:active { transform: scale(0.98); }
`;

const KakaoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.611 1.546 4.906 3.896 6.326L4.5 21l4.63-2.408A11.6 11.6 0 0 0 12 19c5.523 0 10-3.477 10-8.5S17.523 3 12 3z"/>
  </svg>
);

const CloseBtn = styled.button`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { color: #555; }
`;

const Notice = styled.p`
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: #999;
  line-height: 1.6;
`;

export function LoginModal({ isOpen, onClose, callbackUrl, message }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>카카오 로그인</Title>
        <Desc>
          {message ?? 'ZIP 다운로드를 위해\n카카오 로그인이 필요합니다.'}
        </Desc>

        <KakaoBtn onClick={() => signIn('kakao', { callbackUrl: callbackUrl ?? window.location.href })}>
          <KakaoIcon />
          카카오로 로그인
        </KakaoBtn>

        <Notice>
          처음 로그인 시 자동으로 가입됩니다.
        </Notice>

        <CloseBtn onClick={onClose}>닫기</CloseBtn>
      </Card>
    </Overlay>
  );
}
```

### 6-2. 로그인 페이지 (Middleware 리디렉션용)

히스토리 페이지 접근 시 Middleware가 리디렉션할 간단한 로그인 페이지:

`src/app/login/page.tsx` 생성:

```typescript
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors?.background ?? '#f8f9fa'};
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`font-size: 1.5rem; font-weight: 700; color: #111; margin-bottom: 0.5rem;`;
const Subtitle = styled.p`font-size: 0.9375rem; color: #666; line-height: 1.6; margin-bottom: 2rem;`;

const KakaoBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  width: 100%; padding: 0.875rem 1.5rem;
  background: #FEE500; color: #191919; border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  &:hover  { background: #F0D900; }
  &:active { transform: scale(0.98); }
`;

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/pdf';

  useEffect(() => {
    if (status === 'authenticated') router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  if (status === 'loading') return null;

  return (
    <Wrapper>
      <Card>
        <Title>pofogen</Title>
        <Subtitle>
          이 기능을 사용하려면<br/>카카오 로그인이 필요합니다.
        </Subtitle>
        <KakaoBtn onClick={() => signIn('kakao', { callbackUrl })}>
          카카오로 로그인
        </KakaoBtn>
      </Card>
    </Wrapper>
  );
}
```

---

## Step 7: SessionProvider 설정

`SessionProvider`는 Client Component이므로 별도 래퍼가 필요하다.

**`src/components/auth/providers.tsx`** 생성:

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
```

**`src/app/layout.tsx`** (루트 레이아웃)에 `AuthProvider` 추가:

```typescript
import { getServerSession } from 'next-auth';
import { AuthProvider } from '@/components/auth/providers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="ko">
      <body>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Step 8: 세션 헤더 컴포넌트

> **변경**: 미로그인 사용자에게도 헤더를 표시한다. 로그인 버튼을 노출하여 자발적 로그인 유도.

`src/components/auth/session-header.tsx` 생성:

```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.primary ?? '#3182f6'};
  text-decoration: none;
`;

const NavArea = styled.div`display: flex; align-items: center; gap: 1.5rem;`;
const UserArea = styled.div`display: flex; align-items: center; gap: 0.75rem;`;
const Avatar = styled(Image)`border-radius: 50%; object-fit: cover;`;
const Nickname = styled.span`font-size: 0.9rem; font-weight: 500; color: #333;`;

const NavLink = styled(Link)`
  font-size: 0.875rem; color: #555; text-decoration: none; font-weight: 500;
  &:hover { color: ${({ theme }) => theme.colors?.primary ?? '#3182f6'}; }
`;

const LoginBtn = styled.button`
  font-size: 0.875rem; font-weight: 600;
  color: #191919;
  background: #FEE500;
  border: none; border-radius: 8px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  &:hover { background: #F0D900; }
`;

const LogoutBtn = styled.button`
  font-size: 0.8rem; color: #999; background: none;
  border: 1px solid #e2e8f0; border-radius: 6px;
  padding: 0.3rem 0.75rem; cursor: pointer;
  &:hover { color: #555; border-color: #bbb; }
`;

export function SessionHeader() {
  const { data: session } = useSession();

  return (
    <Header>
      <NavArea>
        <Logo href="/pdf">pofogen</Logo>
        {/* 네비게이션 링크 필요 시 추가 */}
      </NavArea>

      <UserArea>
        {session?.user ? (
          <>
            {session.user.image && (
              <Avatar src={session.user.image} alt="프로필" width={32} height={32} />
            )}
            <Nickname>{session.user.name ?? '사용자'}</Nickname>
            <LogoutBtn onClick={() => signOut({ callbackUrl: '/pdf' })}>
              로그아웃
            </LogoutBtn>
          </>
        ) : (
          <LoginBtn onClick={() => signIn('kakao')}>
            카카오 로그인
          </LoginBtn>
        )}
      </UserArea>
    </Header>
  );
}
```

`SessionHeader`를 PDF 레이아웃에 추가:

`src/app/pdf/layout.tsx`:

```typescript
import { SessionHeader } from '@/components/auth/session-header';

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionHeader />
      {children}
    </>
  );
}
```

---

## Step 9: API 라우트 인증 헬퍼

> **변경**: 모든 API가 아닌 **ZIP 다운로드 + 히스토리 API만** 인증 필요.
> PDF 파싱/AI 보완 API는 공개.

`src/lib/auth/require-session.ts` 생성:

```typescript
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/** API 라우트에서 세션 검증 — 미인증 시 401 반환 */
export async function requireSession() {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 }),
    };
  }
  return { session, response: null };
}
```

**인증이 필요한 API 라우트에만 적용:**

```typescript
// 🔒 src/app/api/portfolio/zip/route.ts — ZIP 다운로드 (인증 필수)
export async function POST(req: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;
  // ... ZIP 생성 로직 ...
}

```

**인증이 불필요한 API 라우트 (공개):**

```typescript
// ✅ src/app/api/pdf/parse/route.ts — PDF 파싱 (공개)
export async function POST(req: NextRequest) {
  // requireSession 호출하지 않음 — 누구나 사용 가능
  // ... 파싱 로직 ...
}

// ✅ src/app/api/pdf/enrich/route.ts — AI 보완 (공개)
// ✅ src/app/api/portfolio/build/route.ts — 포트폴리오 빌드 (공개)
```

---

## 환경변수 최종 정리

`.env.local`:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                    # openssl rand -base64 32

# 카카오 OAuth
KAKAO_CLIENT_ID=                    # Kakao Developers REST API 키
KAKAO_CLIENT_SECRET=                # Kakao Developers Client Secret
```

`.env.production` (배포 시):
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=                    # 프로덕션용 별도 시크릿
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

---

## 라우트 구조 (인증 적용 후)

```
/                              ← ✅ 공개 (랜딩페이지)
/login                         ← ✅ 공개 (카카오 로그인 페이지)
/pdf                           ← ✅ 공개 (PDF 업로드)
/pdf/result                    ← ✅ 공개 (변환 결과 + 편집)
/pdf/portfolio-preview         ← ✅ 공개 (포트폴리오 미리보기)

/api/auth/[...nextauth]        ← ✅ 공개 (NextAuth 처리)
/api/pdf/parse                 ← ✅ 공개 (PDF 파싱)
/api/pdf/enrich                ← ✅ 공개 (AI 보완)
/api/portfolio/build           ← ✅ 공개 (포트폴리오 빌드)
/api/portfolio/zip             ← 🔒 로그인 필요 (401 반환)
```

---

## 완료 체크리스트

- [ ] Kakao Developers 앱 생성 + Redirect URI 등록
- [ ] `.env.local` — KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, NEXTAUTH_SECRET 설정
- [ ] `npm install next-auth`
- [ ] `src/lib/auth/user-store.ts` — 유저 스토어 (자동 가입)
- [ ] `src/app/api/auth/[...nextauth]/route.ts` — NextAuth + Kakao Provider
- [ ] `src/types/next-auth.d.ts` — 세션 타입 확장
- [ ] `src/middleware.ts` — `/api/portfolio/zip` 만 보호 (PDF 업로드/변환/미리보기는 공개)
- [ ] `src/components/auth/login-modal.tsx` — ZIP 다운로드 시 로그인 유도 모달
- [ ] `src/app/login/page.tsx` — 로그인 페이지
- [ ] `src/app/layout.tsx` — SessionProvider 추가
- [ ] `src/components/auth/session-header.tsx` — 로그인/미로그인 모두 표시 (로그인 버튼 or 닉네임+로그아웃)
- [ ] `src/app/pdf/layout.tsx` — SessionHeader 포함
- [ ] `src/lib/auth/require-session.ts` — API 인증 헬퍼
- [ ] `/api/portfolio/zip` — requireSession 적용 (파싱/보완 API는 공개)
- [ ] 미로그인으로 PDF 업로드 → 변환 → 미리보기 정상 동작 확인
- [ ] ZIP 다운로드 시 미로그인 → 로그인 모달 → 로그인 후 자동 다운로드 확인

---

## Rules

- **구현 프로젝트는 `c:\work\jione-transformer`** — `jione-portfolio`가 아닌 `jione-transformer`에 모든 코드를 작성한다
- pm-portfolio(pm-site-builder) 에이전트와 커맨드는 변경하지 않는다
- 리뷰 완료 후 수정사항이 있으면 **confirm 없이 바로 진행**한다 — 사용자에게 진행 여부를 묻지 않는다
