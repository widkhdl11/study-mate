'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRegionPath } from "@/lib/constants/region";
import { getCategoryPath } from "@/lib/constants/study-category";
import { StudyResponse } from "@/types/studiesType";
import { getStudyStatusColor, studyStatusConversion } from "@/utils/conversion/study";
import { UseMutationResult } from "@tanstack/react-query";
import {
    MapPin,
    PlusCircle,
    Settings,
    Trash2,
    Users
} from "lucide-react";
import Link from "next/link";


export default function HeaderSection(
    { study, deleteStudy }: { study: StudyResponse, deleteStudy: UseMutationResult<void, any, void, unknown> }) {
  
    const categoryPath = getCategoryPath(Number(study.study_category));

    return (
         <section className="border-b border-border bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4">
                {/* 뒤로가기 */}
                <Link
                  href="/profile?tab=studies"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← 내 정보로 돌아가기
                </Link>

                {/* 스터디 제목 및 배지 */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {study?.title}
                  </h1>
                  <Badge className={getStudyStatusColor(study.status)}>
                    {studyStatusConversion(study.status)}
                  </Badge>
                </div>

                {/* 카테고리 및 위치 */}
                <div className="flex items-center gap-3">
                  {categoryPath.labels.map((category,i) => (
                    <Badge
                      variant="outline"
                      key={i}
                      className="bg-blue-100 text-blue-700 border-blue-200"
                    >
                      {category}
                    </Badge>
                  ))}
                 
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> 
                    {getRegionPath(Number(study.region)).labels.join(" ")}
                  </span>
                </div>

                {/* 모임 정보 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {/* <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {study.meetingDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {study.meetingTime}
                  </span> */}
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {study.current_participants}/
                    {study.max_participants}명
                  </span>
                </div>
              </div>

              {/* 액션 버튼 영역 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/posts/create?study_id=${study.id}`}>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    모집글 작성
                  </Button>
                </Link>
                <Link href={`/studies/${study.id}/edit`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Settings className="w-4 h-4" />
                    스터디 수정
                  </Button>
                  </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 bg-transparent text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  onClick={() => {
                    if (confirm("정말 이 스터디를 삭제하시겠습니까? 모든 모집글과 채팅 기록이 함께 삭제됩니다.")) {
                      deleteStudy.mutate();
                    }
                  }}
                  disabled={deleteStudy.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  스터디 삭제
                </Button>
              </div>
            </div>

            {/* 참여 인원 진행률 */}
            <div className="mt-6 max-w-md">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">참여 인원</span>
                <span className="font-semibold text-foreground">
                  {study.current_participants}/{study.max_participants}명
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (study.current_participants / study.max_participants) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
    )
}