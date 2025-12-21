"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  Settings,
  MessageSquare,
  FileText,
  ThumbsUp,
  Eye,
  PlusCircle,
  Edit,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useGetStudy } from "@/hooks/useStudy";
import { StudiesResponse } from "@/types/response/studies";

export default async function UserStudyDetailUI({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // 임시 데이터 - 실제로는 DB에서 조회
  //   const study = {
  //     id: id,
  //     title: "React 심화 스터디",
  //     description:
  //       "React와 Next.js를 깊이 있게 학습하는 스터디 그룹입니다. 함께 성장하고 싶은 분들을 환영합니다. 매주 새로운 주제를 정해 발표하고 토론하는 방식으로 진행합니다.",
  //     category: "프론트엔드",
  //     location: "온라인",
  //     participants: 5,
  //     maxParticipants: 10,
  //     meetingDate: "2024.01.15",
  //     meetingTime: "19:00",
  //     status: "모집중",
  //     createdAt: "2024.01.01",
  //     host: {
  //       name: "박준희",
  //       initials: "PJ",
  //       avatar: "/placeholder.svg?height=48&width=48",
  //       email: "junhee@example.com",
  //     },
  //   };

  //   // 스터디 멤버 목록
  //   const members = [
  //     {
  //       id: 1,
  //       name: "박준희",
  //       initials: "PJ",
  //       role: "호스트",
  //       status: "참여중",
  //       joinedAt: "2024.01.01",
  //     },
  //     {
  //       id: 2,
  //       name: "김민수",
  //       initials: "KM",
  //       role: "멤버",
  //       status: "참여중",
  //       joinedAt: "2024.01.05",
  //     },
  //     {
  //       id: 3,
  //       name: "이지영",
  //       initials: "LJ",
  //       role: "멤버",
  //       status: "참여중",
  //       joinedAt: "2024.01.08",
  //     },
  //     {
  //       id: 4,
  //       name: "정대호",
  //       initials: "JD",
  //       role: "멤버",
  //       status: "수락 대기중",
  //       joinedAt: "2024.01.12",
  //     },
  //     {
  //       id: 5,
  //       name: "최수진",
  //       initials: "CS",
  //       role: "멤버",
  //       status: "수락 대기중",
  //       joinedAt: "2024.01.14",
  //     },
  //   ];

  //   // 해당 스터디의 모집글 목록
  //   const studyPosts = [
  //     {
  //       id: 1,
  //       title: "React & Next.js 심화 스터디 모집중!",
  //       content:
  //         "React와 Next.js를 깊이 있게 학습하고 싶은 분들과 함께할 수 있는 스터디입니다.",
  //       image: "/frontend-study-meeting.jpg",
  //       status: "모집중",
  //       likes: 24,
  //       views: 156,
  //       createdAt: "3일 전",
  //     },
  //     {
  //       id: 2,
  //       title: "React Hooks 기초부터 시작해요",
  //       content: "Hooks의 기초 개념부터 심화 패턴까지 함께 학습합니다.",
  //       image: "/coding-workspace.png",
  //       status: "마감",
  //       likes: 18,
  //       views: 98,
  //       createdAt: "1주일 전",
  //     },
  //     {
  //       id: 3,
  //       title: "TypeScript + React 완벽 가이드",
  //       content: "타입스크립트와 리액트를 함께 사용하는 방법을 배웁니다.",
  //       image: "/abstract-data-flow.png",
  //       status: "모집중",
  //       likes: 31,
  //       views: 187,
  //       createdAt: "2주일 전",
  //     },
  //   ];

  const { data: studyData } = useGetStudyDetail({ id });
  const study = studyData?.data as StudiesResponse | undefined;
  if (!study) {
    return <div>스터디를 찾을 수 없습니다.</div>;
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "모집중":
        return "bg-green-500 text-white";
      case "마감":
        return "bg-red-500 text-white";
      case "참여중":
        return "bg-blue-500 text-white";
      case "수락 대기중":
        return "bg-yellow-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      프론트엔드: "bg-blue-100 text-blue-700 border-blue-200",
      백엔드: "bg-purple-100 text-purple-700 border-purple-200",
      AI: "bg-amber-100 text-amber-700 border-amber-200",
      모바일: "bg-green-100 text-green-700 border-green-200",
      디자인: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* 스터디 헤더 섹션 */}
        <section className="border-b border-border bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4">
                {/* 뒤로가기 */}
                <Link
                  href="/user/info"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← 내 정보로 돌아가기
                </Link>

                {/* 스터디 제목 및 배지 */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {study?.title}
                  </h1>
                  <Badge className={getStatusColor(study.status)}>
                    {study.status}
                  </Badge>
                </div>

                {/* 카테고리 및 위치 */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={getCategoryColor(study.study_category)}
                  >
                    {study.study_category}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {study.region}
                  </span>
                </div>

                {/* 모임 정보 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {study.meetingDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {study.meetingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {study.participants}/
                    {study.maxParticipants}명
                  </span>
                </div>
              </div>

              {/* 액션 버튼 영역 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/posts/create?study_id=${study.id}`}>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    모집글 작성
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                  스터디 설정
                </Button>
              </div>
            </div>

            {/* 참여 인원 진행률 */}
            <div className="mt-6 max-w-md">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">참여 인원</span>
                <span className="font-semibold text-foreground">
                  {study.participants}/{study.maxParticipants}명
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (study.participants / study.maxParticipants) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 탭 컨텐츠 */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                <TabsTrigger value="overview" className="gap-2">
                  <FileText className="w-4 h-4 hidden sm:inline" />
                  개요
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-2">
                  <Users className="w-4 h-4 hidden sm:inline" />
                  멤버 ({members.length})
                </TabsTrigger>
                <TabsTrigger value="posts" className="gap-2">
                  <MessageSquare className="w-4 h-4 hidden sm:inline" />
                  모집글 ({studyPosts.length})
                </TabsTrigger>
              </TabsList>

              {/* 개요 탭 */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    스터디 소개
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {study.description}
                  </p>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    호스트 정보
                  </h2>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={study.host.avatar || "/placeholder.svg"}
                        alt={study.host.name}
                      />
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {study.host.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {study.host.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {study.host.email}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    스터디 정보
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {study.participants}
                      </p>
                      <p className="text-sm text-muted-foreground">현재 멤버</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {study.maxParticipants}
                      </p>
                      <p className="text-sm text-muted-foreground">최대 인원</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {studyPosts.length}
                      </p>
                      <p className="text-sm text-muted-foreground">모집글</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {study.createdAt}
                      </p>
                      <p className="text-sm text-muted-foreground">생성일</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* 멤버 탭 */}
              <TabsContent value="members" className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">
                      멤버 관리
                    </h2>
                    <Badge variant="outline">
                      {members.filter((m) => m.status === "참여중").length}/
                      {study.maxParticipants}명 참여중
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">
                                {member.name}
                              </p>
                              {member.role === "호스트" && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                  호스트
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              가입일: {member.joinedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>

                          {member.status === "수락 대기중" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 gap-1"
                              >
                                <UserCheck className="w-3 h-3" />
                                수락
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1"
                              >
                                <UserX className="w-3 h-3" />
                                거절
                              </Button>
                            </div>
                          )}

                          {member.status === "참여중" &&
                            member.role !== "호스트" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* 모집글 탭 */}
              <TabsContent value="posts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    모집글 목록
                  </h2>
                  <Link href={`/posts/create?study_id=${study.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                      <PlusCircle className="w-4 h-4" />새 모집글 작성
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-0 gap-0"
                    >
                      <Link href={`/posts/${post.id}`}>
                        <div className="relative w-full h-40 bg-muted">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="font-bold text-foreground line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{post.createdAt}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" /> {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {post.views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 bg-transparent"
                        >
                          <Edit className="w-3 h-3" />
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 gap-1 bg-transparent"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
