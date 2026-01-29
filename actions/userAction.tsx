"use server";

import profileEditSchema from "@/lib/zod/schemas/profileSchema";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return null;
    // throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getMyProfile() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateProfileImage(image: File) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;

  const fileName = `${Date.now()}-${id}.${image.type.split("/")[1]}`;
  const storage = await supabase.storage.from("profile-images").upload(fileName, image);
  if (storage.error) {
    throw new Error(storage.error.message);
  }

  console.log("storage.data? : ", storage.data);
  const { data, error } = await supabase.from("profiles").update({ avatar_url: storage.data?.path }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateMyProfile(formData: FormData) {
  const supabase = await createClient();


  const rawData = {
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
    birthDate: formData.get("birthDate") as string,
    gender: formData.get("gender") as string,
  }
  const parseResult = profileEditSchema.safeParse(rawData);
  if (!parseResult.success) {
    throw new Error(parseResult.error.message);
  }

  const { username, bio, birthDate, gender } = parseResult.data;


  // birthDate를 date 타입(YYYY-MM-DD에서 Date)으로 변환
  const birthDateObj = new Date(birthDate);
  if (isNaN(birthDateObj.getTime())) {
    throw new Error("유효하지 않은 생년월일입니다.");
  }
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }
  const id = user.user.id;
  const { data, error } = await supabase.from("profiles").update({
    username: username,
    bio: bio,
    birth_date: birthDateObj,
    gender: gender,
  }).eq("id", id);


  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// =================ssr ======================

export async function getMyProfileSSR() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
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
  return data;
}