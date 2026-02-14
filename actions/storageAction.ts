'use server';

import { createClient } from "@/lib/supabase/server";



export async function deleteImage(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("post-images").remove([path]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}