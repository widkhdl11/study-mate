'use client'

import { ProfileResponse } from '@/types/profileType'
import dynamic from 'next/dynamic'
import LoginDropdown from './LoginDropdown'

const NotificationDropdown = dynamic(
    () => import('./NotificationDropdown'),
    { ssr: false }
)

export default function UserMenu({ user }: { user: ProfileResponse }) {
    return (
        <>
            <NotificationDropdown user={user}/>
            <LoginDropdown user={user} />
        </>
    )
}
