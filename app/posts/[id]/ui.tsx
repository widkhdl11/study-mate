"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useCheckIsLiked, useGetPost, useToggleLike,  } from "@/hooks/usePost";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getImageUrl } from "@/utils/supabase/storage";
import {
  useApplyParticipant,
  useCheckParticipantStatus,
  useParticipant, // ← 이거 추가 (useQuery 버전)
} from "@/hooks/useParticipant";
import { getRegionPath } from "@/lib/constants/region";
import { getCategoryPath } from "@/lib/constants/study-category";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

export default function PostDetailUI({ id }: { id: number }) {
  const { data, isLoading, error } = useGetPost(id);
  const post = data?.data;


  // ✅ 1. 모든 Hook을 컴포넌트 최상단으로 이동
  const studyId = post?.study?.id || 0;
  const { data: isLikedData } = useCheckIsLiked(id);
  const isLiked = isLikedData?.data || false;// ✅ useQuery 버전 사용 (자동으로 계속 최신 상태 유지)

  const { data: participantData } = useParticipant(studyId);  
  const applyMutation = useApplyParticipant(studyId);
  const participantStatus = participantData?.data?.status || "";
  const toggleLikeMutation = useToggleLike(id);
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  const { data: userData } = useUser();

  // 이니셜 생성
  const getInitials = (email: string) => {
    return email[0].toUpperCase();
  };

  // ✅ 2. 핸들러에서는 mutate만 호출
  const studyApplyHandler = () => {
    // applyMutation.mutate(studyId, {
    //   onSuccess: (response) => {
    //     if (response?.success) {
    //       setStudyStatusMutation.mutate();
    //     }
    //   },
    // });
    applyMutation.mutate();
  };

  // 상태 결정 함수
  const getStatus = () => {
    if (!participantStatus) return "모집중";

    if (participantStatus === "accepted") {
      return "참여중";
    }
    if (participantStatus === "pending") {
      return "수락 대기중";
    }
    if (participantStatus === "rejected") {
      return "스터디 종료";
    }
    return "모집중";
  };

  const status = getStatus();
  
  const handleLikeClick = () => {
    if (!userData) {
      toast.error("로그인이 필요합니다");
      return;
    }
    toggleLikeMutation.mutate();
  };
  
  if (isLoading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다</div>;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">게시글을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">
              게시글을 불러올 수 없습니다.
            </p>
            <Button onClick={() => window.history.back()}>돌아가기</Button>
          </div>
        </main>
      </div>
    );
  }

  // 상태별 액션 버튼 렌더링
  const renderActionButton = () => {
    switch (status) {
      case "모집중":
        return (
          <Button
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            onClick={studyApplyHandler}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "신청 중..." : "참여 신청"}
          </Button>
        );
      case "수락 대기중":
        return (
          <Button
            disabled
            className="w-full py-6 text-lg bg-yellow-600 hover:bg-yellow-700"
          >
            수락 대기중
          </Button>
        );
      case "참여중":
        return (
          <div className="flex gap-3">
            <Badge className="flex-1  text-center bg-success text-white text-base justify-center">
              참여중
            </Badge>
            <Button variant="outline" className="flex-1 bg-transparent">
              채팅방 입장
            </Button>
          </div>
        );
      case "스터디 종료":
        return (
          <Button disabled className="w-full py-6 text-lg bg-muted">
            모집 마감
          </Button>
        );
      default:
        return null;
    }
  };

  // 관련 포스트 (같은 스터디의 다른 포스트들 - 임시)
  const relatedPosts: any[] = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 포스트 이미지 */}
          <div className="relative w-full mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {post.image_url.map((image: { url: string }, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={getImageUrl(image.url) || "/placeholder.svg"}
                        alt={`${post.title} - 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
            {/* 이미지 카운터 */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              1 / {post.image_url.length}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              {/* 포스트 제목 */}
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {post.title}
              </h1>

              {/* 작성자 정보 및 메타정보 */}
              <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={post.author?.avatar_url || "/placeholder.svg"}
                      alt={post.author?.username || ""}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(post.author?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {post.author?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.created_at!)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLikeClick}
                    disabled={toggleLikeMutation.isPending}
                    className={`gap-2 ${isLiked ? "bg-blue-50 border-blue-600 text-blue-600" : ""}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-blue-600" : ""}`} />
                    <span className="font-semibold">{post.likes_count}</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">👁 {post.views_count}</span>
                </div>
              </div>

              {/* 포스트 내용 */}
              <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <div className="text-foreground whitespace-pre-line leading-relaxed">
                  {post.content}
                </div>
              </div>
            </div>

            {/* 사이드바: 스터디 정보 & 액션 */}
            <div className="lg:col-span-1">
              {/* 스터디 정보 카드 */}
              <Card className="p-6 sticky top-20 shadow-md">
                {/* 상태 배지 */}
                <div className="mb-4">
                  <Badge
                    className={`text-white ${
                      status === "모집중"
                        ? "bg-success"
                        : status === "스터디 종료"
                        ? "bg-danger"
                        : "bg-warning"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>

                {/* 스터디 제목 */}
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {post.study.title}
                </h2>

                {/* 카테고리 & 위치 배지 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {getCategoryPath(Number(post.study.study_category)).labels.map((category) => (
                    <Badge variant="outline" key={category} className="text-xs font-normal">{category}</Badge>
                  ))}
                    <Badge variant="outline"  className="text-xs font-normal">{getRegionPath(Number(post.study.region)).labels.join(" ")}</Badge>
                </div>

                {/* 참여 인원 진행률 */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      참여 인원
                    </span>
                    <span className="text-sm font-semibold text-accent">
                      {post.study.current_participants || 0}/
                      {post.study.max_participants}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{
                        width: `${
                          ((post.study.current_participants || 0) /
                            post.study.max_participants) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* 스터디 설명 */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.study.description}
                  </p>
                </div>

                {/* 호스트 정보 */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-6">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={post.author?.avatar_url || "/placeholder.svg"}
                      alt={post.author?.username}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(post.author?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">호스트</p>
                    <p className="font-semibold text-foreground text-sm">
                      {post.author?.username}
                    </p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                {renderActionButton()}
              </Card>
            </div>
          </div>

          {/* 관련 포스트 섹션 */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                같은 스터디의 다른 모집글
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground flex-1">
                          {relatedPost.title}
                        </h4>
                        <Badge
                          className={`text-white ml-2 ${
                            relatedPost.status === "모집중"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {relatedPost.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-0 h-auto text-blue-600"
                      >
                        → 상세보기
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
