"use client";

import { getUser } from "@/actions/userAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const user = await getUser();
      return user;
    },
  });
}
