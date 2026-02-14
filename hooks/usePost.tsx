"use client";

import {
  checkIsLiked,
  createPost,
  deletePost,
  getAllPosts,
  getPostDetail,
  increaseViewCount,
  toggleLike,
  updatePost,
} from "@/actions/postAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUser } from "./useUser";
import { isRedirect } from "@/utils/utils";
import { PostDetailResponse } from "@/types/postType";

export function useCreatePost(onFieldError?: (field: string, message: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
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
        queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
        queryClient.invalidateQueries({ queryKey: queryKeys.posts });
        toast.success("게시글을 생성했습니다.");
        return;
      }
      toast.error(error.message);
    },
  });
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
      if (isRedirect(error)) {
        return;
      }
      toast.error(error.message || "게시글 목록을 불러오는데 실패했습니다.");
    }
  }, [query.error]);

  return query;
}

// 조회수 증가
export function useIncreaseViewCount(postId: number) {
  return useMutation({
    mutationFn: async () => {
      return await increaseViewCount(postId);
    },
  });
}

// 좋아요 여부 확인
export function useCheckIsLiked(postId: number) {
  const { data: userData } = useUser();
  const user = userData
  
  return useQuery({
    queryKey: queryKeys.like(postId),
    queryFn: async () => {
      const result = await checkIsLiked(postId);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error?.message || "좋아요 여부 확인에 실패했습니다.");
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}


// 좋아요 토글
export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await toggleLike(postId);
    },
    onMutate: async () => {

    await queryClient.cancelQueries({ queryKey: queryKeys.like(postId) });
    await queryClient.cancelQueries({ queryKey: queryKeys.post(postId) });
  
    const previousLike = queryClient.getQueryData<boolean>(queryKeys.like(postId));
    const previousPost = queryClient.getQueryData<PostDetailResponse>(queryKeys.post(postId));
  
    // 좋아요 토글
    queryClient.setQueryData(queryKeys.like(postId), !previousLike);
    
    // 좋아요 수 업데이트
    queryClient.setQueryData(queryKeys.post(postId), (old: PostDetailResponse | undefined) => {
      if (!old) return old;
      return {
        ...old,
        likes_count: previousLike ? old.likes_count - 1 : old.likes_count + 1
      };
    });
  
    return { previousLike, previousPost };
    },
    
    onSuccess: (response) => {
      if (response?.success) {
        // 서버 데이터로 동기화
        queryClient.invalidateQueries({ queryKey: queryKeys.like(postId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
      } else {
        toast.error("좋아요 처리에 실패했습니다");
      }
    },
    
    onError: (error, variables, context) => {
      // 롤백
      if (context?.previousLike) {
        queryClient.setQueryData(queryKeys.like(postId), context.previousLike);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(queryKeys.post(postId), context.previousPost);
      }
      toast.error("좋아요 처리 중 오류가 발생했습니다");
    },
  });
}

// 게시글 삭제
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      return await deletePost(postId);
    },
    onSuccess: (response) => {
      if (!response.success) {
        // 삭제 실패
        toast.error(response.error.message);
      }
    },
    onError: (error: any) => {
      if (isRedirect(error)) {
        toast.success("게시글을 삭제했습니다");
        queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
        queryClient.invalidateQueries({ queryKey: queryKeys.posts });
        return;
      }
      toast.error(error.message || "게시글 삭제 중 오류가 발생했습니다");
    },
  });
}

export function useUpdatePost(onFieldError?: (field: string, message: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData : FormData) => {
      return await updatePost(formData);
    },
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
        queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
        queryClient.invalidateQueries({ queryKey: queryKeys.posts });
        toast.success("게시글을 수정했습니다");
        return;
      }
      toast.error(error.message || "게시글 수정 중 오류가 발생했습니다");
    },
  });
}
// 게시글 상세 조회, 서버->리액트 쿼리 캐시등록
export function usePostDetail(initialPost: PostDetailResponse) {
  return useQuery({
    queryKey: queryKeys.post(initialPost.id),
    queryFn: async () => {
      const result = await getPostDetail(initialPost.id);
      if (result.success) return result.data as PostDetailResponse;
      throw new Error(result.error?.message);
    },
    initialData: initialPost,
    staleTime: 1000 * 60 * 5,  // 5분간 refetch 안 함
  });
}