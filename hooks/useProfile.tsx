'use client'

import { updateProfileImage } from "@/actions/userAction"
import { useMutation } from "@tanstack/react-query"


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