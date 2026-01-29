"use client";

import { useAIRecommendedStudies } from "@/hooks/useAgent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export function AIRecommendedStudies() {
  const { data: recommendations, isLoading, error } = useAIRecommendedStudies();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI 추천 스터디
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">AI가 분석 중...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !recommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI 추천 스터디
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            추천할 스터디를 찾지 못했어요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AI 추천 스터디
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          회원님의 프로필을 분석해서 추천해드려요
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <Link 
            key={rec.studyId} 
            href={`/studies/${rec.studyId}`}
            className="block"
          >
            <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1} 추천
                    </Badge>
                    {rec.study?.study_category && (
                      <Badge variant="outline" className="text-xs">
                        {rec.study.study_category}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    💡 {rec.reason}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}