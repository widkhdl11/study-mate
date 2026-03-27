'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getImageUrl, getProfileImageUrl } from '@/lib/supabase/storage'
import { PostDetailResponse, PostsResponse } from '@/types/postType'
import { formatTimeAgo } from '@/utils/utils'

export default function PostCard({
    post,
    getCategoryColor,
    getStatusColor,
}: {
    post: PostDetailResponse
    getCategoryColor: (category: string) => string
    getStatusColor: (status: string) => string
}) {
    console.log("post : ", post);
    return (
        <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:border-accent/50'>
            {/* Thumbnail Image */}
            <div className='relative w-full h-48 bg-muted overflow-hidden'>
                <img
                    src={getImageUrl(
                        post.image_url?.[0]?.url ||
                            '/default-post-thumbnail.jpg'
                    )}
                    alt={post.title}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
            </div>

            <div className='p-5 flex-1 flex flex-col space-y-4'>
                {/* Post Title */}
                <div>
                    <h3 className='font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors'>
                        {post.title}
                    </h3>
                    <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                        {post.content}
                    </p>
                </div>

                {/* Study Info Section */}
                <div className='space-y-3 border-t border-border pt-3'>
                    {/* Study Title */}
                    <div>
                        <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                            스터디
                        </p>
                        <p className='font-medium text-foreground text-sm'>
                            {post.study.title}
                        </p>
                    </div>

                    {/* Category & Location */}
                    <div className='flex flex-wrap gap-2'>
                        <Badge
                            className={`${getCategoryColor(post.study.study_category.toString())} border-0`}>
                            {post.study.study_category}
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                            {post.study.region}
                        </Badge>
                    </div>

                    {/* Participants Progress */}
                    <div className='space-y-1'>
                        <div className='flex justify-between items-center text-xs'>
                            <span className='text-muted-foreground'>
                                참여 인원
                            </span>
                            <span className='font-semibold text-foreground'>
                                {post.study.current_participants}/
                                {post.study.max_participants}
                            </span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                            <div
                                className='h-full bg-accent rounded-full transition-all duration-300'
                                style={{
                                    width: `${(post.study.current_participants / post.study.max_participants) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Meeting Date & Status */}
                    <div className='flex justify-between items-center'>
                        <span className='text-xs text-muted-foreground'>
                            {post.study.created_at}
                        </span>
                        <Badge
                            className={`${getStatusColor(post.study.status)} border-0 text-xs`}>
                            {post.study.status}
                        </Badge>
                    </div>
                </div>

                {/* Author Info */}
                <div className='flex items-center gap-2 border-t border-border pt-3'>
                    <Avatar className='h-7 w-7'>
                        <AvatarImage
                            src={
                                getProfileImageUrl(post.author.avatar_url) ||
                                '/placeholder.svg'
                            }
                            alt={post.author.username}
                        />
                        <AvatarFallback className='text-xs bg-primary text-primary-foreground'>
                            {post.author.username?.[0] || ''}
                        </AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium text-foreground'>
                        {post.author.username}
                    </span>
                </div>

                {/* Engagement & Time */}
                <div className='flex justify-between items-center text-xs text-muted-foreground'>
                    <div className='flex gap-3'>
                        <span>👍 {post.likes_count}</span>
                        <span>👁 {post.views_count}</span>
                    </div>
                    <span>{formatTimeAgo(post.created_at)}</span>
                </div>
            </div>
        </Card>
    )
}
