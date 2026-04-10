'use client'

import { getMyProfile, getUser } from '@/actions/profileAction'
import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { ProfileResponse } from '@/types/profileType'
import { convertUser } from '@/utils/conversion/user'
import { User, UserResponse } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
    return useQuery({
        queryKey: queryKeys.user,
        queryFn: async () => {
            const result = await getUser()
            if (result?.success && result.data) {
                return convertUser(result.data as User) // user만 전달
            }
            return null
        },
    })
}

export function useGetMyProfile({myProfile}: {myProfile: ProfileResponse}) {
    const { data: user } = useUser()
    return useQuery({
        queryKey: queryKeys.myProfile,
        queryFn: async () => {
            const profile = await getMyProfile()
            if (profile?.success && profile.data) {
                return profile
            }
            return myProfile
        },
        initialData: myProfile,
        throwOnError: true,
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5분
    })
}
