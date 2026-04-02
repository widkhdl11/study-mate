'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'
import { useGetMyProfile } from '@/hooks/useUser'
import { getProfileImageUrl } from '@/lib/supabase/storage'
import {
    useAllReadNotification,
    useGetNotifications,
    useReadNotification,
} from '@/hooks/useNotification'
import { formatTimeAgo } from '@/utils/utils'
import { NotificationResponse } from '@/types/notificationType'
import { ProfileResponse } from '@/types/profileType'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const Header = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchInput, setSearchInput] = useState('')
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    useEffect(() => {
        if (pathname === '/posts') {
            setSearchInput(searchParams.get('search') ?? '')
        }
    }, [pathname, searchParams])

    // 페이지 이동 시 드롭다운 닫기
    useEffect(() => {
        setNotificationOpen(false)
        setProfileMenuOpen(false)
    }, [pathname, searchParams])

    const runSearch = () => {
        const search = searchInput.trim()
        if (search) {
            router.push(`/posts?search=${encodeURIComponent(search)}`)
        } else {
            router.push('/posts')
        }
    }

    const { data: profile } = useGetMyProfile()
    const user = profile?.data as ProfileResponse
    const logoutMutation = useLogout()
    const { data: notifications } = useGetNotifications()
    const readNotificationMutation = useReadNotification()
    const { mutate: allReadNotification } = useAllReadNotification()

    const handleCreateStudy = () => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        router.push('/studies/create')
    }

    return (
        <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    <Link
                        href='/'
                        className='flex items-center gap-2 font-bold text-xl text-foreground hover:text-accent transition-colors'>
                        <div className='w-8 h-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold'>
                            📚
                        </div>
                        Study Mate
                    </Link>

                    <nav className='hidden md:flex items-center gap-8'>
                        <Link
                            href='/posts'
                            className='text-foreground hover:text-accent transition-colors font-medium'>
                            모집글
                        </Link>
                        <button
                            onClick={handleCreateStudy}
                            className='text-foreground hover:text-accent transition-colors font-medium'>
                            스터디 만들기
                        </button>
                    </nav>

                    <div className='flex items-center gap-4'>
                        <div className='hidden lg:flex items-center gap-1 bg-muted rounded-lg px-2 py-1.5 w-72'>
                            <span className='text-muted-foreground pl-1 shrink-0'>
                                🔍
                            </span>
                            <input
                                type='search'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        runSearch()
                                    }
                                }}
                                placeholder='스터디·모집글 검색...'
                                className='bg-muted text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0 text-sm'
                                aria-label='검색어'
                            />
                            <Button
                                type='button'
                                size='sm'
                                variant='secondary'
                                className='h-8 shrink-0'
                                onClick={runSearch}>
                                검색
                            </Button>
                        </div>

                        {user ? (
                            <>
                                <DropdownMenu
                                    open={notificationOpen}
                                    onOpenChange={setNotificationOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <button className='relative p-2 text-foreground hover:bg-muted rounded-lg transition-colors'>
                                            🔔
                                            {notifications &&
                                                notifications?.filter(
                                                    (n: NotificationResponse) =>
                                                        !n.is_read
                                                ).length > 0 && (
                                                    <Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs text-white'>
                                                        <span className='text-xs text-white'>
                                                            {
                                                                notifications?.filter(
                                                                    (
                                                                        n: NotificationResponse
                                                                    ) =>
                                                                        !n.is_read
                                                                ).length
                                                            }
                                                        </span>
                                                    </Badge>
                                                )}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                        className='w-80'>
                                        <div className='flex items-center justify-between px-3 py-2 border-b border-border'>
                                            <span className='font-semibold text-sm text-foreground'>
                                                알림
                                            </span>
                                            {notifications &&
                                                notifications?.filter(
                                                    (n) => !n.is_read
                                                ).length > 0 && (
                                                    <button
                                                        className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                                                        onClick={() =>
                                                            allReadNotification()
                                                        }>
                                                        모두 읽음
                                                    </button>
                                                )}
                                        </div>
                                        <div className='max-h-80 overflow-y-auto'>
                                            {notifications &&
                                            notifications.length > 0 ? (
                                                notifications.map(
                                                    (notification) => (
                                                        <DropdownMenuItem
                                                            key={
                                                                notification.id
                                                            }
                                                            className='cursor-pointer px-3 py-3 focus:bg-muted'
                                                            asChild>
                                                            <Link
                                                                href={
                                                                    notification.reference_type ===
                                                                    'study'
                                                                        ? `/studies/${notification.reference_id}`
                                                                        : '#'
                                                                }
                                                                className='flex flex-col gap-1'
                                                                onClick={() => {
                                                                    readNotificationMutation.mutate(
                                                                        notification.id
                                                                    )
                                                                }}>
                                                                <div className='flex items-start gap-2'>
                                                                    <span className='text-base'>
                                                                        {notification.type ===
                                                                            'participant_request' &&
                                                                            '👋'}
                                                                        {notification.type ===
                                                                            'request_accepted' &&
                                                                            '✅'}
                                                                        {notification.type ===
                                                                            'request_rejected' &&
                                                                            '❌'}
                                                                        {notification.type ===
                                                                            'participant_left' &&
                                                                            '👋'}
                                                                        {notification.type ===
                                                                            'participant_kicked' &&
                                                                            '🚫'}
                                                                    </span>
                                                                    <div className='flex-1 min-w-0'>
                                                                        <div className='flex items-center gap-2'>
                                                                            <span
                                                                                className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                                                {
                                                                                    notification.title
                                                                                }
                                                                            </span>
                                                                            {!notification.is_read && (
                                                                                <span className='w-2 h-2 rounded-full bg-destructive flex-shrink-0' />
                                                                            )}
                                                                        </div>
                                                                        <p className='text-xs text-muted-foreground line-clamp-2'>
                                                                            {
                                                                                notification.content
                                                                            }
                                                                        </p>
                                                                        <span className='text-xs text-muted-foreground'>
                                                                            {formatTimeAgo(
                                                                                notification.created_at
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )
                                                )
                                            ) : (
                                                <div className='px-3 py-8 text-center text-muted-foreground text-sm'>
                                                    알림이 없습니다
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu
                                    open={profileMenuOpen}
                                    onOpenChange={setProfileMenuOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <button className='flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer'>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage
                                                    src={getProfileImageUrl(user.avatar_url)}
                                                    alt={user.username || ''}
                                                    width={32}
                                                    height={32}
                                                    fetchPriority='high'
                                                />
                                                <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                                    {user.username?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className='hidden sm:inline text-sm font-medium text-foreground'>
                                                {user.username}
                                            </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                        className='w-48'>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Link
                                                href='/profile'
                                                className='w-full'>
                                                프로필
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Link
                                                href='/profile?tab=studies'
                                                className='w-full'>
                                                내 스터디
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Link
                                                href='/profile?tab=posts'
                                                className='w-full'>
                                                내 게시글
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Link
                                                href='/profile?tab=chats'
                                                className='w-full'>
                                                내 채팅
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                !logoutMutation.isPending &&
                                                logoutMutation.mutate()
                                            }
                                            disabled={logoutMutation.isPending}>
                                            로그아웃
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <Button asChild>
                                <Link href='/auth/login'>로그인</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
