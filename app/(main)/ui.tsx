'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BookOpen, Sparkles, Target, Users } from 'lucide-react'
import { useGetAllPosts } from '@/hooks/usePost'
import HeroSection from '@/components/main/HeroSection'
import LatestSection from '@/components/main/LatestSection'

export default function HomeUI() {
    const { data } = useGetAllPosts()
    const posts = data || []

    const getStatusColor = (status: string) => {
        switch (status) {
            case '모집중':
                return 'bg-success text-white'
            case '마감':
                return 'bg-danger text-white'
            case '수락 대기중':
                return 'bg-warning text-foreground'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            프론트엔드:
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            백엔드: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            AI: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
            모바일: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            디자인: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
        }
        return (
            colors[category] ||
            'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
        )
    }

    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <p>CI CD 배포 자동화 완료</p>
            <main className='flex-1'>
                {/* Hero Section */}
                <HeroSection />

                {/* Latest Posts Section */}
                <LatestSection 
                    posts={posts}
                    getCategoryColor={getCategoryColor}
                    getStatusColor={getStatusColor}
                />
            </main>
        </div>
    )
}
