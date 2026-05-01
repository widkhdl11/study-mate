import { getStudyDetailSSR } from "@/actions/studyAction";
import { FormSkeleton } from "@/components/skeleton";
import StudyEditForm from "@/components/studies/detail/edit/StudyEditForm";
import { getRegionPath } from "@/lib/constants/region";
import { getCategoryPath } from "@/lib/constants/study-category";
import { StudyWithAllCategoriesAndRegions } from "@/types/studiesType";
import { Suspense } from "react";

export default async function StudyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <StudyEditLoader params={params} />
    </Suspense>
  );
}
async function StudyEditLoader({ params }: { params: Promise<{ id: string }>}) {
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

  return (
     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* 로고 및 제목 */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Study Mate
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            함께 성장하는 스터디 문화
          </p>
        </div>
        <StudyEditForm initialData={initialData} studyId={id} />

      </div>
    </div>
  )
}