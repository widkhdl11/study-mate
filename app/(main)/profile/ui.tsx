'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    User,
    MessageSquare,
    FileText,
    BookOpen,
    Edit,
    Lock,
    LogOut,
    Settings,
} from 'lucide-react'
import MyChatTab from '@/components/profile/info/my-chat-tab'
import MyPostTab from '@/components/profile/info/my-post-tab'
import MyStudiesTab from '@/components/profile/info/my-studies-tab'
import MyInfoTab from '@/components/profile/info/my-info-tab'
import { PostsResponse } from '@/types/postType'
import { StudiesResponse } from '@/types/studiesType'
import { useEffect, useState } from 'react'
import { useUpdateProfileImage } from '@/hooks/useProfile'
import { getProfileImageUrl } from '@/lib/supabase/storage'
import { ProfileResponse } from '@/types/profileType'
import { useLogout } from '@/hooks/useAuth'
import { useGetMyChatRooms } from '@/hooks/useChat'
import { useSearchParams } from 'next/navigation'
import { ChatRoom } from '@/types/chatType'
import ProfileSection from '@/components/profile/ProfileSection'
import TabSection from '@/components/profile/TabSection'

export default function UserProfileUI({
    user,
    posts,
    studies,
    chatRooms,
}: {
    user: ProfileResponse
    posts: PostsResponse
    studies: StudiesResponse
    chatRooms: ChatRoom[]
}) {
    // const {data: chatRooms} = useGetMyChatRooms();
    const searchParams = useSearchParams()
    const [currentTab, setCurrentTab] = useState(
        searchParams.get('tab') || 'info'
    )
    const myPosts = posts || []
    const myStudies = studies || []
    const currentUser = user
    const logoutMutation = useLogout()

    const getStatusColor = (status: string) => {
        switch (status) {
            case '모집중':
                return 'bg-green-500 text-white'
            case '마감':
                return 'bg-red-500 text-white'
            default:
                return 'bg-slate-500 text-white'
        }
    }
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            프론트엔드: 'bg-blue-100 text-blue-700 border-blue-200',
            백엔드: 'bg-purple-100 text-purple-700 border-purple-200',
            AI: 'bg-amber-100 text-amber-700 border-amber-200',
            모바일: 'bg-green-100 text-green-700 border-green-200',
            디자인: 'bg-pink-100 text-pink-700 border-pink-200',
        }
        return (
            colors[category] || 'bg-slate-100 text-slate-700 border-slate-200'
        )
    }
    const [profileImage, setProfileImage] = useState(
        currentUser?.avatar_url || '/placeholder.svg'
    )

    const updateProfileImage = useUpdateProfileImage()
    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setProfileImage(previewUrl)
        updateProfileImage.mutate(file)
    }
    const handleTabChange = (value: string) => {
        setCurrentTab(value)
        // 2. URL만 변경 (리렌더링 없이)
        window.history.replaceState(null, '', `/profile?tab=${value}`)
    }
    // 🧹 메모리 해제
    useEffect(() => {
        return () => {
            if (profileImage && profileImage.startsWith('blob:')) {
                URL.revokeObjectURL(profileImage)
            }
        }
    }, [profileImage])

    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <main className='flex-1'>
                {/* 프로필 헤더 */}
                <ProfileSection
                    currentUser={currentUser}
                    handleImageChange={handleImageChange}
                    myStudies={myStudies}
                    myPosts={myPosts}
                    logoutMutation={logoutMutation}
                />

                {/* 탭 컨텐츠 */}
                <TabSection
                    currentTab={currentTab}
                    handleTabChange={handleTabChange}
                    chatRooms={chatRooms}
                    myPosts={myPosts}
                    myStudies={myStudies}
                    currentUser={currentUser}
                    getStatusColor={getStatusColor}
                    getCategoryColor={getCategoryColor}
                />
            </main>
        </div>
    )
}
