"use server";

import { createClient } from "@/utils/supabase/server";

export async function getParticipant(studyId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("study_id", studyId)
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, data };
}

export async function applyParticipant(studyId: number) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  if (!userId) {
    return { success: false, error: { message: "User not found" } };
  }

  const { data, error } = await supabase
    .from("participants")
    .insert({ study_id: studyId, user_id: userId, status: "pending" });

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

export async function checkParticipantStatus(studyId: number) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  if (!userId) {
    return { success: false, error: { message: "User not found" } };
  }

  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("study_id", studyId)
    .eq("user_id", userId)
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, data };
}
