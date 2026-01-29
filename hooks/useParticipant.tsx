"use client";

import {
  acceptParticipant,
  applyParticipant,
  checkParticipantStatus,
  getParticipant,
  rejectParticipant,
  removeParticipant,
} from "@/actions/participantAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useParticipant(studyId: number) {
  return useQuery({
    queryKey: queryKeys.participant(studyId),
    queryFn: async () => {
      return await checkParticipantStatus(studyId);
    },
    enabled: studyId > 0, // studyId가 있을 때만 실행
  });
}

// 참가 신청
export function useApplyParticipant(studyId: number) {
  const queryClient = useQueryClient(); // ← 추가!

  return useMutation({
    mutationFn: async () => {
      return await applyParticipant(studyId);
    },
    onSuccess: (response) => {
      if (response?.success) {
        // ✅ 캐시 무효화 - 참여 상태 다시 조회
        queryClient.invalidateQueries({
          queryKey: queryKeys.participant(studyId),
        });

        // ✅ 스터디 정보도 다시 조회 (current_participants 업데이트)
        queryClient.invalidateQueries({
          queryKey: queryKeys.post(studyId),
        });

        toast.success("참여 신청이 완료되었습니다!");
      } else {
        toast.error(response?.error?.message || "신청에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "참여 신청 중 오류가 발생했습니다");
    },
  });
}
export function useCheckParticipantStatus(studyId: number) {
  return useMutation({
    mutationFn: async () => {
      return await checkParticipantStatus(studyId);
    },
  });
}

// 참여자 수락
export function useAcceptParticipant(studyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: number) => {
      return await acceptParticipant(participantId);
    },
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.studyDetail(studyId),
        });
        toast.success("참여자를 수락했습니다");
      } else {
        toast.error(response?.error?.message || "수락에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "수락 중 오류가 발생했습니다");
    },
  });
}

// 참여자 거절
export function useRejectParticipant(studyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: number) => {
      return await rejectParticipant(participantId);
    },
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.studyDetail(studyId),
        });
        toast.success("참여 신청을 거절했습니다");
      } else {
        toast.error(response?.error?.message || "거절에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "거절 중 오류가 발생했습니다");
    },
  });
}

// 참여자 강퇴
export function useRemoveParticipant(studyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: number) => {
      return await removeParticipant(participantId);
    },
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.studyDetail(studyId),
        });
        toast.success("멤버를 강퇴했습니다");
      } else {
        toast.error(response?.error?.message || "강퇴에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "강퇴 중 오류가 발생했습니다");
    },
  });
}
