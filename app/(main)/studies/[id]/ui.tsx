"use client";

import { useDeleteStudy } from "@/hooks/useStudy";
import { StudyResponse } from "@/types/studiesType";
import { ProfileResponse } from "@/types/profileType";
import HeaderSection from "@/components/studies/detail/HeaderSection";
import TabSection from "@/components/studies/detail/TabSection";

export default function UserStudyDetailUI({ study, user }: { study: StudyResponse, user: ProfileResponse }) {

  const deleteStudy = useDeleteStudy({ id: study.id.toString() });

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1">
        {/* 스터디 헤더 섹션 */}
        <HeaderSection study={study} deleteStudy={deleteStudy} />

        {/* 탭 컨텐츠 */}
        <TabSection study={study} user={user} deleteStudy={deleteStudy} />
        
      </main>

    </div>
  );
}
