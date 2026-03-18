"use client";

import { usePostDetail,  } from "@/hooks/usePost";
import { PostDetailResponse, PostsResponse } from "@/types/postType";
import { ProfileResponse } from "@/types/profileType";
import { STATUS_MAP } from "@/types/studiesType";
import { ParticipantResponse } from "@/types/participantType";
import SidebarSection from "@/components/posts/detail/SidebarSection";
import MainSection from "@/components/posts/detail/MainSection";
import PostImageSection from "@/components/common/PostImageSection";
import RelationSction from "@/components/posts/detail/RelationSction";

export default function PostDetailUI({ initialPost, user, participant }: 
  { initialPost: PostDetailResponse, user: ProfileResponse, participant: ParticipantResponse | null }) {

  const { data: post } = usePostDetail(initialPost);

  // const { data: participantData } = useParticipant(post.study.id);
  const participantStatus = participant?.status || "";


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

  const status = STATUS_MAP[participantStatus] || "모집중";
  

  // 관련 포스트 (같은 스터디의 다른 포스트들 - 임시)
  const relatedPosts: PostsResponse = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 포스트 이미지 */}
          <PostImageSection post={post} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <MainSection post={post} user={user} />

            {/* 사이드바: 스터디 정보 & 액션 */}
            <SidebarSection post={post} status={status} />
          </div>

          {/* 관련 포스트 섹션 */}
          {relatedPosts.length > 0 && (
            <RelationSction relatedPosts={relatedPosts} />
          )}
        </div>
      </main>

    </div>
  );
}
