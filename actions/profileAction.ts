"use server";

import profileEditSchema, { ProfileEditFormValues } from "@/lib/zod/schemas/profileSchema";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileResponse } from "@/types/profileType";
import { CustomUserAuth } from "@/utils/auth";
import { ActionResponse } from "@/types/actionType";
import { validateWithZod } from "@/utils/utils";
import { User, UserResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getUser(): Promise<ActionResponse<User> | null> {

  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return null;
  }
  return { success: true, data: user.user };
}

export async function getMyProfile(): Promise<ActionResponse<ProfileResponse>> {
  const supabase = await createClient();
  const { user } = await CustomUserAuth(supabase);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  return { success: true, data: data as unknown as ProfileResponse };
}

export async function updateProfileImage(image: File): Promise<ActionResponse<ProfileResponse>> {
  const supabase = await createClient();
  const { user } = await CustomUserAuth(supabase);
  const fileName = `${Date.now()}-${user.id}.${image.type.split("/")[1]}`;
  const storage = await supabase.storage.from("profile-images").upload(fileName, image);
  if (storage.error || !storage.data) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }
  const { data, error } = await supabase
  .from("profiles")
  .update({ avatar_url: storage.data?.path })
  .eq("id", user.id)
  .select()
  .single();

  if (error || !data) {
    throw new Error("이미지 업데이트에 실패했습니다.");
  }
  return { success: true, data: data as unknown as ProfileResponse };
}

export async function updateMyProfile(formData: FormData): Promise<ActionResponse<ProfileResponse>> {
  const supabase = await createClient();
  
  const { user } = await CustomUserAuth(supabase);
  const rawData = {
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
    birthDate: formData.get("birthDate") as string,
    gender: formData.get("gender") as string,
  }

  const parseResult = validateWithZod(profileEditSchema, rawData);
  if (!parseResult.success) {
    return parseResult;
  }
  const { username, bio, birthDate, gender } = parseResult.data as ProfileEditFormValues;

  // birthDate를 date 타입(YYYY-MM-DD에서 Date)으로 변환
  const birthDateObj = new Date(birthDate);
  if (isNaN(birthDateObj.getTime())) {
    throw new Error("유효하지 않은 생년월일입니다.");
  }
  const { data, error } = await supabase.from("profiles").update({
    username: username,
    bio: bio,
    birth_date: birthDateObj,
    gender: gender,
  }).eq("id", user.id);


  if (error) {
    throw new Error("사용자 정보 수정에 실패했습니다.");
  }

  // 안넣어도 되긴함
  revalidatePath("/profile", "layout");
  return { success: true, data: data as unknown as ProfileResponse };
}

// =================ssr ======================

export async function getMyProfileSSR(): Promise<ProfileResponse | null> {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return null;
  }
  const id = user.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    notFound();
  }
  return data as unknown as ProfileResponse;
}