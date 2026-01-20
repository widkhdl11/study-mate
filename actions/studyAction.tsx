"use server";

import { StudyFormValues, studySchema } from "@/lib/zod/schemas/studySchema";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "@/types/response/action";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createStudy(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title") as string,
    mainCategory: formData.get("mainCategory") as string,
    subCategory: formData.get("subCategory") as string,
    detailCategory: formData.get("detailCategory") as string,
    studyCategory: Number(formData.get("studyCategory")) as number,
    mainRegion: formData.get("mainRegion") as string,
    detailRegion: formData.get("detailRegion") as string,
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
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });
    
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, data };
  
}

export async function getCreateMyStudies(): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .eq("creator_id", user.user.id);
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
        status,
        avatar_url
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

  // participants를 id 오름차순으로 정렬
  if (data && data.participants && Array.isArray(data.participants)) {
    data.participants.sort((a: any, b: any) => a.id - b.id);
  }

  console.log("getStudyDetail data : ", data);
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

export async function deleteStudy(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studies")
    .delete()
    .eq("id", id);
  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .delete()
    .eq("study_id", id);
  if (error || participantsError) {
    return { success: false, error: { message: error?.message || participantsError?.message } };
  }
  return { success: true, data, participants };
}

export async function editStudy(id: string, data: StudyFormValues) {
  const supabase = await createClient();

  const rawData = {
    title: data.title,
    mainCategory: data.mainCategory,
    subCategory: data.subCategory,
    studyCategory: data.studyCategory,
    mainRegion: data.mainRegion,
    region: data.region,
    maxParticipants: data.maxParticipants,
    description: data.description,
  };

  const parseResult = studySchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    return { success: false, error: { message: firstError.message, field } };
  }

  const { title, studyCategory, region, maxParticipants, description } =
    parseResult.data;

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }

  const { data: studyData, error } = await supabase
    .from("studies")
    .update({
      title,
      study_category: studyCategory,
      region,
      max_participants: maxParticipants,
      description,
    })
    .eq("id", id)
    .single();
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

export async function updateStudy(id: string, formData: FormData) {
  const supabase = await createClient();
  const rawData = {
    title: formData.get("title") as string,
    mainCategory: formData.get("mainCategory") as string,
    subCategory: formData.get("subCategory") as string,
    detailCategory: formData.get("detailCategory") as string,
    studyCategory: Number(formData.get("studyCategory")) as number,
    mainRegion: formData.get("mainRegion") as string,
    detailRegion: formData.get("detailRegion") as string,
    region: Number(formData.get("region")) as number,
    maxParticipants: Number(formData.get("maxParticipants")) as number,
    description: formData.get("description") as string,
  };
  console.log("updateStudy rawData : ", rawData);

  const parseResult = studySchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    return { success: false, error: { message: firstError.message, field } };
  }

  const { title, studyCategory, region, maxParticipants, description } =
    parseResult.data;
  console.log("updateStudy parseResult : ", parseResult);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const { data: study, error: studyError } = await supabase
    .from("studies")
    .select("*")
    .eq("id", id)
    .eq("creator_id", user.user.id)
    .single();
  if (studyError) {
    return { success: false, error: { message: studyError.message } };
  }
  if (study.creator_id !== user.user.id) {
    return { success: false, error: { message: "권한이 없습니다." } };
  }
  const { data, error } = await supabase
    .from("studies")
    .update({
      title,
      study_category: studyCategory,
      region,
      max_participants: maxParticipants,
      description,
    })
    .eq("id", id)
    .single();
  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// ================ssr===============

export async function getMyStudyByIdSSR(id: string) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const { data: study } = await supabase
    .from("studies")
    .select("*")
    .eq("id", id)
    .eq("creator_id", user.user.id)
    .single();
 // 3. 없거나 권한 없으면
 if (!study) {
  notFound();
}
return study;

}


export async function getMyStudiesSSR() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase
    .from("participants")
    .select("*, studies!participants_study_id_fkey(*)")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    notFound();
  }
  return data;
}