# Study Mate - 프로젝트 포트폴리오

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Study Mate |
| **기간** | 진행 중 |
| **설명** | 함께 성장하는 스터디 문화 - 스터디 모집 플랫폼 |
| **기술 스택** | Next.js 16 (App Router), React 19, Supabase, TanStack Query |

---

## 2. 프로젝트에서 기여한 부분

**아키텍처·인프라**
- Next.js App Router 기반 풀스택 구조 설계 및 라우트 분리 (`(main)`, `(chat)` 그룹 라우트)
- Supabase Auth + Server Client 분리(`@supabase/ssr`)를 활용한 인증 플로우 구현
- Server Actions 패턴을 활용한 CRUD 구현 (스터디, 게시글, 참여자, 채팅, 알림)

**상태·데이터**
- TanStack Query + queryKeys 중앙 관리를 통한 서버 상태 캐싱·무효화
- TanStack Query Optimistic Update로 좋아요·스터디 참가 신청 시 UI 즉시 반영 (실패 시 롤백)
- Zustand persist로 조회수 중복 증가 방지 (viewCountStore, 24시간 만료)

**실시간·알림**
- Supabase Realtime Broadcast를 활용한 실시간 채팅 구현
- 알림 시스템 (참가 요청, 수락/거절, 탈퇴 등) 및 읽음 처리

**비즈니스 로직·UX**
- 지역·카테고리 계층형 상수 구조 설계 (`region.ts`, `study-category.ts`)
- 프로필 기반 OpenAI GPT-3.5 추천 API 연동 (AI 추천 스터디)
- 좋아요·조회수 기능 및 참가 신청·승인·거절 플로우

**폼·미디어**
- React Hook Form + Zod + `zodResolverFirstError` 커스텀으로 폼 검증 및 첫 에러만 노출
- Supabase Storage 연동 (게시글 이미지, 프로필 이미지) 및 업로드·삭제 로직 구현
- Embla Carousel 기반 이미지 갤러리 UI (게시글 상세)

---

## 3. 프로젝트를 해야 한 이유, 혹은 해결한 문제 정의

**비즈니스** (플로우 차트 1개)

### 매칭 정보 분산 및 모집 플로우 단절
스터디 모집·매칭 분산, 필터링 부재, 참가→승인→채팅 단절, 1:N 관계 부재로 반복 모집 불가.
`원스톱 플랫폼` `스터디 1:N` `필터링`

**기술** (3개)

### 실시간 경험 요구
참가 신청·승인·거절 알림, 스터디 참여자 간 실시간 소통 채널 필요.
`Supabase Realtime` `Broadcast 채널` `실시간 알림`

### 조회수 중복 카운팅
같은 사용자가 새로고침 시 반복 카운트되는 문제.
`Zustand` `persist` `클라이언트 세션`

### 사용자 액션-UI 반응성 간극
좋아요·참가 신청 등 사용자 액션 후 UI 지연으로 체감 응답성 저하.
`TanStack Query` `Optimistic Update` `서버 상태 동기화`

---

## 4. 프로젝트의 문제 해결 과정 및 선택한 해결법 선택 이유

### ① 매칭 정보 분산 및 모집 플로우 단절

**1. 문제인식** — 매칭 정보 분산 및 플로우 단절
스터디 모집·매칭 분산, 필터링 부재, 참가→채팅 단절, 글 올릴 때마다 스터디 생성으로 반복 모집 불가.
`원스톱 플랫폼` `스터디 1:N` `필터링`

**2. 해결** — 스터디 1:N 관계 설계 및 원스톱 플랫폼 통합
스터디 먼저 생성 후 여러 게시글 연결. Server Actions 기반 스터디·게시글·참가 CRUD 통합, 지역·카테고리 상수로 필터링.
`Server Actions` `지역·카테고리 상수` `CRUD 통합`

**3. 결과** — 모집 플로우 통합
스터디 생성→게시글 생성→모집 플로우 구현, 다중 모집글 작성으로 모집 활성화.
`모집 활성화` `다중 모집글` `플로우 통합`

---

### ② 실시간 경험 요구

**1. 문제인식** — Realtime Broadcast 채널 설계 필요
참가 신청·승인·거절 알림, 스터디 참여자 간 실시간 소통 채널 필요.
`Supabase Realtime` `Broadcast 채널` `스터디별 격리`

**2. 해결** — 로컬/DB 메시지 동기화 전략
로컬 메시지 즉시 표시로 빠른 피드백. DB 메시지와 병합·정렬. useChatScroll 자동 스크롤.
`Optimistic UI` `메시지 병합` `정렬 로직`

