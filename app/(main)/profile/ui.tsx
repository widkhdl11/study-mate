"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MessageSquare,
  FileText,
  BookOpen,
  Edit,
  Lock,
  LogOut,
  Settings,
} from "lucide-react";
import MyChatTab from "@/components/profile/info/my-chat-tab";
import MyPostTab from "@/components/profile/info/my-post-tab";
import MyStudiesTab from "@/components/profile/info/my-studies-tab";
import MyInfoTab from "@/components/profile/info/my-info-tab";
import { useGetMyProfile, useUser } from "@/hooks/useUser";
import { convertUser } from "@/types/convertion/user";
import { useGetAllPosts, useGetMyPosts, useGetPost } from "@/hooks/usePost";
import { PostsResponse } from "@/types/response/post";
import { StudiesResponse } from "@/types/response/studies";
import { useGetMyStudies } from "@/hooks/useStudy";
import { useEffect, useState } from "react";
import { useUpdateProfileImage } from "@/hooks/useProfile";
import { getProfileImageUrl } from "@/utils/supabase/storage";
import { ProfileResponse } from "@/types/response/profile";
import { useLogout } from "@/hooks/useAuth";
import { useGetChats } from "@/hooks/useChat";

export default function UserProfileUI({ user, posts, studies }: { user: ProfileResponse, posts: PostsResponse[], studies: StudiesResponse[] }) {
 
  const {data: chatRooms} = useGetChats();
  

  // const { data: user } = useGetMyProfile();
  // const { data: posts } = useGetMyPosts();
  // const { data: studies } = useGetMyStudies();
  const myPosts = posts || [];
  const myStudies = studies || [];
  const currentUser = convertUser(user || []);
  const logoutMutation = useLogout();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "모집중":
        return "bg-green-500 text-white";
      case "마감":
        return "bg-red-500 text-white";
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
  const [profileImage, setProfileImage] = useState(currentUser?.avatar_url || "/placeholder.svg")

  const updateProfileImage = useUpdateProfileImage();
  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // ✅ 미리보기: URL.createObjectURL (빠름!)
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl); 
    updateProfileImage.mutate(file);
  }
  // 🧹 메모리 해제
useEffect(() => {
  return () => {
    if (profileImage && profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(profileImage);
    }
  };
}, [profileImage]);
  const getInitials = (username: string) => {
    return username.split(" ").map((name) => name[0]).join("");
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1">
        {/* 프로필 헤더 */}
        <section className="border-b border-border bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
            <div className="relative flex-shrink-0">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={getProfileImageUrl(currentUser?.avatar_url || "") || "/placeholder.svg"} alt={currentUser.username || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {currentUser.email?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* 톱니바퀴 아이콘 버튼 */}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-gray-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all hover:scale-110"
                  title="프로필 이미지 변경"
                >
                  <Settings className="w-4 h-4" />
                </label>

                {/* 숨겨진 파일 입력 */}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
              {/* <Avatar className="h-24 w-24 ring-4 ring-primary/20 flex-shrink-0">
                <AvatarImage
                  src={currentUser?.avatar || "/placeholder.svg"}
                  alt={currentUser?.username || ""}
                />
                <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                  {currentUser?.initials || ""}
                </AvatarFallback>
              </Avatar> */}

              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {currentUser?.username || ""}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {currentUser?.email || ""}
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white w-fit">
                    {currentUser?.level || ""}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4">{currentUser.bio}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      {myStudies.length}
                    </p>
                    <p className="text-xs text-muted-foreground">내 스터디</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      {myPosts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">모집글</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      {currentUser.points}
                    </p>
                    <p className="text-xs text-muted-foreground">포인트</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/profile/edit">
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </Button>
                  </Link>
                  <Link href="/profile/password">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Lock className="w-4 h-4" />
                      비밀번호 변경
                    </Button>
                  </Link>
                  <Button variant="outline" className="gap-2 bg-transparent" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 탭 컨텐츠 */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
                <TabsTrigger value="info" className="gap-2">
                  <User className="w-4 h-4 hidden sm:inline" />내 정보
                </TabsTrigger>
                <TabsTrigger value="chats" className="gap-2">
                  <MessageSquare className="w-4 h-4 hidden sm:inline" />
                  채팅 ({chatRooms?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="posts" className="gap-2">
                  <FileText className="w-4 h-4 hidden sm:inline" />
                  작성한 글 ({myPosts.length})
                </TabsTrigger>
                <TabsTrigger value="studies" className="gap-2">
                  <BookOpen className="w-4 h-4 hidden sm:inline" />내 스터디 (
                  {myStudies.length})
                </TabsTrigger>
              </TabsList>

              {/* 내 정보 탭 */}
              <MyInfoTab currentUser={currentUser} />

              <MyChatTab chatRooms={chatRooms || []} />
              <MyPostTab
                myPosts={myPosts}
                getStatusColor={getStatusColor}
                getCategoryColor={getCategoryColor}
              />
              <MyStudiesTab
                myStudies={myStudies}
                getStatusColor={getStatusColor}
                getCategoryColor={getCategoryColor}
              />
            </Tabs>
          </div>
        </section>
      </main>

    </div>
  );
}
