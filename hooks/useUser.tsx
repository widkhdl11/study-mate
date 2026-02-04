"use client";

import { getMyProfile, getUser } from "@/actions/profileAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { convertUser } from "@/utils/conversion/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const user = await getUser();
      if (user) {
        return convertUser(user);
      }else {
        return null;
      }
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