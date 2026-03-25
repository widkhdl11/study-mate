"use client";

import { PostsResponse } from "@/types/postType";
import HeaderSection from "@/components/posts/HeaderSection";
import MainSection from "@/components/posts/MainSection";
import { useSearchParams } from "next/navigation";

export default function PostsUI({ allPosts }: { allPosts: PostsResponse }) {
  
  const searchParams = useSearchParams()
  const search = searchParams.get("search")?.trim() ?? "";
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


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Header Section */}
        <HeaderSection />

        {/* Main Content */}
        <MainSection
          allPosts={allPosts}
          getStatusColor={getStatusColor}
          search={search}
        />
      </main>

    </div>
  );
}
