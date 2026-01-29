// app/studies/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudyEditUI } from "./ui";
import { getMyStudyByIdSSR } from "@/actions/studyAction";
import { getCategoryPath } from "@/lib/constants/study-category";
import { getRegionPath } from "@/lib/constants/region";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyEditPage({ params }: PageProps) {
  const { id } = await params;
  const study = await getMyStudyByIdSSR(id);

  // ✅ 서버에서 미리 계산
  const categoryPath = getCategoryPath(Number(study.study_category));
  const [mainCategory, subCategory, detailCategory] = categoryPath.values;


  let mainRegion = "";
  let detailRegion = "";
  
  if (Number(study.region) === 0) {
    mainRegion = "ONLINE";
  } else {
    const regionPath = getRegionPath(Number(study.region));
    [mainRegion, detailRegion] = regionPath.values;
  }

  // ✅ 계산된 값을 props로 전달
  const initialData = {
    title: study.title,
    mainCategory,
    subCategory,
    detailCategory,
    studyCategory: study.study_category,
    mainRegion,
    detailRegion: detailRegion || "",
    region: study.region,
    maxParticipants: study.max_participants,
    description: study.description,
  };


  return <StudyEditUI studyId={id} initialData={initialData} />;
}