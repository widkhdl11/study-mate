'use client'

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCheckIsLiked, useToggleLike,  } from "@/hooks/usePost";
import { ThumbsUp } from "lucide-react";
import { PostDetailResponse } from "@/types/postType";
import { ProfileResponse } from "@/types/profileType";
// import { formatDate } from "@/utils/utils";
import { TimeAgo } from "@/components/common/formatTimeAgo";
import { getProfileImageUrl } from "@/lib/supabase/storage";
import { useRef } from "react";
import { useTrackPostView } from "@/hooks/useTrackPostView";

export default function MainSection({ post,user }: { post: PostDetailResponse, user: ProfileResponse | null }) {
    const { mutate: toggleLikeMutation, isPending: isTogglingLike } = useToggleLike(post.id);

    const { data: isLikedData } = useCheckIsLiked(post.id);
    const isLiked = isLikedData || false;
    const { shouldAddView } = useTrackPostView(post.id);

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
    return (
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
                      src={getProfileImageUrl(post.author?.avatar_url)}
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
                      <TimeAgo date={post.created_at} />
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
    )
}