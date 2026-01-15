"use client";

import { studyAddParticipant } from "@/actions/participantAction";
import {
  createStudy,
  deleteStudy,
  getCreateMyStudies,
  getMyStudies,
  getStudyById,
  getStudyDetail,
  setStudyStatus,
  updateStudy,
} from "@/actions/studyAction";
import { queryClient } from "@/config/ReactQueryClientProvider";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { StudyFormValues } from "@/lib/zod/schemas/studySchema";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateStudy() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const create_study_response = await createStudy(formData);
      // const add_participant_response = await studyAddParticipant(formData.get("id") as string);
      // console.log("add_participant_response 실행");
      // if (!add_participant_response || !add_participant_response.success) {
      //   console.log("add_participant_response 실패");
      //   return { success: false, error: { message: add_participant_response.error?.message } };
      // }
      // console.log("add_participant_response 성공");
      return create_study_response;
    },
    onSuccess: (response) => {
      console.log("response : ", response);
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

export function useGetCreateMyStudies() {
  return useQuery({
    queryKey: queryKeys.createMyStudies,
    queryFn: async () => {
      const response = await getCreateMyStudies();
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

// 스터디 삭제
export function useDeleteStudy({ id }: { id: string }) {
  return useMutation({
    mutationFn: async () => {
      return await deleteStudy(id);
    },
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.studyDetail(Number(id)),
        });
        toast.success("스터디를 삭제했습니다");
      } else {
        toast.error(response?.error?.message || "스터디 삭제에 실패했습니다");
        return;
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}


export function useUpdateStudy({ id }: { id: string }) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await updateStudy(id, formData);
    },
    onSuccess: (response) => {
      if (!response || response.success) {
        return;
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}