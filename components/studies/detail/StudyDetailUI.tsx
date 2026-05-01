"use client";
import HeaderSection from "@/components/studies/detail/HeaderSection";
import TabSection from "@/components/studies/detail/TabSection";
import { useDeleteStudy } from "@/hooks/useStudy";
import { ProfileResponse } from "@/types/profileType";
import { StudyResponse } from "@/types/studiesType";

export default function StudyDetailUI({ study, user }: { study: StudyResponse, user: ProfileResponse }) {
  const {mutate: deleteStudy, isPending} = useDeleteStudy({ id: study.id.toString() });

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1">
        <HeaderSection study={study} deleteStudy={deleteStudy} isPending={isPending} />
        <TabSection study={study} user={user} deleteStudy={deleteStudy} isPending={isPending} />
      </main>

    </div>
  );
}
