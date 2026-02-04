"use client";

// import { studyAddParticipant } from "@/actions/participantAction";
import {
  createStudy,
  deleteStudy,
  getMyCreatedStudies,
  getMyStudies,
  getStudyDetail,
  updateStudy,
} from "@/actions/studyAction";
import { queryClient } from "@/config/ReactQueryClientProvider";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { StudyFormValues } from "@/lib/zod/schemas/studySchema";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudiesResponse } from "@/types/response/studies";
import { isRedirect } from "@/utils/utils";

export function useCreateStudy(onFieldError?: (field: string, message: string) => void) {
  return useMutation({
    mutationFn: createStudy,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.error.message);
         if (response.error.field && onFieldError) {
          onFieldError(response.error.field, response.error.message);
        }
      }
    },
    onError: (error: any) => {
      if (isRedirect(error)) {
        queryClient.invalidateQueries({ queryKey: queryKeys.myStudies });
        queryClient.invalidateQueries({ queryKey: queryKeys.myCreatedStudies });
        toast.success("스터디를 생성했습니다.");
        return;
      } else {
        toast.error(error.message);
      }
    },
  });
}

export function useGetMyStudies() {
  return useQuery({
    queryKey: queryKeys.myStudies,
    queryFn: async () => {
      const response = await getMyStudies();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    throwOnError: true,
  });
}

export function useGetMyCreatedStudies() {
  return useQuery({
    queryKey: queryKeys.myCreatedStudies,
    queryFn: async () => {
      const response = await getMyCreatedStudies();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    throwOnError: true,
  });
}
// export function useSetStudyStatus({
//   id,
//   status,
// }: {
//   id: number;
//   status: string;
// }) {
//   return useMutation({
//     mutationFn: async () => {
//       return await setStudyStatus(id, status);
//     },
//     onSuccess: (response) => {
//       if (!response || !response.success) {
//         return;
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.message);
//     },
//   });
// }

// export function useGetStudy({ id }: { id: string }) {
//   return useQuery({
//     queryKey: queryKeys.study(Number(id)),
//     queryFn: async () => {
//       return await getStudyById(id);
//     },
//   });
// }

export function useGetStudyDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.studyDetail(id),
    queryFn: async () => {
      const response = await getStudyDetail(id);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data as StudiesResponse;
    },
    throwOnError: true,
  });
}
// 스터디 삭제
export function useDeleteStudy({ id }: { id: string }) {
  return useMutation({
    mutationFn: async () => {
      return await deleteStudy(id);
    },
    onError: (error: any) => {
      if (isRedirect(error)) {
        queryClient.invalidateQueries({ queryKey: queryKeys.myCreatedStudies });
        toast.success("스터디를 삭제했습니다.");
        return;
      } else {
        toast.error(error.message);
      }
    },
  });
}


export function useUpdateStudy(onFieldError?: (field: string, message: string) => void) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await updateStudy(formData);
    },
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.error?.message || "스터디 수정에 실패했습니다.");
        if (response.error?.field && onFieldError) {
          onFieldError(response.error.field, response.error.message);
        }
        return;
      }
    },
    onError: (error: any) => {
      if (isRedirect(error)) {
        queryClient.invalidateQueries({ queryKey: queryKeys.myCreatedStudies });
        toast.success("스터디를 수정했습니다.");
        return;
      } else {
        toast.error(error.message);
      }
    },
  });
}
