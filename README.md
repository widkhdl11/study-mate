# Study Mate

> 함께 성장하는 스터디 문화 - 스터디 모집 플랫폼

스터디를 만들고 찾고, 참가 신청부터 채팅까지 이어지는 원스톱 스터디 매칭 서비스입니다.

## 프로젝트 개요

- **스터디 CRUD**: 스터디 생성·수정·조회
- **게시글 CRUD**: 모집글 작성·수정·삭제
- **참가 신청**: 신청 → 승인/거절 → 알림
- **실시간 채팅**: Supabase Realtime 기반 채팅
- **AI 추천**: 프로필 기반 GPT 추천 스터디
- **알림**: 참가 요청, 수락/거절, 탈퇴 등

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router), React 19 |
| Backend/BaaS | Supabase (Auth, DB, Storage, Realtime) |
| 상태 관리 | TanStack Query (서버 상태) |
| 폼 | React Hook Form + Zod |
| 스타일 | Tailwind CSS, Radix UI, shadcn/ui |
| AI | OpenAI (GPT-3.5-turbo) |

## 디렉터리 구조

```
study-mate/
├── app/
│   ├── (main)/          # 메인 라우트 (Header, Footer 포함)
│   │   ├── page.tsx     # 홈
│   │   ├── auth/        # 로그인, 회원가입
│   │   ├── posts/       # 게시글 목록·상세·생성·수정
│   │   ├── studies/     # 스터디 목록·상세·생성·수정
│   │   └── profile/     # 프로필, 내 스터디·게시글
│   └── (chat)/          # 채팅 전용 레이아웃
│       └── chat/[id]/
├── actions/             # Server Actions
│   ├── authAction.ts
│   ├── postAction.ts
│   ├── studyAction.ts
│   ├── participantAction.ts
│   ├── chatAction.ts
│   ├── agentActions.ts  # AI 추천
│   └── ...
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── post/
│   ├── profile/
│   └── ...
├── hooks/               # React Query 훅, 비즈니스 훅
├── lib/
│   ├── supabase/       # Supabase 클라이언트 (client, server, admin)
│   ├── zod/schemas/    # Zod 스키마
│   └── constants/      # 지역, 카테고리 등
└── config/             # React Query Provider 등
```

## 시작 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 변수를 설정하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
# Storage 버킷 (필요 시)
NEXT_PUBLIC_STORAGE_BUCKET_POST=post-images
NEXT_PUBLIC_STORAGE_BUCKET_PROFILE=avatars
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 스크립트 | 설명 |
|---------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run generate-types` | Supabase DB 타입 생성 (`types_db.ts`) |

## 상세 문서

프로젝트 기여 내용, 문제 해결 과정, 라이브러리 선정 이유 등은 [PROJECT_PORTFOLIO.md](./PROJECT_PORTFOLIO.md)를 참고하세요.
