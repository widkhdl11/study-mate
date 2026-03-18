"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useCheckIsLiked, usePostDetail, useToggleLike,  } from "@/hooks/usePost";
import { getImageUrl } from "@/lib/supabase/storage";
import {
  useApplyParticipant,
  useParticipant,
} from "@/hooks/useParticipant";
import { getRegionPath } from "@/lib/constants/region";
import { getCategoryPath } from "@/lib/constants/study-category";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { PostDetailResponse } from "@/types/postType";
import { ProfileResponse } from "@/types/profileType";
import { formatDate } from "@/utils/utils";
import { StudyActionButton } from "@/components/posts/detail/RenderActionButton";
import { STATUS_MAP } from "@/types/studiesType";
import { useRef } from "react";
import { useTrackPostView } from "@/hooks/useTrackPostView";
import { ParticipantResponse } from "@/types/participantType";

export default function PostDetailUI({ initialPost, user, participant }: 
  { initialPost: PostDetailResponse, user: ProfileResponse | null, participant: ParticipantResponse | null }) {

  const { data: post } = usePostDetail(initialPost);
  const { shouldAddView } = useTrackPostView(post.id);

  const { data: isLikedData } = useCheckIsLiked(post.id);
  // const { data: likesCountData } = useGetLikesCount(post.id);
  const isLiked = isLikedData || false;

  // const { data: participantData } = useParticipant(post.study.id);
  const participantStatus = participant?.status || "";

  const { mutate: applyMutation, isPending: isApplying } = useApplyParticipant(post.study.id);
  const { mutate: toggleLikeMutation, isPending: isTogglingLike } = useToggleLike(post.id);

// Carousel 컴포넌트 대신 직접 사용
// const [emblaRef, emblaApi] = useEmblaCarousel();
// const [currentIndex, setCurrentIndex] = useState(0);

// useEffect(() => {
//   if (!emblaApi) return;
  
//   const onSelect = () => {
//     setCurrentIndex(emblaApi.selectedScrollSnap());
//   };
  
//   emblaApi.on("select", onSelect);
//   return () => { emblaApi.off("select", onSelect); };
// }, [emblaApi]);

// 혹시 모를 서버요청 중복 방지
const isProcessingRef = useRef(false);

const handleLikeClick = () => {
  if (!user || isProcessingRef.current) return;
  isProcessingRef.current = true;
  
  toggleLikeMutation(undefined, {
    onSettled: () => {
      isProcessingRef.current = false;
    }
  });
};
  const status = STATUS_MAP[participantStatus] || "모집중";
  

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
                {post.image_url.length > 0 ? (
                  <>
                  {post.image_url.map((image: { url: string }, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={getImageUrl(image.url)}
                          alt={`${post.title} - 이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                          />
                      </div>
                    </CarouselItem>
                  ))}
                </>
              ) : (
                <CarouselItem>
                  <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={getImageUrl("/default-post-thumbnail.jpg")}
                      alt={`default-post-thumbnail`}
                      fill
                      className="object-cover"
                      />
                  </div>
                </CarouselItem>
              )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
            
            {/* 이미지 카운터 */}
            {/* <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {post.image_url.length}
            </div> */}
         
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
                      {post.author?.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {post.author?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleLikeClick()}
                    disabled={isTogglingLike}
                    className={`gap-2 ${isLiked ? "bg-blue-50 border-blue-600 text-blue-600" : ""}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-blue-600" : ""}`} />
                    <span className="font-semibold">{post.likes_count}</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">👁 {post.views_count + (shouldAddView ? 1 : 0)}</span>
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
                      {post.author?.email[0].toUpperCase()}
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
                <StudyActionButton 
                  status={status} 
                  isApplying={isApplying} 
                  onApply={() => applyMutation()} 
                />
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
