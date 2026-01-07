"use client";

import { getMyProfile, getUser } from "@/actions/userAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { convertUser } from "@/types/convertion/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const user = await getUser();
      return convertUser(user);
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