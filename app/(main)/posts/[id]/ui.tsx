
import { PostDetailResponse, PostsResponse } from "@/types/postType";
import { ProfileResponse } from "@/types/profileType";
import { ParticipantResponse } from "@/types/participantType";
import MainSection from "@/components/posts/detail/MainSection";
import PostImageSection from "@/components/common/PostImageSection";
import RelationSection from "@/components/posts/detail/RelationSection";
import SidebarSection from "@/components/posts/detail/SidebarSection";

interface PostDetailUIProps {
  initialPost: PostDetailResponse;
  user: ProfileResponse;
  participant: ParticipantResponse | null;
}

export default function PostDetailUI({ initialPost, user, participant }: PostDetailUIProps) {

  const relatedPosts: PostsResponse = [];

  return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostImageSection post={initialPost} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MainSection initialPost={initialPost} user={user} />

            <SidebarSection initialPost={initialPost} participant={participant} />
          </div>

          {relatedPosts.length > 0 && (
            <RelationSection relatedPosts={relatedPosts} />
          )}
        </div>
  );
}
