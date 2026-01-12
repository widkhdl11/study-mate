"use server";

import { createClient } from "@/utils/supabase/server";

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