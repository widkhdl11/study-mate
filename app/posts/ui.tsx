"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Users, Calendar, ThumbsUp, Eye } from "lucide-react";
import { useGetAllPosts } from "@/hooks/usePost";
import { PostsResponse } from "@/types/response/post";
import { getImageUrl } from "@/utils/supabase/storage";
import {
  getDetailCategories,
  getMainCategories,
  getSubcategories,
} from "@/lib/constants/study-category";
import { getMainRegion, getSubRegion } from "@/lib/constants/region";
import { STUDY_STATUS } from "@/lib/constants/study-status";

export default function PostsUI() {
  // 임시 데이터 - 실제로는 DB에서 가져올 예정
  // const allPosts = [
  //   {
  //     id: 1,
  //     title: "2024 겨울 프론트엔드 심화 스터디",
  //     content:
  //       "React, Next.js 심화 과정을 함께 진행할 멤버를 모집합니다. 주 2회 오프라인 모임과 코드 리뷰를 진행합니다.",
  //     image_url: ["/frontend-study-meeting.jpg"],
  //     created_at: "2024-01-01",
  //     likes_count: 24,
  //     views_count: 156,
  //     study: {
  //       id: 1,
  //       title: "Frontend Masters 2024",
  //       description:
  //         "React, Next.js 심화 과정을 함께 진행할 멤버를 모집합니다. 주 2회 오프라인 모임과 코드 리뷰를 진행합니다.",
  //       study_category: "프론트엔드",
  //       region: "서울 강남",
  //       max_participants: 10,
  //       current_participants: 3,
  //       status: "모집중",
  //     },
  //     author: {
  //       id: "1",
  //       username: "김민준",
  //       email: "kimminjun@gmail.com",
  //       avatar_url: "/avatar.jpg",
  //     },
  //   },
  //   {
  //     id: 2,
  //     title: "Spring Boot 완전 정복 스터디",
  //     content:
  //       "자바 백엔드 개발자를 위한 Spring Boot 마스터 클래스입니다. 실무 위주의 프로젝트를 진행합니다.",
  //     image_url: ["/backend-java-spring-boot.jpg"],
  //     created_at: "2024-01-02",
  //     likes_count: 42,
  //     views_count: 298,
  //     study: {
  //       id: 2,
  //       title: "Backend Academy",
  //       description:
  //         "자바 백엔드 개발자를 위한 Spring Boot 마스터 클래스입니다. 실무 위주의 프로젝트를 진행합니다.",
  //       study_category: "백엔드",
  //       region: "온라인",
  //       max_participants: 8,
  //       current_participants: 7,
  //       status: "마감",
  //     },
  //   },
  //   {
  //     id: 3,
  //     title: "AI/ML 기초부터 시작하기",
  //     content:
  //       "Python으로 배우는 머신러닝 입문 과정입니다. 기초 수학부터 딥러닝 모델 구현까지 함께 공부해요.",
  //     image_url: ["/machine-learning-ai-python.jpg"],
  //     created_at: "2024-01-03",
  //     likes_count: 31,
  //     views_count: 187,
  //     study: {
  //       id: 3,
  //       title: "AI Study Group",
  //       description:
  //         "Python으로 배우는 머신러닝 입문 과정입니다. 기초 수학부터 딥러닝 모델 구현까지 함께 공부해요.",
  //       study_category: "AI",
  //       region: "서울 종로",
  //       max_participants: 12,
  //       current_participants: 5,
  //       status: "모집중",
  //     },
  //     author: {
  //       id: "3",
  //       username: "박지은",
  //       email: "parkji@gmail.com",
  //       avatar_url: "/avatar.jpg",
  //     },
  //   },
  //   {
  //     id: 4,
  //     title: "모바일 앱 개발 - React Native",
  //     content:
  //       "React Native로 크로스 플랫폼 모바일 앱을 개발합니다. 앱 스토어 배포까지 목표로 합니다.",
  //     image: "/mobile-app-react-native-development.jpg",
  //     studyTitle: "Mobile Dev Study",
  //     category: "모바일",
  //     location: "서울 강북",
  //     participants: 4,
  //     maxParticipants: 6,
  //     status: "모집중",
  //     meetingDate: "2024.01.25",
  //     author: { name: "정대호", initials: "JD" },
  //     likes: 18,
  //     views: 102,
  //     postedTime: "5일 전",
  //   },
  //   {
  //     id: 5,
  //     title: "UI/UX 디자인 기초 스터디",
  //     content:
  //       "Figma를 활용한 현대적인 UI/UX 디자인을 배웁니다. 디자인 시스템 구축부터 프로토타이핑까지.",
  //     image: "/ui-ux-design-figma.jpg",
  //     studyTitle: "Design Lab",
  //     category: "디자인",
  //     location: "온라인",
  //     participants: 8,
  //     maxParticipants: 10,
  //     status: "수락 대기중",
  //     meetingDate: "2024.01.18",
  //     author: { name: "최민지", initials: "CM" },
  //     likes: 36,
  //     views: 214,
  //     postedTime: "4일 전",
  //   },
  //   {
  //     id: 6,
  //     title: "TypeScript 완벽 가이드",
  //     content:
  //       "타입스크립트의 심화 개념과 실제 프로젝트 적용법을 배웁니다. 타입 안정성을 높이는 방법을 연구합니다.",
  //     image: "/coding-workspace.png",
  //     studyTitle: "TypeScript Masters",
  //     category: "프론트엔드",
  //     location: "서울 강남",
  //     participants: 6,
  //     maxParticipants: 8,
  //     status: "모집중",
  //     meetingDate: "2024.01.22",
  //     author: { name: "홍길동", initials: "HG" },
  //     likes: 28,
  //     views: 165,
  //     postedTime: "6일 전",
  //   },
  //   {
  //     id: 7,
  //     title: "데이터 분석 입문 - SQL 기초",
  //     content:
  //       "SQL을 활용한 데이터 분석의 기초를 배웁니다. 실제 데이터를 가지고 쿼리를 작성해보는 실습 위주 스터디입니다.",
  //     image: "/abstract-data-flow.png",
  //     studyTitle: "Data Analytics Club",
  //     category: "데이터",
  //     location: "온라인",
  //     participants: 2,
  //     maxParticipants: 15,
  //     status: "모집중",
  //     meetingDate: "2024.01.28",
  //     author: { name: "이다빈", initials: "LD" },
  //     likes: 15,
  //     views: 78,
  //     postedTime: "7일 전",
  //   },
  //   {
  //     id: 8,
  //     title: "DevOps & Kubernetes 실무",
  //     content:
  //       "쿠버네티스를 활용한 실무 DevOps 경험을 나눕니다. 인프라 구축부터 모니터링까지 다룹니다.",
  //     image: "/server-rack.png",
  //     studyTitle: "DevOps Team",
  //     category: "백엔드",
  //     location: "서울 강남",
  //     participants: 5,
  //     maxParticipants: 8,
  //     status: "모집중",
  //     meetingDate: "2024.01.30",
  //     author: { name: "김준호", initials: "KJ" },
  //     likes: 22,
  //     views: 145,
  //     postedTime: "5일 전",
  //   },
  // ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체 카테고리");
  const [selectedStatus, setSelectedStatus] = useState("전체 상태");
  const { data, isLoading, error } = useGetAllPosts();
  const allPosts = data?.success ? (data.data as PostsResponse[]) : [];
  const [mainCategoryValue, setMainCategoryValue] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");
  const [studyCategoryValue, setStudyCategoryValue] = useState(0);
  const [mainRegionValue, setMainRegionValue] = useState("");
  const [regionValue, setRegionValue] = useState("");
  // 동적 옵션
  const mainCategories = getMainCategories();
  const subcategories = mainCategoryValue
    ? getSubcategories(mainCategoryValue)
    : [];
  const detailCategories =
    mainCategoryValue && subCategoryValue
      ? getDetailCategories(mainCategoryValue, subCategoryValue)
      : [];

  const mainRegions = getMainRegion();
  const regions = mainRegionValue ? getSubRegion(mainRegionValue) : [];

  const statuses = Object.values(STUDY_STATUS).map((status) => status.label);

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.study?.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.study?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "전체 카테고리" ||
      post.study?.study_category === selectedCategory;
    const matchesLocation =
      regionValue === "전체 지역" || post.study?.region === regionValue;
    const matchesStatus =
      selectedStatus === "전체 상태" || post.study?.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "모집중":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "마감":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "수락 대기중":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      프론트엔드:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      백엔드:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      AI: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      모바일:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
      디자인:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800",
      데이터:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    };
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border bg-card py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  스터디 찾기
                </h1>
                <p className="text-muted-foreground text-lg">
                  함께 성장할 동료를 만나보세요
                </p>
              </div>
              <Link href="/posts/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-sm"
                >
                  <Users className="w-4 h-4" />새 모집글 작성
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card className="p-5 space-y-5">
                    <div className="flex items-center gap-2 font-semibold text-lg text-foreground pb-2 border-b">
                      <span className="text-primary">⚡</span> 필터
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        카테고리
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setMainCategoryValue(value);
                          setSubCategoryValue("");
                          setStudyCategoryValue(0);
                        }}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="전체 카테고리">
                            전체 카테고리
                          </SelectItem>
                          {mainCategories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        중분류
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setSubCategoryValue(value);
                          setStudyCategoryValue(0);
                        }}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 중분류" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.value}
                              value={subcategory.value}
                            >
                              {subcategory.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        소분류
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setStudyCategoryValue(Number(value));
                        }}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 소분류" />
                        </SelectTrigger>
                        <SelectContent>
                          {detailCategories.map((detailCategory) => (
                            <SelectItem
                              key={detailCategory.value}
                              value={detailCategory.value}
                            >
                              {detailCategory.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        지역 (시/도)
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setMainRegionValue(value);
                          setRegionValue("");
                        }}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 지역" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="전체 지역">전체 지역</SelectItem>
                          {mainRegions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        지역 (시/군/구)
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setRegionValue(value);
                        }}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 지역" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        모집 상태
                      </label>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="전체 상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="전체 상태">전체 상태</SelectItem>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(selectedCategory !== "전체 카테고리" ||
                      mainRegionValue !== "전체 지역" ||
                      regionValue !== "전체 지역" ||
                      selectedStatus !== "전체 상태") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("전체 카테고리");
                          setMainRegionValue("전체 지역");
                          setRegionValue("전체 지역");
                          setSelectedStatus("전체 상태");
                          setSearchQuery("");
                        }}
                        className="w-full mt-2"
                      >
                        필터 초기화
                      </Button>
                    )}
                  </Card>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                  <Input
                    placeholder="스터디 제목, 내용, 스터디명으로 검색해보세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 py-6 text-base bg-card border-border/60 shadow-sm focus-visible:ring-primary/30 transition-all group-hover:border-primary/50"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
                </div>

                {/* Results Counter */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    총{" "}
                    <span className="font-bold text-foreground">
                      {filteredPosts.length}
                    </span>
                    개의 스터디가 모집중입니다
                  </p>
                </div>

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <Link key={post.id} href={`/posts/${post.id}`}>
                        <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer border-border/60 hover:border-primary/50 p-0 gap-0">
                          {/* Thumbnail Image */}
                          <div className="relative w-full h-48 bg-muted overflow-hidden">
                            <img
                              src={
                                getImageUrl(post.image_url?.[0]?.url || "") ||
                                "/placeholder.svg"
                              }
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge
                                className={`${getStatusColor(
                                  post.study?.status || ""
                                )} border-0 shadow-sm`}
                              >
                                {post.study?.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col gap-4">
                            {/* Post Title & Content */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs font-normal ${getCategoryColor(
                                    post.study?.study_category || ""
                                  )}`}
                                >
                                  {post.study?.study_category || ""}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{" "}
                                  {post.study?.region || ""}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
                                {post.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {post.study?.description || ""}
                              </p>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border/50 w-full" />

                            {/* Study Info & Stats */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="text-xs">
                                    {new Date(
                                      post.created_at ||
                                        new Date().toISOString()
                                    ).toLocaleDateString("ko-KR")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-xs font-medium">
                                    <span className="text-foreground">
                                      {post.study?.current_participants || 0}
                                    </span>
                                    <span className="text-muted-foreground">
                                      /{post.study?.max_participants || 0}명
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      (post.study?.current_participants ||
                                        (0 /
                                          (post.study?.max_participants || 0)) *
                                          0) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Footer: Author & Metrics */}
                            <div className="flex items-center justify-between mt-auto pt-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 ring-1 ring-border">
                                  <AvatarImage
                                    src="/placeholder.svg"
                                    alt={post.author?.email || ""}
                                  />
                                  <AvatarFallback className="text-[10px] bg-secondary">
                                    {post.author?.email?.[0] || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {post.author?.email || ""}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />{" "}
                                  {post.likes_count}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> {post.views_count}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-xs">
                      다른 키워드로 검색하거나 필터를 초기화해보세요.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("전체 카테고리");
                        setMainRegionValue("전체 지역");
                        setRegionValue("전체 지역");
                        setSelectedStatus("전체 상태");
                      }}
                    >
                      필터 초기화
                    </Button>
                  </div>
                )}

                {/* Infinite Scroll Indicator */}
                {filteredPosts.length > 0 && (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
