"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, signup, logout } from "@/actions/authAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";

/**
 * 로그인 훅
 */

export function useLogin() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await login(formData);
    },
    onSuccess: (response) => {
      // redirect가 발생하면 여기 도달하지 않음
      // 하지만 타입 안정성을 위해 체크
      if (response && "success" in response && !response.success) {
        toast.error(response.error.message);
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
      toast.error(error?.message ?? "로그인 중 오류가 발생했습니다");
    },
  });
}

/**
 * 회원가입 훅
 */
export function useSignup() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await signup(formData);
    },

    onSuccess: (response) => {
      // redirect가 발생하면 여기 도달하지 않음
      if (response && "success" in response && !response.success) {
        toast.error(response.error.message);
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
      // toast.error(
      //   JSON.parse(error.message).message ?? "로그인 중 오류가 발생했습니다"
      // );
    },
  });
}

/**
 * 로그아웃 훅
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: (response) => {
      console.log("response: ", response);
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      // redirect가 발생하면 여기 도달하지 않음
      if (response && "success" in response) {
        if (response.success) {
          toast.success("로그아웃되었습니다");
        } else {
          toast.error(response.error.message);
        }
      }
    },
    onError: (error: Error) => {
      toast.error("로그아웃 중 오류가 발생했습니다");
      console.error("Logout error:", error);
    },
  });
}
