import { deleteImage } from "@/actions/storageAction";
import { useMutation } from "@tanstack/react-query";


export function useDeleteImage() {
  return useMutation({
    mutationFn: async (path: string) => {
      return await deleteImage(path);
    },
    onSuccess: (data) => {
    },
    onError: (error: Error) => {
    }
  });
}