**3. 결과** — useChatScroll + 알림 시스템
자동 스크롤 훅과 실시간 알림으로 끊김 없는 채팅 경험 구현. 참가 요청·수락·거절 실시간 알림.
`Auto Scroll` `실시간 알림` `읽음 처리` `서버 부하 최소화`

---

### ③ 조회수 중복 카운팅

**1. 문제인식** — 클라이언트 세션 기반 조회 집계 부재
같은 사용자가 새로고침 시 반복 카운트되는 문제.
`Zustand` `persist` `클라이언트 세션`

**2. 해결** — viewedPostIds persist 및 만료 정책
`viewedPostIds`를 localStorage에 저장, 24시간 만료. useTrackPostView 훅으로 상세 진입 시 한 번만 API 호출.
`localStorage` `24시간 만료` `useTrackPostView`

**3. 결과** — 조회 데이터 무결성 확보
정확한 조회 통계 확보.
`조회 통계` `데이터 무결성`

---

### ④ 사용자 액션-UI 반응성 간극

**1. 문제인식** — 서버 응답 대기로 인한 UI 지연
좋아요·참가 신청 등 사용자 액션 후 UI 지연으로 체감 응답성 저하.
`TanStack Query` `Optimistic Update` `서버 상태 동기화`

**2. 해결** — Optimistic Update 패턴 적용
setQueryData로 클릭 시 즉시 카운트/상태 갱신, mutation 실패 시 롤백.
`setQueryData` `롤백` `선반영`

**3. 결과** — 즉각적 UI 반영
체감 응답성 향상.
`Optimistic UI` `체감 응답성`

---

## 5. 결과(성과)

### 스터디 플로우 완성
스터디 생성부터 참가 신청, 승인/거절, 게시글 작성까지 전체 프로세스 구현 완료.
- CRUD 기능 전체 구현
- 참가 신청·승인 플로우 완성
- 필터링·검색 기능 제공
`완성도` `UX 개선`

### 실시간 채팅·알림 안정화
Supabase Realtime으로 끊김 없는 실시간 채팅 구현 및 이벤트 기반 알림 시스템 구축.
- 실시간 대화 경험 제공
- 신뢰 가능한 알림 흐름
- 서버 부하 최소화
`실시간` `안정성`

### 조회 데이터 무결성 확보
Zustand persist 기반 조회수 중복 방지로 정확한 통계 수집.
- viewedPostIds 세션 저장 (24시간 만료)
- 상세 진입 시 1회만 API 호출
- 조회 통계 신뢰성 향상
`Zustand` `데이터 무결성`

### Optimistic UI 반영
TanStack Query setQueryData로 좋아요·참가 신청 시 즉시 UI 반영, 체감 응답성 향상.
- 클릭 즉시 카운트/상태 갱신
- mutation 실패 시 롤백
- 서버 상태 동기화
`TanStack Query` `체감 응답성`

### AI 추천 시스템 도입
OpenAI API 활용한 프로필 기반 스터디 추천으로 개인화된 탐색 경험 제공.
- 개인화 추천 알고리즘
- 매칭 효율 향상
- 탐색 전환율 증가
`AI` `개인화`

### 이미지 관리·인터랙션
Supabase Storage 기반 이미지 업로드, Embla 갤러리, 좋아요·조회수 기능 구현.
- 이미지 업로드·삭제 자동화
- 갤러리 UI 제공
- 좋아요·조회수 추적
`미디어` `UX`

---

## 6. 문제인식 → 해결 → 결과 요약

| 구분 | 문제 인식 | 해결 | 결과 |
|------|-----------|------|------|
| **매칭 정보 분산 및 모집 플로우 단절** | 스터디 모집·매칭 분산, 필터링 부재, 참가→채팅 단절, 글 올릴 때마다 스터디 생성으로 반복 모집 불가 | 스터디 1:N 관계 설계 + 원스톱 플랫폼 (Server Actions CRUD, 지역·카테고리 상수) | 스터디 생성→게시글 생성→모집 플로우 구현, 다중 모집글 작성으로 모집 활성화 |
| **실시간 경험 요구** | 참가 신청·승인·거절 알림, 스터디 참여자 간 실시간 소통 채널 필요 | Supabase Realtime Broadcast, 메시지 병합·정렬, useChatScroll, 실시간 알림 | 실시간 채팅·알림 구축 |
| **조회수 중복 카운팅** | 같은 사용자가 새로고침 시 반복 카운트되는 문제 | Zustand persist (viewedPostIds, 24시간 만료) | 정확한 조회 통계 확보 |
| **사용자 액션-UI 반응성 간극** | 좋아요·참가 신청 등 사용자 액션 후 UI 지연 → 체감 응답성 저하 | TanStack Query Optimistic Update (setQueryData 선반영, 실패 시 롤백) | 즉시 UI 반영, 체감 응답성 향상 |

