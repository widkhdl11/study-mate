'use client'

import { updateMyProfile, updateProfileImage } from "@/actions/userAction"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export function useUpdateProfileImage() {
  return useMutation({
    mutationFn: async (image: File) => {
      return await updateProfileImage(image)
    },
    onSuccess: (data) => {
      console.log("data: ", data);
    },
    onError: (error: Error) => {
      console.log("error: ", error);
    }
  })
}


export function useUpdateProfile() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await updateMyProfile(formData);
    },
    onSuccess: (data) => {
      toast.success("프로필을 수정했습니다");
      router.refresh();
      router.push("/profile");
    },
    onError: (error: Error) => {
      console.log("error: ", error);
      if (error.message === "NEXT_REDIRECT") {
        return;
      }
      toast.error(error.message || "프로필 수정에 실패했습니다");
    }
  })
}

