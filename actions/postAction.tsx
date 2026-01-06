"use server";

import postSchema from "@/lib/zod/schemas/postSchema";
import { ActionResponse } from "@/types/response/action";
import { PostsResponse } from "@/types/response/post";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  console.log("createPost rawData : ", rawData);
  const parseResult = postSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    throw new Error(JSON.stringify({ message: firstError.message, field }));
  }

  const { title, content, studyId, images } = parseResult.data;

  const { data: user, error: userError } = await supabase.auth.getUser();
  // Storage에 업로드 → URL 배열로 변환
  const imageUrls: string[] = [];
  for (const image of images) {
    if (image instanceof File && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);

      if (data) {
        imageUrls.push(data.path); // 경로만 저장
      } else {
        throw new Error(error?.message ?? "이미지 업로드에 실패했습니다.");
      }
    }
  }

  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const author_id = user.user.id;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      study_id: studyId,
      image_url: imageUrls.map((path) => path.split("/").pop() ?? ""),
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
export async function getMyposts() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
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
  console.log("getPostById data : ", data);
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
