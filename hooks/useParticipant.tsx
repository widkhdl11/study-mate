"use client";

import {
  applyParticipant,
  checkParticipantStatus,
  getParticipant,
} from "@/actions/participantAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useParticipant(studyId: number) {
  return useQuery({
    queryKey: queryKeys.participant(studyId),
    queryFn: async () => {
      return await getParticipant(studyId);
    },
  });
}

export function useApplyParticipant(studyId: number) {
  return useMutation({
    mutationFn: async () => {
      return await applyParticipant(studyId);
    },
    onSuccess: (response) => {
      if (!response || response.success) {
        return response.data;
      }
    },
    onError: (error: any) => {
      console.log("useApplyParticipant error : ", error);
      toast.error(error.message);
    },
  });
}

export function useCheckParticipantStatus(studyId: number) {
  return useMutation({
    mutationFn: async () => {
      console.log("checkParticipantStatus studyId : ", studyId);
      return await checkParticipantStatus(studyId);
    },
  });
}
