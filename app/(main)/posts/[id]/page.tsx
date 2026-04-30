import { getPostDetailSSR } from "@/actions/postAction";
import PostDetailUI from "./ui";
import { getMyProfileSSR } from "@/actions/profileAction";
import { checkParticipantStatusSSR } from "@/actions/participantAction";
import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, user] = await Promise.all([
    getPostDetailSSR(Number(id)),
    getMyProfileSSR(),
  ]);
  if (!user) {
    notFound()
  }
  const participant = await checkParticipantStatusSSR(post.study.id);

  return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <PostDetailUI
            initialPost={post}
            user={user}
            participant={participant}
          />  
      </main>
    </div>
  );
}
