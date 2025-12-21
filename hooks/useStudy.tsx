"use client";

import {
  createStudy,
  getMyStudies,
  getStudyById,
  setStudyStatus,
} from "@/actions/studyAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { StudyFormValues } from "@/lib/zod/schemas/studySchema";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateStudy() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await createStudy(formData);
    },
    onSuccess: (response) => {
      if (!response || response.success) {
        return;
      }
    },
    onError: (error: any) => {
      const isRedirect =
        (typeof error?.message === "string" &&
          error.message === "NEXT_REDIRECT") ||
        (typeof error?.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT"));

      if (isRedirect) {
        return;
      }
      toast.error(error.message);
    },
  });
}

export function useGetMyStudies() {
  return useQuery({
    queryKey: queryKeys.myStudies,
    queryFn: async () => {
      const response = await getMyStudies();
      return response;
    },
  });
}

export function useSetStudyStatus({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return useMutation({
    mutationFn: async () => {
      return await setStudyStatus(id, status);
    },
    onSuccess: (response) => {
      if (!response || !response.success) {
        return;
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useGetStudy({ id }: { id: string }) {
  return useQuery({
    queryKey: queryKeys.study(Number(id)),
    queryFn: async () => {
      return await getStudyById(id);
    },
  });
}

export function useGetStudyDetail({ id }: { id: string }) {
  return useQuery({
    queryKey: queryKeys.studyDetail(Number(id)),
    queryFn: async () => {
      return await getStudyDetail(id);
    },
  });
}
