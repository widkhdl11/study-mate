import { StudyEditUI } from "./ui";
import { getStudyDetailSSR } from "@/actions/studyAction";
import { getCategoryPath } from "@/lib/constants/study-category";
import { getRegionPath } from "@/lib/constants/region";
import { StudyWithAllCategoriesAndRegions } from "@/types/studiesType";


export default async function StudyEditPage({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const study = await getStudyDetailSSR(Number(id));

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