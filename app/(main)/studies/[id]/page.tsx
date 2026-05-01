import { getMyProfileSSR } from "@/actions/profileAction";
import { getStudyDetailSSR } from "@/actions/studyAction";
import { StudyDetailSkeleton } from "@/components/skeleton";
import StudyDetailUI from "@/components/studies/detail/StudyDetailUI";
import { notFound } from "next/navigation";
import { Suspense } from "react";


export default function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<StudyDetailSkeleton />}>
      <StudyDetailLoader params={params} />
    </Suspense>
  );
}

async function StudyDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getStudyDetailSSR(Number(id));
  const user = await getMyProfileSSR();

  if (!user) {
    notFound();
  }

  return (
    <StudyDetailUI study={study} user={user} />
  )
}
