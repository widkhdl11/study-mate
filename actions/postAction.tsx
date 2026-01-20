"use server";

import postSchema from "@/lib/zod/schemas/postSchema";
import { ActionResponse } from "@/types/response/action";
import { PostsResponse } from "@/types/response/post";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
export async function createPost(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();
  console.log("createPost formData : ", formData);

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    studyId: Number(formData.get("studyId")) as number,
    images: formData.getAll("images") as File[],
  };
  const parseResult = postSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    throw new Error(JSON.stringify({ message: firstError.message, field }));
  }

  const { title, content, studyId, images } = parseResult.data;

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const author_id = user.user.id;

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
        throw new Error(error?.message ?? "이미지 업로드에 실패했습니다.");
      }
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      study_id: studyId,
      image_url: imageData, // jsonb 타입으로 저장
      author_id,
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath("/posts", "layout");
  redirect(`/posts/${data.id}`);
}
export async function getMyPosts() {
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
    throw new Error(error.message);
  }
  return { success: true, data };
}

export async function getPostById(id: number) {
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
  // .from("posts")
  // .select("*")
  // .eq("id", id)
  // .single();
  if (error) {
    throw new Error(error.message);
  }
  return { success: true, data };
}

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

export async function increaseViewCount(postId: number) {
  const supabase = await createClient();
  
  const { error } = await supabase.rpc('increment_post_views', {
    post_id: postId
  });
  
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

// ✅ 좋아요 토글 (RPC 사용)
export async function toggleLike(postId: number) {
  const supabase = await createClient();
  
  // 로그인 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { 
      success: false, 
      error: { message: "로그인이 필요합니다" } 
    };
  }
  
  // RPC 함수 호출
  const { data, error } = await supabase.rpc('toggle_post_like', {
    p_post_id: postId,
    p_user_id: user.id
  });
  
  if (error) {
    console.error("toggleLike error:", error);
    return { 
      success: false, 
      error: { message: "좋아요 처리에 실패했습니다" } 
    };
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

export async function checkIsLiked(postId: number) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const userId = user.user.id;
    // 좋아요 확인
    const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle(); 
  
  if (error) {
    return { success: false, data: false };
  }
  
  return { success: true, data: !!data };
}

export async function deletePost(postId: number) {
  const supabase = await createClient();


  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const userId = user.user.id;
  const { data: post, error: postError } = await supabase.from("posts").select("*").eq("id", postId).eq("author_id", userId).single();
  
  if (postError) {
    return { success: false, error: { message: postError.message } };
  }
  const { data, error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/posts", "layout");
  return { success: true, data };
}

export async function updatePost(postId: number, formData: FormData) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const userId = user.user.id;
  const { data: post, error: postError } = await supabase.from("posts").select("*").eq("id", postId).eq("author_id", userId).single();
  if (postError) {
    throw new Error(postError.message);
  }
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    studyId: Number(formData.get("studyId")) as number,
    images: formData.getAll("images") as File[],
  };
  const parseResult = postSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    throw new Error(JSON.stringify({ message: firstError.message, field }));
  }
  const { title, content, studyId, images } = parseResult.data;
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
  }).eq("id", postId);

  
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}
// =================ssr ======================
export async function getMyPostsSSR() {
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
  return data;
}