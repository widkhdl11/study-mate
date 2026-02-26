"use client";

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
import {
  getCategoryCodeByValue,
  getDetailCategories,
  getMainCategories,
  getSubcategories,
} from "@/lib/constants/study-category";
import {
  getMainRegion,
  getRegionCodeByValue,
  getRegionPath,
  getSubRegion,
} from "@/lib/constants/region";
import { useUpdateStudy } from "@/hooks/useStudy";
import { zodResolverFirstError } from "@/utils/utils";
import { StudyWithAllCategoriesAndRegions } from "@/types/studiesType";


export function StudyEditUI({ studyId, initialData }: { studyId: string, initialData: StudyWithAllCategoriesAndRegions }) {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<StudyWithAllCategoriesAndRegions>({
    resolver: zodResolverFirstError(studySchema),
    defaultValues: initialData, 
  });
  const {mutate: updateStudyMutation, isPending} = useUpdateStudy((field ,message)=>{
    form.setError(field as keyof StudyFormValues, {
      type: "server",
      message,
    });
  });
  // 카테고리 상태
  const [mainCategoryValue, setMainCategoryValue] = useState(initialData.mainCategory);
  const [subCategoryValue, setSubCategoryValue] = useState(initialData.subCategory);
  const [detailCategoryValue, setDetailCategoryValue] = useState(initialData.detailCategory);
  const [studyCategoryValue, setStudyCategoryValue] = useState(initialData.studyCategory);

  // 지역 상태
  const [mainRegionValue, setMainRegionValue] = useState(initialData.mainRegion);
  const [detailRegionValue, setDetailRegionValue] = useState(initialData.detailRegion);
  const [regionValue, setRegionValue] = useState(initialData.region);


  // 동적 옵션
  const mainCategories = getMainCategories();
  const subcategories = getSubcategories(mainCategoryValue)
  const detailCategories = getDetailCategories(mainCategoryValue, subCategoryValue)

  const mainRegions = getMainRegion();
  const detailRegions = getSubRegion(mainRegionValue)

  async function onSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    updateStudyMutation(formData);
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

        {/* 스터디 수정 폼 카드 */}
        <Card className="p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            스터디 수정하기
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" ref={formRef}>
              {/* 제목 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스터디 제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="스터디 제목을 입력해주세요"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 대분류 */}
              <FormField
                control={form.control}
                name="mainCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (대분류)</FormLabel>
                    <Select
                      value={mainCategoryValue}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMainCategoryValue(value);
                        setSubCategoryValue("");
                        setDetailCategoryValue("");
                        setStudyCategoryValue(0);
                        form.setValue("studyCategory", 0);
                      }}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="대분류 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="전체">
                          전체
                        </SelectItem>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 중분류 */}
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (중분류)</FormLabel>
                    <Select
                      key={`sub-${mainCategoryValue}`}
                      value={subCategoryValue}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSubCategoryValue(value);
                        setDetailCategoryValue("");
                        setStudyCategoryValue(0);
                        form.setValue("studyCategory", 0);
                      }}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="중분류 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="전체">
                          전체
                        </SelectItem>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 소분류 */}
              <FormField
                control={form.control}
                name="detailCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 (소분류)</FormLabel>
                    <Select
                      key={`detail-${mainCategoryValue}-${subCategoryValue}`}
                      value={detailCategoryValue}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDetailCategoryValue(value);
                        const code = getCategoryCodeByValue(value);
                        if (code) {
                          setStudyCategoryValue(code);
                          form.setValue("studyCategory", code, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="소분류 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="전체">
                          전체
                        </SelectItem>
                        {detailCategories.map((detail) => (
                          <SelectItem key={detail.value} value={detail.value}>
                            {detail.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 시/도 */}
              <FormField
                control={form.control}
                name="mainRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역 (시/도)</FormLabel>
                    <Select
                      value={mainRegionValue}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMainRegionValue(value);
                        setDetailRegionValue("");

                        if (value === "ONLINE") {
                          setRegionValue(0);
                          form.setValue("region", 0, {
                            shouldValidate: true,
                          });
                        } else {
                          setRegionValue(0);
                          form.setValue("region", 0);
                        }
                      }}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="시/도 선택" />
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
              />

              {/* 시/군/구 */}
       
                  <FormField
                    control={form.control}
                    name="detailRegion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>지역 (시/군/구)</FormLabel>
                        <Select
                          key={`sub-region-${mainRegionValue}`}
                          value={detailRegionValue}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setDetailRegionValue(value);
                            const code = getRegionCodeByValue(value);
                            if (code !== null && code !== undefined) {
                              setRegionValue(code);
                              form.setValue("region", code, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="시/군/구 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {detailRegions.map((sub) => (
                              <SelectItem key={sub.value} value={sub.value}>
                                {sub.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

              {/* 최대 인원 */}
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
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 설명 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="스터디에 대해 설명해주세요 (최소 10자)"
                        disabled={isPending}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isPending}
                >
                  {isPending ? "저장 중..." : "수정 완료"}
                </Button>
                <Link href={`/studies/${studyId}`} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled={isPending}
                  >
                    취소
                  </Button>
                </Link>
              </div>
              <input type="hidden" name="id" value={studyId} />
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
                name="detailCategory"
                value={detailCategoryValue}
              />
              <input
                type="hidden"
                name="mainRegion"
                value={mainRegionValue}
              />
              <input
                type="hidden"
                name="detailRegion"
                value={detailRegionValue}
              />
              
              <input
                type="hidden"
                name="studyCategory"
                value={studyCategoryValue}
              />
              <input type="hidden" name="region" value={regionValue} />
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}