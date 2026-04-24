'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'
import { useGetMyProfile } from '@/hooks/useUser'
import { ProfileResponse } from '@/types/profileType'
import { NotificationDropdown } from './header/NotificationDropdown'
import { LoginDropdown } from './header/LoginDropdown'
    
export const Header = ({ myProfile }: { myProfile: ProfileResponse | null }) => {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        if (pathname === '/posts') {
            setSearchInput(searchParams.get('search') ?? '')
        }
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
    const user = profile ?? myProfile

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
                                <NotificationDropdown
                                />

                                <LoginDropdown
                                    user={user}
                                />
                              
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
