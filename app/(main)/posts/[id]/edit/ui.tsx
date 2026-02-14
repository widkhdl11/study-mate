"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { postSchema, PostFormValues, updatePostSchema } from "@/lib/zod/schemas/postSchema"
import { zodResolverFirstError } from "@/utils/utils"
import { PostDetailResponse, PostsResponse } from "@/types/postType"
import { useUpdatePost } from "@/hooks/usePost"
import { StudiesResponse, StudyResponse } from "@/types/studiesType"
import { Input } from "@/components/ui/input"
import { getImageUrl } from "@/lib/supabase/storage"


export function PostEditUI({ initialData, studies }: { initialData: PostDetailResponse, studies: StudiesResponse }) {
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<PostFormValues>({
      resolver: zodResolverFirstError(updatePostSchema),
      defaultValues: {
        ...initialData,  
        studyId: initialData.study.id, 
        images: initialData.image_url.map((image) => new File([], image.url)) as File[] || [],
      },
    })

    const {mutate: updatePostMutation, isPending} = useUpdatePost((field ,message)=>{
      form.setError(field as keyof PostFormValues, {
        type: "server",
        message,
      });
    });

  useEffect(() => {

    const files = Array.from(form.getValues("images") || [])
    if (files.length === 0) return
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(newPreviewUrls)
    console.log("newPreviewUrls 출력", newPreviewUrls)

  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))

    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])

    const currentImages = form.getValues("images") || []
    form.setValue("images", [...currentImages, ...files])
  }

  const removeImage = (index: number) => {
    setImagePreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index)
      if (prev[index] && prev[index].startsWith("blob:")) {
        URL.revokeObjectURL(prev[index])
      }
      return newUrls;
    })

    const currentImages = form.getValues("images") || []
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    )
  }

  async function onSubmit(values: PostFormValues) {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (values.images) {
      values.images.forEach((file) => {
        formData.append("images", file as File);
      });
    }
    updatePostMutation(formData);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Study Mate</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">함께 성장하는 스터디 문화</p>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">모집글 수정</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" ref={formRef}>

              <FormField
                control={form.control}
                name="title"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>게시글 제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="게시글 제목을 입력해주세요"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 스터디 선택 */}
              <FormField
                control={form.control}
                name="studyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스터디 선택 *</FormLabel>
                    <FormDescription>모집글을 작성할 스터디를 선택해주세요</FormDescription>
                    <Select 
                      value={field.value?.toString()} 
                      onValueChange={(value) => field.onChange(Number(value))} 
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="스터디를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studies?.map((study) => (
                          <SelectItem key={study.id} value={study.id.toString()}>
                            {study.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 모임 날짜
              <FormField
                control={form.control}
                name="meeting_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>모임 날짜 *</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* 내용 */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용 *</FormLabel>
                    <FormDescription>모집글의 상세한 내용을 입력해주세요 (최소 10자)</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="스터디에 대한 상세한 설명을 입력하세요"
                        disabled={isPending}
                        rows={6}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 이미지 업로드 */}
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>이미지</FormLabel>
                    <FormDescription>선택사항: 이미지를 업로드하면 모집글이 더 눈에 띕니다</FormDescription>
                    <FormControl>
                      <div className="space-y-4">
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/50">
                          <svg
                            className="w-10 h-10 text-slate-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            이미지를 클릭하거나 드래그해서 업로드하세요
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, GIF (최대 10MB)</p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            disabled={isPending}
                          />
                        </label>

                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`미리보기 ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  disabled={isPending}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
                  {isPending ? "수정 중..." : "수정 완료"}
                </Button>
                <Link href={`/posts/${initialData.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isPending}>
                    취소
                  </Button>
                </Link>
              </div>

              <input type="hidden" name="id" value={initialData.id} />
              <input type="hidden" name="title" value={form.watch("title")} />
              <input type="hidden" name="content" value={form.watch("content")} />
              <input type="hidden" name="studyId" value={form.watch("studyId")} />
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
