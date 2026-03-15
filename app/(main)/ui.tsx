"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Sparkles, Target, Users } from "lucide-react";
import { useGetAllPosts } from "@/hooks/usePost";
import { PostsResponse } from "@/types/postType";
import { getImageUrl, getProfileImageUrl } from "@/lib/supabase/storage";
import PostCard from "@/components/post/main/post-card";
import HeroSection from "@/components/main/HeroSection";


export default function HomeUI() {
  const { data } = useGetAllPosts();
  const posts = data?.success ? (data.data as unknown as PostsResponse[]) : [];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "모집중":
        return "bg-success text-white";
      case "마감":
        return "bg-danger text-white";
      case "수락 대기중":
        return "bg-warning text-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      프론트엔드:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      백엔드:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      AI: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      모바일:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      디자인:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Latest Posts Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                최신 모집글
              </h2>
              <p className="text-muted-foreground">
                지금 모집 중인 스터디들을 확인해보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map(
                (post: PostsResponse) => (
                  <Link key={post.id} href={`/posts/${post.id}`}>
                    <PostCard post={post} getCategoryColor={getCategoryColor} getStatusColor={getStatusColor} />
                  </Link>
                ),
              )}
            </div>

            <div className="text-center pt-6">
              <Link href="/posts">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  더 많은 모집글 보기 →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
