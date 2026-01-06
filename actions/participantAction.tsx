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

// export async function applyParticipant(studyId: number) {
//   const supabase = await createClient();

//   const { data: user, error: userError } = await supabase.auth.getUser();
//   const userId = user?.user?.id;
//   if (!userId) {
//     return { success: false, error: { message: "User not found" } };
//   }

//   const { data: userData, error: userDataError } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", userId)
//     .single();
//   if (userDataError) {
//     return { success: false, error: { message: userDataError.message } };
//   }

//   const { data, error } = await supabase
//     .from("participants")
//     .insert({ study_id: studyId, user_id: userId, status: "pending", username: userData?.username, user_email: userData?.email });

//   if (error) {
//     return { success: false, error: { message: error.message } };
//   }
//   return { success: true, data };
// }

export async function applyParticipant(studyId: number) {
  const supabase = await createClient();
  
  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  
  if (!userId) {
    return { success: false, error: { message: "로그인이 필요합니다" } };
  }
  
  // ✅ 중복 신청 체크
  const { data: existing } = await supabase
    .from("participants")
    .select("status")
    .eq("study_id", studyId)
    .eq("user_id", userId)
    .single();
  
  if (existing) {
    if (existing.status === "pending") {
      return { success: false, error: { message: "이미 신청했습니다" } };
    }
    if (existing.status === "accepted") {
      return { success: false, error: { message: "이미 참여중입니다" } };
    }
    // rejected면 재신청 허용
  }
  
  // 신청
  const { data, error } = await supabase
    .from("participants")
    .insert({ 
      study_id: studyId, 
      user_id: userId, 
      status: "pending" 
    })
    .select()
    .single();

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
  console.log("checkParticipantStatus data : ", data);
  console.log("checkParticipantStatus data.username : ", data?.username);
  console.log("checkParticipantStatus data.user_email : ", data?.user_email);
  return { success: true, data };
}

export async function studyAddParticipant(studyId: string) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  const { data: userData, error: userDataError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (!userId) {
    return { success: false, error: { message: "User not found" } };
  }

  const { data, error } = await supabase
    .from("participants")
    .insert({ study_id: studyId, user_id: userId, status: "accepted", role: "host", username: userData?.username, user_email: userData?.email });

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// 참여자 수락
export async function acceptParticipant(participantId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("participants")
    .update({ status: "accepted" })
    .eq("id", participantId)
    .select()
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// 참여자 거절
export async function rejectParticipant(participantId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("participants")
    .update({ status: "rejected" })
    .eq("id", participantId)
    .select()
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// 참여자 강퇴 (삭제)
export async function removeParticipant(participantId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId);

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data: null };
}