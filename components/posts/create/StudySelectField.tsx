'use client'

import { Badge } from "@/components/ui/badge"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRegionPath } from "@/lib/constants/region"
import { getCategoryPath } from "@/lib/constants/study-category"
import { PostFormValues } from "@/lib/zod/schemas/postSchema"
import { StudiesResponse } from "@/types/studiesType"
import { studyStatusConversion } from "@/utils/conversion/study"
import { MapPin, Tag, Users } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { Control, useWatch } from "react-hook-form"

export default function StudySelectField({
    studiesPromise,
    control,
    isLoading,
}: {
    studiesPromise: Promise<StudiesResponse>;
    control: Control<PostFormValues>;
    isLoading: boolean;
}) {
    const studies = use(studiesPromise);
    
    const studyId = useWatch({ control, name: "studyId" });
    const selectedStudy = studies.find((s) => s.id === Number(studyId));
    
    return (
          <FormField
            control={control}
            name='studyId'
            render={({ field }) => (
                <FormItem>
                    <FormLabel>스터디 선택 *</FormLabel>
                    <FormDescription>
                        모집글을 작성할 스터디를 선택해주세요
                    </FormDescription>
                    {studies?.length > 0 ? (
                        <Select
                            value={
                                field.value === undefined ||
                                field.value === 0
                                    ? undefined
                                    : field.value.toString()
                            }
                            onValueChange={field.onChange}
                            disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder='선택' />
                            </SelectTrigger>

                            <SelectContent>
                                {studies?.map((study) => (
                                    <SelectItem
                                        key={study.id}
                                        value={study.id.toString()}
                                        disabled={
                                            study.status === 'closed'|| 
                                            study.status === 'completed'
                                        }>
                                        {study.title} 
                                        {study.status === 'closed'|| study.status === 'completed' ? 
                                        <Badge variant='outline' className='m-1'>
                                            {studyStatusConversion(study.status)}
                                        </Badge> : 
                                            null
                                        }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className='flex flex-col items-center justify-center'>
                            <div className='flex flex-col items-center justify-between h-full w-full'>
                                <p className='text-sm text-slate-500 dark:text-slate-400'>
                                    스터디가 없습니다
                                </p>
                                <Link
                                    href='/studies/create'
                                    className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'>
                                    스터디 만들기
                                </Link>
                            </div>
                        </div>
                    )}
                    <FormMessage />
                    {selectedStudy && (
                        <div className='mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30'>
                            <h4 className='text-sm font-semibold text-slate-900 dark:text-white mb-3'>
                                {selectedStudy.title}
                            </h4>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                                    <Tag className='w-4 h-4 text-blue-600 shrink-0' />
                                    <span className='shrink-0'>
                                        카테고리
                                    </span>
                                    <div className='flex items-center pr-2'>
                                        {getCategoryPath(
                                            Number(
                                                selectedStudy.study_category
                                            )
                                        ).labels.map((category) => (
                                            <Badge
                                                key={category}
                                                variant='secondary'
                                                className='m-auto'>
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 w-full'>
                                    <MapPin className='w-4 h-4 text-blue-600 shrink-0' />
                                    <span className='shrink-0'>
                                        지역
                                    </span>
                                    <div className='w-full flex justify-start shrink-1'>
                                        {getRegionPath(
                                            Number(selectedStudy.region)
                                        ).labels.map((region) => (
                                            <Badge
                                                key={region}
                                                variant='outline'
                                                className='m-1'>
                                                {region}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 col-span-2'>
                                    <Users className='w-4 h-4 text-blue-600' />
                                    <span>모집 인원</span>
                                    <span className='font-medium text-slate-900 dark:text-white'>
                                        {
                                            selectedStudy.current_participants
                                        }
                                        /
                                        {selectedStudy.max_participants}
                                        명
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}