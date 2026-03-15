import { getAllPostsSSR } from "@/actions/postAction";
import PostsUI from "./ui";

export default async function PostsPage() {
  const allPosts = await getAllPostsSSR();
  return <PostsUI allPosts={allPosts} />;
}
