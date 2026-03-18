'use client'

import { PostDetailResponse, PostsResponse } from "@/types/postType"
import Link from "next/link"
import PostCard from "./PostCard"
import { Button } from "../ui/button"


export default function LatestSection(
    {
        posts,
        getCategoryColor,
        getStatusColor,
    }: {
        posts: PostsResponse
        getCategoryColor: (category: string) => string
        getStatusColor: (status: string) => string
    }
) {
    return (
        <section className='py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background'>
                    <div className='max-w-7xl mx-auto space-y-8'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                                최신 모집글
                            </h2>
                            <p className='text-muted-foreground'>
                                지금 모집 중인 스터디들을 확인해보세요
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {posts?.map((post: PostDetailResponse) => (
                                <Link key={post.id} href={`/posts/${post.id}`}>
                                    <PostCard
                                        post={post}
                                        getCategoryColor={getCategoryColor}
                                        getStatusColor={getStatusColor}
                                    />
                                </Link>
                            ))}
                        </div>

                        <div className='text-center pt-6'>
                            <Link href='/posts'>
                                <Button
                                    variant='outline'
                                    size='lg'
                                    className='border-2 border-primary text-primary hover:bg-primary/5 bg-transparent'>
                                    더 많은 모집글 보기 →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
    )
}