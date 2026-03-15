'use client'

import { BookOpen, FileText, MessageSquare, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import MyInfoTab from './info/my-info-tab'
import MyChatTab from './info/my-chat-tab'
import MyPostTab from './info/my-post-tab'
import MyStudiesTab from './info/my-studies-tab'
import { ChatRoom } from '@/types/chatType'
import { PostsResponse } from '@/types/postType'
import { StudiesResponse } from '@/types/studiesType'
import { ProfileResponse } from '@/types/profileType'

export default function TabSection({
    currentTab,
    handleTabChange,
    chatRooms,
    myPosts,
    myStudies,
    currentUser,
    getStatusColor,
    getCategoryColor,
}: {
    currentTab: string
    handleTabChange: (value: string) => void
    chatRooms: ChatRoom[]
    myPosts: PostsResponse
    myStudies: StudiesResponse
    currentUser: ProfileResponse
    getStatusColor: (status: string) => string
    getCategoryColor: (category: string) => string
}) {
    return (
        <section className='py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-5xl mx-auto'>
                <Tabs
                    value={currentTab}
                    onValueChange={handleTabChange}
                    className='space-y-6'>
                    <TabsList className='grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex'>
                        <TabsTrigger value='info' className='gap-2'>
                            <User className='w-4 h-4 hidden sm:inline' />내 정보
                        </TabsTrigger>
                        <TabsTrigger value='chats' className='gap-2'>
                            <MessageSquare className='w-4 h-4 hidden sm:inline' />
                            채팅 ({chatRooms.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value='posts' className='gap-2'>
                            <FileText className='w-4 h-4 hidden sm:inline' />
                            작성한 글 ({myPosts.length})
                        </TabsTrigger>
                        <TabsTrigger value='studies' className='gap-2'>
                            <BookOpen className='w-4 h-4 hidden sm:inline' />내
                            스터디 ({myStudies.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* 내 정보 탭 */}
                    <MyInfoTab currentUser={currentUser} />

                    <MyChatTab chatRooms={chatRooms || []} />
                    <MyPostTab
                        myPosts={myPosts}
                        getStatusColor={getStatusColor}
                        getCategoryColor={getCategoryColor}
                    />
                    <MyStudiesTab
                        myStudies={myStudies}
                        getStatusColor={getStatusColor}
                        getCategoryColor={getCategoryColor}
                    />
                </Tabs>
            </div>
        </section>
    )
}