---

## 7. 사용 라이브러리 및 선정 이유

| 카테고리              | 라이브러리               | 용도                               | 선정 이유                                                                                   |
| --------------------- | ------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| **프레임워크·인프라** | Next.js 16               | App Router, SSR/CSR                | App Router, Server Components, Server Actions 지원. 풀스택 단일 프로젝트에 적합             |
|                       | Supabase                 | Auth, DB, Storage, Realtime        | BaaS로 인증·DB·파일·실시간까지 한 번에 제공                                                 |
| **상태관리·데이터**   | TanStack React Query     | 서버 상태 캐싱·무효화              | mutation, invalidation, 에러 핸들링이 잘 정리됨. SWR보다 CRUD 중심 앱에 적합                |
|                       | Zustand                  | 조회수 중복 방지 (클라이언트 상태) | persist 미들웨어로 localStorage 기반 세션 저장. React Query와 역할 분리(서버 vs 클라이언트) |
|                       | React Hook Form          | 폼 상태 관리                       | 리렌더 최소화, Zod 연동 쉬움                                                                |
| **UI·스타일**         | Tailwind CSS             | 스타일링                           | 유틸리티 기반, 컴포넌트 재사용 용이                                                         |
|                       | Radix UI (다수)          | 프리미티브 컴포넌트                | 접근성·키보드 지원·headless. shadcn/ui 기반                                                 |
|                       | Lucide React             | 아이콘                             | 가볍고 일관된 아이콘 세트                                                                   |
|                       | class-variance-authority | variant 기반 스타일                | Badge 등 variant별 스타일 정의                                                              |
|                       | clsx, tailwind-merge     | className 병합                     | `cn()` 유틸로 타이밍 충돌 방지                                                              |
| **폼 검증**           | Zod                      | 스키마 검증                        | 타입 추론 + 런타임 검증 동시에 가능                                                         |
|                       | @hookform/resolvers      | react-hook-form ↔ Zod              | `zodResolver`로 폼과 스키마 연결                                                            |
| **이미지·파일**       | Supabase Storage         | 게시글·프로필 이미지                | Server Action에서 업로드·삭제 처리. public URL 조합 함수로 일관된 경로 사용                   |
| **실시간**            | Supabase Realtime        | 채팅                               | Broadcast API로 채널 기반 실시간 메시지                                                     |
| **알림·UX**           | Sonner                   | 토스트                             | 가볍고 사용이 간단함                                                                        |
| **기타**              | date-fns                 | 날짜 포맷                          | `formatDistanceToNow`, `format`, `parse` 등 유틸리티 제공                                   |
|                       | OpenAI                   | AI 추천                            | GPT-3.5-turbo로 사용자 맞춤 스터디 추천                                                     |
|                       | Embla Carousel           | 이미지 갤러리                      | swiper 대비 가볍고 React 훅 지원. shadcn Carousel 기반                                      |
|                       | next-themes              | 다크/라이트                        | Sonner 테마 연동용 (sonner 내부에서 사용)                                                   |

---

## 8. 미사용·레거시 라이브러리

| 라이브러리    | 상태   | 비고                                                      |
| ------------- | ------ | --------------------------------------------------------- |
| **uuid**      | 미사용 | `crypto.randomUUID()`로 대체. 빌트인 API 사용              |
| **js-cookie** | 미사용 | Supabase Auth가 쿠키를 관리하므로 별도 라이브러리 불필요    |

---

## 참고: 겪었을 만한 이슈

- **Server Action + redirect**: mutation의 `onError`에서 `redirect()`가 throw되므로 `isRedirect()`로 분기 처리
- **Supabase setAll in Server Component**: 주석에 "Server Component에서 setAll 호출 시 무시될 수 있음" 안내 → 미들웨어에서 세션 갱신 고려
- **채팅 메시지 병합**: Realtime과 DB 메시지 중복 제거·정렬 로직 필요 (`allMessages` useMemo)
- **이미지 경로**: Supabase Storage public URL 조합 함수 `getImageUrl`, `getProfileImageUrl`로 일관된 경로 사용
- **Zustand persist + Set**: localStorage에 Set을 그대로 저장할 수 없어 `Array.from`으로 직렬화, `onRehydrateStorage`에서 Set으로 복원
