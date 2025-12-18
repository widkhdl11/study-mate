"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudyFormValues, studySchema } from "@/lib/zod/schemas/studySchema";
import { useCreateStudy } from "@/hooks/useStudy";
import {
  getDetailCategories,
  getMainCategories,
  getSubcategories,
  STUDY_CATEGORIES,
} from "@/lib/constants/study-category";
import { getMainRegion, getSubRegion } from "@/lib/constants/region";

export default function StudyCreateUI() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      title: "",
      mainCategory: "",
      subCategory: "",
      studyCategory: 0,
      mainRegion: "",
      region: 0,
      maxParticipants: 1,
      description: "",
    },
  });
  const createStudyMutation = useCreateStudy();
  // 1. 상태 정의
  const [mainCategoryValue, setMainCategoryValue] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");
  const [studyCategoryValue, setStudyCategoryValue] = useState(0);
  // 지역 상태
  const [mainRegionValue, setMainRegionValue] = useState("");
  const [regionValue, setRegionValue] = useState("");

  // 2. 동적 옵션 생성
  const mainCategories = getMainCategories();
  const subcategories = mainCategoryValue
    ? getSubcategories(mainCategoryValue)
    : [];
  const detailCategories =
    mainCategoryValue && subCategoryValue
      ? getDetailCategories(mainCategoryValue, subCategoryValue)
      : [];

  // 동적 옵션
  const mainRegions = getMainRegion();
  const regions = mainRegionValue ? getSubRegion(mainRegionValue) : [];

  async function onSubmit(values: StudyFormValues) {
    if (!formRef.current) {
      return;
    }
    form.clearErrors();
    setIsLoading(true);
    try {
      const formData = new FormData(formRef.current);
      console.log("values", values);
      createStudyMutation.mutate(formData);
    } finally {
      setIsLoading(false);
    }
  }

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

        {/* 스터디 생성 폼 카드 */}
        <Card className="p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            스터디 만들기
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              ref={formRef}
              className="space-y-5"
            >
              {/* 제목 필드 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스터디 제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="스터디 제목을 입력해주세요"
                        disabled={isLoading}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 카테고리 필드 */}
              {/* <FormField
                control={form.control}
                name="studyCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      disabled={isLoading}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="frontend">프론트엔드</SelectItem>
                        <SelectItem value="backend">백엔드</SelectItem>
                        <SelectItem value="mobile">모바일</SelectItem>
                        <SelectItem value="ai">AI</SelectItem>
                        <SelectItem value="design">디자인</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="mainCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (대분류)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMainCategoryValue(value);
                        setSubCategoryValue(""); // 리셋
                        setStudyCategoryValue(0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="대분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* 중분류 카테고리 */}
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (중분류)</FormLabel>
                    <Select
                      key={`sub-${mainCategoryValue}`} // ✅ key로 강제 리렌더
                      onValueChange={(value) => {
                        field.onChange(value);
                        // setMainCategoryValue(value); // ← 이게 중요!
                        setSubCategoryValue(value);
                        setStudyCategoryValue(0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="중분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 소분류 카테고리 (선택) */}
              <FormField
                control={form.control}
                name="studyCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (소분류)</FormLabel>
                    <Select
                      key={`detail-${mainCategoryValue}-${subCategoryValue}`} // ✅ key로 강제 리렌더
                      onValueChange={(value) => {
                        field.onChange(value);
                        setStudyCategoryValue(Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="소분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {detailCategories.map(
                          (detail: { value: string; label: string }) => (
                            <SelectItem key={detail.value} value={detail.value}>
                              {detail.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 지역 필드 */}
              {/* <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역</FormLabel>
                    <Select
                      key={`main-region-${mainRegionValue}`}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMainRegionValue(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="지역을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mainRegions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="mainRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역 (시/도)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMainRegionValue(value);
                        setRegionValue("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="시/도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainRegions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {mainRegionValue && regions.length > 0 && (
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>지역 (시/군/구)</FormLabel>
                      <Select
                        key={`sub-region-${mainRegionValue}`}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setRegionValue(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="시/군/구 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map(
                            (sub: { value: string; label: string }) => (
                              <SelectItem key={sub.value} value={sub.value}>
                                {sub.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {/* 최대 인원 필드 */}
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 인원</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        placeholder="1-20명"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 설명 필드 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="스터디에 대해 설명해주세요."
                        disabled={isLoading}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <input
                type="hidden"
                name="studyCategory"
                value={form.watch("studyCategory")}
              />
              <input type="hidden" name="region" value={form.watch("region")} /> */}

              {/* 버튼 영역 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "만드는 중..." : "스터디 만들기"}
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                </Link>
              </div>
              <input
                type="hidden"
                name="mainCategory"
                value={mainCategoryValue}
              />
              <input
                type="hidden"
                name="subCategory"
                value={subCategoryValue}
              />
              <input
                type="hidden"
                name="studyCategory"
                value={studyCategoryValue}
              />
              <input type="hidden" name="mainRegion" value={mainRegionValue} />
              <input type="hidden" name="region" value={regionValue} />
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
