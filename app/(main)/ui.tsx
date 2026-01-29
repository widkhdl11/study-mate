"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Sparkles, Target, Users } from "lucide-react";
import { useGetAllPosts } from "@/hooks/usePost";
import { PostsResponse } from "@/types/response/post";
import { getImageUrl, getProfileImageUrl } from "@/utils/supabase/storage";

export default function HomeUI() {
  const { data } = useGetAllPosts();
  const posts = data?.success ? (data.data as PostsResponse[]) : [];
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
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div className="space-y-8 text-center lg:text-left animate-fade-in">
                <div className="inline-block">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 px-4 py-1.5 text-sm font-medium">
                    <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5" />
                    함께 성장하는 커뮤니티
                  </Badge>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      Study Mate
                    </span>
                  </h1>
                  <p className="text-2xl md:text-3xl text-muted-foreground font-medium text-balance">
                    함께 성장하는 스터디 문화
                  </p>
                </div>

                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-balance leading-relaxed">
                  당신의 학습 목표를 달성할 수 있는 최적의 스터디를 찾아보세요.
                  같은 목표를 가진 사람들과 함께라면, 학습은 더욱 즐겁고
                  효과적입니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/studies/create">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
                    >
                      스터디 만들기
                    </Button>
                  </Link>
                  <Link href="/posts">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent font-semibold px-8 py-6 text-lg"
                    >
                      모집글 보기
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      2,340+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      활성 스터디
                    </div>
                  </div>
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      15,680+
                    </div>
                    <div className="text-sm text-muted-foreground">멤버</div>
                  </div>
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      98%
                    </div>
                    <div className="text-sm text-muted-foreground">만족도</div>
                  </div>
                </div>
              </div>

              {/* Right decorative cards */}
              <div className="relative lg:block">
                <div className="relative w-full max-w-lg mx-auto space-y-6">
                  {/* Feature Cards */}
                  <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900/30 hover:shadow-xl transition-all animate-float">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          다양한 스터디
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          프론트엔드, 백엔드, AI, 디자인 등 다양한 분야의
                          스터디를 만나보세요
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-purple-100 dark:border-purple-900/30 hover:shadow-xl transition-all animate-float ml-8"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          체계적인 학습
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          함께 공부하며 서로의 성장을 돕는 효과적인 학습 경험
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-indigo-100 dark:border-indigo-900/30 hover:shadow-xl transition-all animate-float"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          목표 달성
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          같은 목표를 가진 동료들과 함께 학습 목표를 이루세요
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  console.log(post),
                  (
                    <Link key={post.id} href={`/posts/${post.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:border-accent/50">
                        {/* Thumbnail Image */}
                        <div className="relative w-full h-48 bg-muted overflow-hidden">
                          <img
                            src={
                              getImageUrl(post.image_url?.[0]?.url) ||
                              "/placeholder.svg"
                            }
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-5 flex-1 flex flex-col space-y-4">
                          {/* Post Title */}
                          <div>
                            <h3 className="font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {post.content}
                            </p>
                          </div>

                          {/* Study Info Section */}
                          <div className="space-y-3 border-t border-border pt-3">
                            {/* Study Title */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                스터디
                              </p>
                              <p className="font-medium text-foreground text-sm">
                                {post.study.title}
                              </p>
                            </div>

                            {/* Category & Location */}
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                className={`${getCategoryColor(post.study.study_category)} border-0`}
                              >
                                {post.study.study_category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {post.study.region}
                              </Badge>
                            </div>

                            {/* Participants Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">
                                  참여 인원
                                </span>
                                <span className="font-semibold text-foreground">
                                  {post.study.current_participants}/
                                  {post.study.max_participants}
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(post.study.current_participants / post.study.max_participants) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Meeting Date & Status */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                {post.study.created_at}
                              </span>
                              <Badge
                                className={`${getStatusColor(post.study.status)} border-0 text-xs`}
                              >
                                {post.study.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center gap-2 border-t border-border pt-3">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={
                                  getProfileImageUrl(post.author.avatar_url) ||
                                  "/placeholder.svg"
                                }
                                alt={post.author.username}
                              />
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {post.author.username?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground">
                              {post.author.username}
                            </span>
                          </div>

                          {/* Engagement & Time */}
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex gap-3">
                              <span>👍 {post.likes_count}</span>
                              <span>👁 {post.views_count}</span>
                            </div>
                            <span>{post.created_at}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
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
