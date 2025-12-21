"use client";

import {
  createPost,
  getAllPosts,
  getMyposts,
  getPostById,
} from "@/actions/postAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useCreatePost() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await createPost(formData);
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
      console.log("useCreatePost error : ", error);
      toast.error(error.message);
    },
  });
}
export function useGetMyPosts() {
  const query = useQuery({
    queryKey: queryKeys.myPosts,
    queryFn: async () => {
      return await getMyposts();
    },
  });
  return query;
}

export function useGetPost(id: number) {
  const query = useQuery({
    queryKey: queryKeys.myPosts,
    queryFn: async () => {
      return await getPostById(id);
    },
  });

  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      const isRedirect =
        (typeof error?.message === "string" &&
          error.message === "NEXT_REDIRECT") ||
        (typeof error?.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT"));

      if (isRedirect) {
        return;
      }
      console.log("useGetPost error : ", error);
      toast.error(error.message || "게시글을 불러오는데 실패했습니다.");
    }
  }, [query.error]);
  return query;
}

export function useGetAllPosts() {
  const query = useQuery({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      return await getAllPosts();
    },
  });

  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      const isRedirect =
        (typeof error?.message === "string" &&
          error.message === "NEXT_REDIRECT") ||
        (typeof error?.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT"));

      if (isRedirect) {
        return;
      }
      console.log("useGetAllPosts error : ", error);
      toast.error(error.message || "게시글 목록을 불러오는데 실패했습니다.");
    }
  }, [query.error]);

  return query;
}
