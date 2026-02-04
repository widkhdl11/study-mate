import { getStudyDetailSSR } from "@/actions/studyAction";
import UserStudyDetailUI from "./ui";
import { getMyProfileSSR } from "@/actions/profileAction";

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getStudyDetailSSR(Number(id));
  const user = await getMyProfileSSR();
  return <UserStudyDetailUI study={study} user={user} />;
}
