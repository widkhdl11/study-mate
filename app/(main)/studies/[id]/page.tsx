import { getStudyDetailSSR } from "@/actions/studyAction";
import UserStudyDetailUI from "./ui";
import { getMyProfileSSR } from "@/actions/profileAction";
import { ProfileResponse } from "@/types/profileType";
import { StudiesResponse, StudyResponse } from "@/types/studiesType";
import { notFound } from "next/navigation";

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getStudyDetailSSR(Number(id));
  const user = await getMyProfileSSR();
  if (!user) {
    notFound()
  }
  return <UserStudyDetailUI study={study} user={user} />;
}
