"use client";

import {
  checkIsLiked,
  createPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPostById,
  increaseViewCount,
  toggleLike,
  updatePost,
} from "@/actions/postAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useUser } from "./useUser";
import { getUser } from "@/actions/profileAction";

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
      return await getMyPosts();
    },
  });
  return query;
}

// 게시글 조회(쿠키사용 조회수 중복증가 방지)
// export function useGetPost(id: number) {
//   const hasIncrementedRef = useRef(false);  // 중복 방지
  
//   const query = useQuery({
//     queryKey: queryKeys.post(id),  // ← 수정: myPosts → post(id)
//     queryFn: async () => {
//       return await getPostById(id);
//     },
//   });

//   // ✅ 조회수 증가
//   useEffect(() => {
//     // 이미 증가시켰으면 스킵
//     if (hasIncrementedRef.current) return;
    
//     // 쿠키로 24시간 중복 방지
//     const viewKey = `post_view_${id}`;
//     const hasViewed = Cookies.get(viewKey);
    
//     if (!hasViewed && query.isSuccess) {
//       // 조회수 증가 (비동기)
//       increaseViewCount(id).catch(console.error);
      
//       // 24시간 동안 중복 방지
//       Cookies.set(viewKey, '1', { expires: 1 });
      
//       // ref로 중복 방지
//       hasIncrementedRef.current = true;
//     }
//   }, [id, query.isSuccess]);

//   // 에러 처리
//   useEffect(() => {
//     if (query.error) {
//       const error = query.error as any;
//       const isRedirect =
//         (typeof error?.message === "string" &&
//           error.message === "NEXT_REDIRECT") ||
//         (typeof error?.digest === "string" &&
//           error.digest.startsWith("NEXT_REDIRECT"));

//       if (isRedirect) {
//         return;
//       }
//       console.log("useGetPost error : ", error);
//       toast.error(error.message || "게시글을 불러오는데 실패했습니다.");
//     }
//   }, [query.error]);
  
//   return query;
// }

// 게시글 조회 (리렌더링시 조회수 증가만 방지)
export function useGetPost(id: number) {
  const hasIncrementedRef = useRef(false);  // 컴포넌트 내 중복 방지만
  
  const query = useQuery({
    queryKey: queryKeys.post(id),
    queryFn: async () => {
      return await getPostById(id);
    },
  });

  // ✅ 조회수 증가 (간단 버전)
  useEffect(() => {
    if (!hasIncrementedRef.current && query.isSuccess) {
      increaseViewCount(id).catch(console.error);
      hasIncrementedRef.current = true;
    }
  }, [id, query.isSuccess]);

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
      return await checkIsLiked(postId);
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
    // ✅ 낙관적 업데이트
    onMutate: async () => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.like(postId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.post(postId) });
      
      // 이전 데이터 저장
      const previousLike = queryClient.getQueryData<{ data: { liked: boolean } }>(queryKeys.like(postId));
      const previousPost = queryClient.getQueryData(queryKeys.post(postId));
      
      // 낙관적 업데이트
      queryClient.setQueryData(queryKeys.like(postId), (old: any) => ({
        ...old,
        data: !old?.data  // 토글
      }));
      
      queryClient.setQueryData(queryKeys.post(postId), (old: any) => {
        if (!old?.data) return old;
        
        const currentLiked = previousLike?.data || false;
        return {
          ...old,
          data: {
            ...old.data,
            likes_count: currentLiked 
              ? old.data.likes_count - 1  // 취소
              : old.data.likes_count + 1  // 추가
          }
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
        toast.error(response?.error?.message || "좋아요 처리 실패");
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
      if (response?.success) {
        toast.success("게시글을 삭제했습니다");
        queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
        queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      } else {
        toast.error(response?.error?.message || "게시글 삭제에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "게시글 삭제 중 오류가 발생했습니다");
    },
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({ postId, formData }: { postId: number, formData: FormData }) => {
      return await updatePost(postId, formData);
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success("게시글을 수정했습니다");
     
      } else {
        toast.error(response?.error?.message || "게시글 수정에 실패했습니다");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "게시글 수정 중 오류가 발생했습니다");
    },
  });
}
