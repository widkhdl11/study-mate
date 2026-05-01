import { getAllPostsSSR } from "@/actions/postAction";
import HeaderSection from "@/components/posts/HeaderSection";
import MainSection from "@/components/posts/MainSection";
import { PostsListSkeleton } from "@/components/skeleton";
import { Suspense } from "react";

export default async function PostsPage(
  {searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}
) {
  const search = (await searchParams).search
  return (
      <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <HeaderSection />
        <Suspense fallback={<PostsListSkeleton />}>
          <MainSectionLoader search={search as string} />
        </Suspense>
      </main>
    
    </div>
  );
}
async function MainSectionLoader({search}: 
  {
    search: string
  }) {
  const allPosts = await getAllPostsSSR()

  return <MainSection allPosts={allPosts} search={search as string} />
}