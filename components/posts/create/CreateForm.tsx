'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MapPin, Tag, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getRegionPath } from '@/lib/constants/region'
import { getCategoryPath } from '@/lib/constants/study-category'
import { zodResolverFirstError } from '@/utils/utils'
import { PostFormValues, postSchema } from '@/lib/zod/schemas/postSchema'
import { useForm } from 'react-hook-form'
import { useCreatePost } from '@/hooks/usePost'
import { StudiesResponse } from '@/types/studiesType'
import { studyStatusConversion } from '@/utils/conversion/study'
import Image from 'next/image'

export default function CreateForm({ studies }: { studies: StudiesResponse }) {
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

    const form = useForm<PostFormValues>({
        resolver: zodResolverFirstError(postSchema),
        defaultValues: {
            title: '',
            studyId: 0,
            content: '',
            images: [] as File[],
        },
    })
    const { mutate: createPost, isPending: isLoading } = useCreatePost(
        (filed, message) => {
            form.setError(filed as keyof PostFormValues, {
                type: 'server',
                message,
            })
        }
    )
    const formRef = useRef<HTMLFormElement>(null)

    const selectedStudy = studies.find(
        (s) => s.id === Number(form.watch('studyId'))
    )

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
        setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])

        const currentImages = form.getValues('images') || []
        form.setValue('images', [...currentImages, ...files])
    }

    const removeImage = (index: number) => {
        setImagePreviewUrls((prev) => {
            const newUrls = prev.filter((_, i) => i !== index)
            if (prev[index]) {
                URL.revokeObjectURL(prev[index])
            }
            return newUrls
        })

        const currentImages = form.getValues('images') || []
        form.setValue(
            'images',
            currentImages.filter((_, i) => i !== index)
        )
    }

    async function onSubmit(values: PostFormValues) {
        if (!formRef.current) {
            return
        }
        const formData = new FormData(formRef.current)
        // File 직접 추가
        if (values.images) {
            values.images.forEach((file) => {
                formData.append('images', file as File)
            })
        }
        createPost(formData)
    }

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'>
                {/* 게시글 제목 */}
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>게시글 제목</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='게시글 제목을 입력해주세요'
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* 스터디 선택 */}
                <FormField
                    control={form.control}
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

                {/* 내용 */}
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>내용 *</FormLabel>
                            <FormDescription>
                                모집글의 상세한 내용을 입력해주세요 (최소 10자)
                            </FormDescription>
                            <FormControl>
                                <Textarea
                                    placeholder='스터디에 대한 상세한 설명을 입력하세요'
                                    disabled={isLoading}
                                    rows={6}
                                    className='resize-none'
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
                    name='images'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>이미지</FormLabel>
                            <FormDescription>
                                선택사항: 이미지를 업로드하면 모집글이 더 눈에
                                띕니다
                            </FormDescription>
                            <FormControl>
                                <div className='space-y-4'>
                                    <label className='relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/50'>
                                        <svg
                                            className='w-10 h-10 text-slate-400 mb-2'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                            />
                                        </svg>
                                        <p className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                            이미지를 클릭하거나 드래그해서
                                            업로드하세요
                                        </p>
                                        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                                            PNG, JPG, GIF (최대 10MB)
                                        </p>
                                        <input
                                            type='file'
                                            multiple
                                            accept='image/*'
                                            onChange={handleImageChange}
                                            className='sr-only'
                                            disabled={isLoading}
                                        />
                                    </label>

                                    {imagePreviewUrls.length > 0 && (
                                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                                            {imagePreviewUrls.map(
                                                (url, index) => (
                                                    <div
                                                        key={index}
                                                        className='relative group'>
                                                        <img
                                                            src={
                                                                url ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={`미리보기 ${index + 1}`}
                                                            className='w-full h-24 object-cover rounded-lg'
                                                        />
                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                                                            disabled={
                                                                isLoading
                                                            }>
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <input
                    type='hidden'
                    name='studyId'
                    value={form.watch('studyId')}
                />

                <div className='flex gap-3 pt-4'>
                    <Button
                        type='submit'
                        className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
                        disabled={isLoading}>
                        {isLoading ? '작성 중...' : '모집글 작성'}
                    </Button>
                    <Link href='/' className='flex-1'>
                        <Button
                            type='button'
                            variant='outline'
                            className='w-full bg-transparent'
                            disabled={isLoading}>
                            취소
                        </Button>
                    </Link>
                </div>
            </form>
        </Form>
    )
}
