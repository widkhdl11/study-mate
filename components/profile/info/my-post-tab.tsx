"use client";

import { TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { Eye } from "lucide-react";
import { getImageUrl } from "@/utils/supabase/storage";
import { PostsResponse } from "@/types/response/post";
import { getCategoryPath } from "@/lib/constants/study-category";
import { getRegionPath } from "@/lib/constants/region";
import { studyStatusConversion } from "@/types/convertion/study";

export default function MyPostTab({
  myPosts,
  getStatusColor,
  getCategoryColor,
}: {
  myPosts: PostsResponse[];
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
}) {
  return (
    <TabsContent value="posts" className="space-y-4">
      {myPosts && myPosts?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myPosts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="group overflow-hidden hover:shadow-md transition-all h-full flex flex-col cursor-pointer p-0 gap-0">
                <div className="relative w-full h-40 bg-muted overflow-hidden">
                  <img
                    src={getImageUrl(post.image_url) || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(post.study.status)}>
                      {studyStatusConversion(post.study.status)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryPath(Number(post.study.study_category)).map((category) => (
                        <Badge
                          variant="outline"
                          className={`text-xs font-normal ${getCategoryColor(category)}`}
                        >
                          {category}
                        </Badge>
                      ))}
                 
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {getRegionPath(Number(post.study.region)).join(" ")}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                    <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {post.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.views_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">작성한 모집글이 없습니다.</p>
        </Card>
      )}
    </TabsContent>
  );
}
