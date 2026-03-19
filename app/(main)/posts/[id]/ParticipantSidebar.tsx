import { checkParticipantStatusSSR } from "@/actions/participantAction";
import SidebarSection from "@/components/posts/detail/SidebarSection";
import { PostDetailResponse } from "@/types/postType";
import { STATUS_MAP } from "@/types/studiesType";

interface ParticipantSidebarProps {
  studyId: number;
  post: PostDetailResponse;
}

export default async function ParticipantSidebar({ studyId, post }: ParticipantSidebarProps) {
  const participant = await checkParticipantStatusSSR(studyId);
  const status = STATUS_MAP[participant?.status || ""] || "모집중";

  return <SidebarSection post={post} status={status} />;
}
