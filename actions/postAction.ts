"use server";

import { postSchema, updatePostSchema, PostFormValues, UpdatePostFormValues } from "@/lib/zod/schemas/postSchema";
import { ActionResponse } from "@/types/actionType";
import { PostDetailResponse, PostsResponse } from "@/types/postType";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { validateWithZod } from "@/utils/utils";
import { CustomUserAuth } from "@/utils/auth";

// 게시글 상세 조회
export async function getPostDetail(id: number): Promise<ActionResponse<PostDetailResponse>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:author_id (
        id,
        email,
        username,
        avatar_url
      ),
      study:study_id (
        id,
        title,
        study_category,
        region,
        status,
        max_participants,
        current_participants,
        description,
        creator:creator_id (
          id,
          username,
          email,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("게시글을 찾을 수 없습니다");
  }

  return { success: true, data: data as unknown as PostDetailResponse };
}
// 게시글 생성
export async function createPost(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    studyId: Number(formData.get("studyId")) as number,
    images: formData.getAll("images") as File[],
  };
  const parseResult = validateWithZod(postSchema, rawData);
  if (!parseResult.success) {
    return parseResult;
  }

  const { title, content, studyId, images } = parseResult.data as PostFormValues;

  const { user } = await CustomUserAuth(supabase);

  // Storage에 업로드 → 메타데이터 배열로 변환
  const imageData: { id: string; url: string; originalName: string; size: number }[] = [];
  
  for (const image of images || []) {
    if (image instanceof File && image.size > 0) {
      const uuid = crypto.randomUUID();
      const extension = image.name.split('.').pop() || '';
      const fileName = `${uuid}.${extension}`;
      
      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);

      if (data) {
        imageData.push({
          id: uuid,
          url: data.path,
          originalName: image.name,
          size: image.size,
        });
      } else {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      study_id: studyId,
      image_url: imageData, 
      author_id: user.id,
    })
    .select()
    .single();
    
  if (error) {
    throw new Error("게시글 생성에 실패했습니다.");
  }
  
  revalidatePath("/posts", "layout");
  redirect(`/posts/${data.id}`);
}

// 내 게시글들 가져오기
export async function getMyPosts(): Promise<ActionResponse<PostsResponse[]>> {
  const supabase = await createClient();
  const { user } = await CustomUserAuth(supabase);

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      image_url,
      author_id,
      likes_count,
      views_count,
      created_at,
      study:study_id (
        id,
        title,
        study_category,
        region,
        status,
        max_participants,
        current_participants,
        description,
        creator:creator_id (
          id,
          username,
          email,
          avatar_url
        )
      )`)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("내 게시글들 가져오기에 실패했습니다.");
  }
  return { success: true, data: data as unknown as PostsResponse[] };
}


// 모든 게시글 가져오기
export async function getAllPosts(): Promise<
  ActionResponse<PostsResponse[]> | never
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      image_url,
      author_id,
      likes_count,
      views_count,
      created_at,
      study:study_id (
        id,
        title,
        description,
        study_category,
        region,
        max_participants,
        current_participants,
        status
      ),
      author:author_id (
        id,
        username,
        email,
        avatar_url
      )
    `
    )
    .in("study.status", ["recruiting", "completed"])
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return { success: true, data: data as unknown as PostsResponse[] };
}

// 조회수 증가

export async function increaseViewCount(postId: number): Promise<ActionResponse> {
  const supabase = await createClient();
  
  const { error } = await supabase.rpc('increment_post_views', {
    post_id: postId
  });
  
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

// 좋아요 토글 (RPC 사용)
export async function toggleLike(postId: number): Promise<ActionResponse<{ liked: boolean, newCount: number }>> {
  const supabase = await createClient();
  const { user } = await CustomUserAuth(supabase);
  // RPC 함수 호출
  const { data, error } = await supabase.rpc('toggle_post_like', {
    p_post_id: postId,
    p_user_id: user.id
  });
  
  if (error) {
    throw new Error("좋아요 처리에 실패했습니다.");
  }
  
  // data[0] = { liked: true/false, new_count: 10 }

  return { 
    success: true,
    data: {
      liked: data[0]?.liked,
      newCount: data[0]?.new_count
    }
  };
}

// 좋아요 여부 확인
export async function checkIsLiked(postId: number): Promise<ActionResponse<boolean>> {
  const supabase = await createClient();
  const { user } = await CustomUserAuth(supabase);

  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  
  if (error) {
    throw new Error("좋아요 여부 확인에 실패했습니다.");
  }

  return { success: true, data: !!data };
}

// 게시글 삭제
export async function deletePost(postId: number): Promise<ActionResponse> {
  const supabase = await createClient();


  const { user } = await CustomUserAuth(supabase);

  const { data, error } = await supabase.from("posts")
  .delete()
  .eq("id", postId)
  .eq("author_id", user.id)
  .select();
  
  if (error || !data || data.length === 0) {
  throw new Error("게시글을 찾을 수 없거나 권한이 없습니다");
  }
  revalidatePath("/posts", "layout");
  redirect(`/posts`);
}

// 게시글 수정
export async function updatePost(formData: FormData): Promise<ActionResponse<PostsResponse>> {
  const supabase = await createClient();

  const { user } = await CustomUserAuth(supabase);

  const rawData = {
    id: Number(formData.get("id")) as number,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    studyId: Number(formData.get("studyId")) as number,
    images: formData.getAll("images") as File[],
  };
  const parseResult = validateWithZod(updatePostSchema, rawData);
  if (!parseResult.success) {
    return parseResult;
  }
  const { id, title, content, studyId, images } = parseResult.data as UpdatePostFormValues;
  const { data: post, error: postError } = await supabase
  .from("posts")
  .select("*")
  .eq("id", id)
  .eq("author_id", user.id)
  .single();
  
  if (postError) {
    throw new Error("게시글 수정에 실패했습니다.");
  }
  const imageUrls: string[] = [];

  for (const image of images || []) {
    if (image instanceof File && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);
      if (data) {
        imageUrls.push(data.path);
      } else {
        throw new Error(error?.message ?? "이미지 업로드에 실패했습니다.");
      }
    }
  }
  const { data, error } = await supabase.from("posts").update({
    title,
    content,
    study_id: studyId,
    image_url: imageUrls.map((path) => path.split("/").pop() ?? ""),
  }).eq("id", id)
  .select()
  .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  revalidatePath("/posts", "layout");
  redirect(`/posts/${id}`);
}
// =================ssr ======================
export async function getMyPostsSSR(): Promise<PostsResponse[]> {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase
  .from("posts")
  .select(`
    id,
    title,
    content,
    image_url,
    author_id,
    likes_count,
    views_count,
    created_at,
    study:study_id (
      id,
      title,
      study_category,
      region,
      status,
      max_participants,
      current_participants,
      description,
      creator:creator_id (
        id,
        username,
        email,
        avatar_url
      )
    )`)
  .eq("author_id", id)
  .order("created_at", { ascending: false });
  if (error) {
    notFound();
  }
  return data as unknown as PostsResponse[];
}


// 게시글 상세 가져오기
export async function getPostDetailSSR(id: number): Promise<PostDetailResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:author_id (
        id,
        email,
        username,
        avatar_url
      ),
      study:study_id (
        id,
        title,
        study_category,
        region,
        status,
        max_participants,
        current_participants,
        description,
        creator:creator_id (
          id,
          username,
          email,
          avatar_url
        )
      )
    `
    )
    .eq("id", id)
    .single();
  if (error) {
    notFound();
  }
  return data as unknown as PostDetailResponse;
}