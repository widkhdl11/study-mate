"use client";

import { usePostDetail } from "@/hooks/usePost";
import { useParticipant } from "@/hooks/useParticipant";
import { PostDetailResponse, PostsResponse } from "@/types/postType";
import { ProfileResponse } from "@/types/profileType";
import { ParticipantResponse } from "@/types/participantType";
import { STATUS_MAP } from "@/types/studiesType";
import MainSection from "@/components/posts/detail/MainSection";
import PostImageSection from "@/components/common/PostImageSection";
import RelationSction from "@/components/posts/detail/RelationSction";
import SidebarSection from "@/components/posts/detail/SidebarSection";

interface PostDetailUIProps {
  initialPost: PostDetailResponse;
  user: ProfileResponse;
  participant: ParticipantResponse | null;
}

export default function PostDetailUI({ initialPost, user, participant }: PostDetailUIProps) {
  const { data: post } = usePostDetail(initialPost);
  const { data: participantData } = useParticipant(participant, post.study.id);
  const status = STATUS_MAP[participantData?.status || ""] || "모집중";

  const relatedPosts: PostsResponse = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostImageSection post={post} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MainSection post={post} user={user} />

            <SidebarSection post={post} status={status} />
          </div>

          {relatedPosts.length > 0 && (
            <RelationSction relatedPosts={relatedPosts} />
          )}
        </div>
      </main>
    </div>
  );
}
