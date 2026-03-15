import { getPostDetailSSR } from "@/actions/postAction";
import PostDetailUI from "./ui";
import { getMyProfileSSR } from "@/actions/profileAction";
import { getChatParticipantsSSR } from "@/actions/chatAction";
import { checkParticipantStatusSSR } from "@/actions/participantAction";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [post, user] = await Promise.all([
    getPostDetailSSR(Number(id)),
    getMyProfileSSR()
  ]);
  const participant = await checkParticipantStatusSSR(post.study.id);
 
  return <PostDetailUI initialPost={post} user={user} participant={participant} />;
}
