import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  // 임시 데이터 - 실제로는 DB에서 가져올 예정
  const posts = [
    {
      id: 1,
      title: "2024 겨울 프론트엔드 심화 스터디",
      content: "React, Next.js 심화 과정을 함께 진행할 멤버를 모집합니다.",
      image: "/frontend-study-meeting.jpg",
      studyTitle: "frontend Masters 2024",
      category: "프론트엔드",
      location: "서울 강남",
      participants: 3,
      maxParticipants: 10,
      status: "모집중",
      meetingDate: "2024.01.15",
      author: { name: "김민준", initials: "KM" },
      likes: 24,
      views: 156,
      postedTime: "3일 전",
    },
    {
      id: 2,
      title: "Spring Boot 완전 정복 스터디",
      content: "자바 백엔드 개발자를 위한 Spring Boot 마스터 클래스입니다.",
      image: "/backend-java-spring-boot.jpg",
      studyTitle: "Backend Academy",
      category: "백엔드",
      location: "온라인",
      participants: 7,
      maxParticipants: 8,
      status: "마감",
      meetingDate: "2024.01.10",
      author: { name: "이순신", initials: "LS" },
      likes: 42,
      views: 298,
      postedTime: "1일 전",
    },
    {
      id: 3,
      title: "AI/ML 기초부터 시작하기",
      content: "Python으로 배우는 머신러닝 입문 과정입니다.",
      image: "/machine-learning-ai-python.jpg",
      studyTitle: "AI Study Group",
      category: "AI",
      location: "서울 종로",
      participants: 5,
      maxParticipants: 12,
      status: "모집중",
      meetingDate: "2024.01.20",
      author: { name: "박지은", initials: "PJ" },
      likes: 31,
      views: 187,
      postedTime: "2일 전",
    },
    {
      id: 4,
      title: "모바일 앱 개발 - React Native",
      content: "React Native로 크로스 플랫폼 모바일 앱을 개발합니다.",
      image: "/mobile-app-react-native-development.jpg",
      studyTitle: "Mobile Dev Study",
      category: "모바일",
      location: "서울 강북",
      participants: 4,
      maxParticipants: 6,
      status: "모집중",
      meetingDate: "2024.01.25",
      author: { name: "정대호", initials: "JD" },
      likes: 18,
      views: 102,
      postedTime: "5일 전",
    },
    {
      id: 5,
      title: "UI/UX 디자인 기초 스터디",
      content: "Figma를 활용한 현대적인 UI/UX 디자인을 배웁니다.",
      image: "/ui-ux-design-figma.jpg",
      studyTitle: "Design Lab",
      category: "디자인",
      location: "온라인",
      participants: 8,
      maxParticipants: 10,
      status: "수락 대기중",
      meetingDate: "2024.01.18",
      author: { name: "최민지", initials: "CM" },
      likes: 36,
      views: 214,
      postedTime: "4일 전",
    },
    {
      id: 6,
      title: "TypeScript 완벽 가이드",
      content: "타입스크립트의 심화 개념과 실제 프로젝트 적용법을 배웁니다.",
      image: "/typescript-programming-guide.jpg",
      studyTitle: "TypeScript Masters",
      category: "프론트엔드",
      location: "서울 강남",
      participants: 6,
      maxParticipants: 8,
      status: "모집중",
      meetingDate: "2024.01.22",
      author: { name: "홍길동", initials: "HG" },
      likes: 28,
      views: 165,
      postedTime: "6일 전",
    },
  ];

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
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Study Mate
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance">
                함께 성장하는 스터디 문화
              </p>
            </div>

            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              당신의 학습 목표를 달성할 수 있는 최적의 스터디를 찾아보세요. 같은
              목표를 가진 사람들과 함께라면, 학습은 더욱 즐겁고 효과적입니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
              <Link href="/studies/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  스터디 만들기
                </Button>
              </Link>
              <Link href="/posts">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  모집글 보기
                </Button>
              </Link>
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
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:border-accent/50">
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-48 bg-muted overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
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
                            {post.studyTitle}
                          </p>
                        </div>

                        {/* Category & Location */}
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            className={`${getCategoryColor(
                              post.category
                            )} border-0`}
                          >
                            {post.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.location}
                          </Badge>
                        </div>

                        {/* Participants Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">
                              참여 인원
                            </span>
                            <span className="font-semibold text-foreground">
                              {post.participants}/{post.maxParticipants}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (post.participants / post.maxParticipants) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Meeting Date & Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {post.meetingDate}
                          </span>
                          <Badge
                            className={`${getStatusColor(
                              post.status
                            )} border-0 text-xs`}
                          >
                            {post.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-2 border-t border-border pt-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={post.author.name}
                          />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {post.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {post.author.name}
                        </span>
                      </div>

                      {/* Engagement & Time */}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex gap-3">
                          <span>👍 {post.likes}</span>
                          <span>👁 {post.views}</span>
                        </div>
                        <span>{post.postedTime}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
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

      <Footer />
    </div>
  );
}
