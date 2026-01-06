"use server";

import { StudyFormValues, studySchema } from "@/lib/zod/schemas/studySchema";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "@/types/response/action";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createStudy(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title") as string,
    mainCategory: formData.get("mainCategory") as string,
    subCategory: formData.get("subCategory") as string,
    studyCategory: Number(formData.get("studyCategory")) as number,
    mainRegion: formData.get("mainRegion") as string,
    region: Number(formData.get("region")) as number,
    maxParticipants: Number(formData.get("maxParticipants")) as number,
    description: formData.get("description") as string,
  };

  console.log("rawData : ", rawData);
  const parseResult = studySchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    console.log("검증 실패 에러: ", firstError);
    return {
      success: false,
      error: {
        message: firstError.message,
        field,
      },
    };
  }

  const { title, studyCategory, region, maxParticipants, description } =
    parseResult.data;

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const { data, error } = await supabase.from("studies").insert({
    title,
    study_category: studyCategory,
    region,
    max_participants: maxParticipants,
    description,
    creator_id: user.user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/posts", "layout");
  redirect("/posts");
}

export async function getMyStudies(): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const { data, error } = await supabase
    // .from("studies")
    // .select("*")
    // .eq("creator_id", user.user.id);
    .from("participants")
    .select("*, studies!participants_study_id_fkey(*)")
    .eq("user_id", user.user.id);
    
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, data };
}

export async function setStudyStatus(id: number, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studies")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

export async function getStudyById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

export async function getStudyDetail(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studies")
    .select(
      `
      *,
      creator:profiles!studies_creator_id_fkey (
        id,
        username,
        email,
        avatar_url
      ),
      participants!participants_study_id_fkey (
        id,
        user_id,
        username,
        user_email,
        study_id,
        role,
        status
      ),
      posts!posts_study_id_fkey (
        id,
        title,
        study_id,
        content,
        image_url,
        likes_count,
        views_count,
        created_at,
        updated_at
      )
      `
    )
    .eq("id", id)
    .single();
    console.log("getStudyDetal data : ", data);
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}
