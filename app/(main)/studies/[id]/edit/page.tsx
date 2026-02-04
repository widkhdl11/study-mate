import { StudyEditUI } from "./ui";
import { getMyStudyByIdSSR } from "@/actions/studyAction";
import { getCategoryPath } from "@/lib/constants/study-category";
import { getRegionPath } from "@/lib/constants/region";
import { StudyWithAllCategoriesAndRegions } from "@/types/response/studies";


export default async function StudyEditPage({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const study = await getMyStudyByIdSSR(id);

  // ✅ 서버에서 미리 계산
  const categoryPath = getCategoryPath(Number(study.study_category));
  const [mainCategory, subCategory, detailCategory] = categoryPath.values;


  let detailRegion = "";
  let mainRegion = "";
  
  if (Number(study.region) === 0) {
    mainRegion = "ONLINE";
  } else {
    const regionPath = getRegionPath(Number(study.region));
    [mainRegion, detailRegion] = regionPath.values;
  }

  const initialData: StudyWithAllCategoriesAndRegions = {
      ...study,  
      mainCategory,
      subCategory,
      detailCategory,
      studyCategory: study.study_category,
      mainRegion,
      detailRegion: detailRegion || "",
      region: study.region,
      maxParticipants: study.max_participants,
  };

  return <StudyEditUI studyId={id} initialData={initialData} />;
}