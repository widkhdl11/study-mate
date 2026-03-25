import { Suspense } from "react";
import { getAllPostsSSR } from "@/actions/postAction";
import PostsUI from "./ui";

export default async function PostsPage() {
  const allPosts = await getAllPostsSSR();
  return (
    <Suspense fallback={null}>
      <PostsUI allPosts={allPosts} />
    </Suspense>
  );
}
