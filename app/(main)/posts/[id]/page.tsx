import { getPostDetailSSR } from "@/actions/postAction";
import PostDetailUI from "./ui";
import { getMyProfileSSR } from "@/actions/profileAction";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await getPostDetailSSR(Number(id));
  const user = await getMyProfileSSR();
 
  return <PostDetailUI initialPost={post} user={user} />;
}
