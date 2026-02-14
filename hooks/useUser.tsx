"use client";

import { getMyProfile, getUser } from "@/actions/profileAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { convertUser } from "@/utils/conversion/user";
import { User, UserResponse } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const result = await getUser();
      if (result?.success && result.data) {
        return convertUser(result.data as User);  // user만 전달
      }
      return null;
    },
  });
}

export function useGetMyProfile() {
  return useQuery({
    queryKey: queryKeys.myProfile,
    queryFn: async () => {
      const profile = await getMyProfile();
      return profile;
    },
  });
}