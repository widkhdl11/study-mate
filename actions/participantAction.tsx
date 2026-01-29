"use server";

import { createClient } from "@/utils/supabase/server";
import { addNotification } from "./notificationActions";

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
// actions/participantAction.ts

export async function applyParticipant(studyId: number) {
  const supabase = await createClient();
  
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    return { success: false, error: { message: "로그인이 필요합니다" } };
  }
  
  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  if (userProfileError) {
    return { success: false, error: { message: userProfileError.message } };
  }

  // ✅ 스터디 정보 조회 (스터디장 ID, 제목)
  const { data: study, error: studyError } = await supabase
    .from("studies")
    .select("creator_id, title")
    .eq("id", studyId)
    .single();

  if (studyError || !study) {
    return { success: false, error: { message: "스터디를 찾을 수 없습니다" } };
  }

  // ✅ 본인 스터디에 신청 방지
  if (study.creator_id === userId) {
    return { success: false, error: { message: "본인의 스터디에는 신청할 수 없습니다" } };
  }
  // 중복 신청 체크
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
  }
  
  // 신청
  const { data, error } = await supabase
    .from('participants')
    .upsert(
      { 
        study_id: studyId, 
        user_id: userId, 
        status: "pending",
        username: userProfile?.username,
        user_email: userProfile?.email,
      },
      { 
        onConflict: 'study_id,user_id',
        ignoreDuplicates: false
      }
    )
    .select()
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  // ✅ 스터디장에게 알림 생성
  await addNotification ({
    user_id: study.creator_id,
    type: "participant_request",
    title: "새로운 참가 요청",
    content: `${userProfile.username}님이 "${study.title}" 스터디에 참가 요청했습니다`,
    reference_type: "study",
    reference_id: studyId,
    sender_id: userId,
    is_read: false,
    is_deleted: false,
  });
  
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
    .in("status", ["accepted", "pending"])
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// export async function studyAddParticipant(studyId: string) {
//   const supabase = await createClient();

//   const { data: user, error: userError } = await supabase.auth.getUser();
//   const userId = user?.user?.id;
//   const { data: userData, error: userDataError } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", userId)
//     .single();
//   if (!userId) {
//     return { success: false, error: { message: "User not found" } };
//   }

//   const { data, error } = await supabase
//     .from("participants")
//     .insert({ study_id: studyId, user_id: userId, status: "accepted", role: "host", username: userData?.username, user_email: userData?.email });

//   if (error) {
//     return { success: false, error: { message: error.message } };
//   }
//   return { success: true, data };
// }

// 참여자 수락
export async function acceptParticipant(participantId: number) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (userProfileError) {
    return { success: false, error: { message: userProfileError.message } };
  }
  if (!userId) {
    return { success: false, error: { message: "User not found" } };
  }

  const { data, error } = await supabase
    .from("participants")
  .update({ status: "accepted" })
  .eq("id", participantId)
  .select(`
    user_id,
    study:studies!participants_study_id_fkey (
      id,
      title
    )
  `)
  .single();

   await addNotification ({
    user_id: data?.user_id,
    type: "request_accepted",
    title: "참가 요청 승인",
    content: `${userProfile.username}님이 "${data?.study?.title}" 스터디에 참가 요청을 승인했습니다`,
    reference_type: "study",
    reference_id: data?.study?.id,
    sender_id: userId,
    is_read: false,
    is_deleted: false
  });


  if (error) {
    return { success: false, error: { message: error.message } };
  }
  return { success: true, data };
}

// 참여자 거절
export async function rejectParticipant(participantId: number) {
  const supabase = await createClient();


  const { data: user, error: userError } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (userProfileError) {
    return { success: false, error: { message: userProfileError.message } };
  }
  if (!userId) {
    return { success: false, error: { message: "User not found" } };
  }
  const { data, error } = await supabase
    .from("participants")
    .update({ status: "rejected" })
    .eq("id", participantId)
    .select()
    .single();

  if (error) {
    return { success: false, error: { message: error.message } };
  }
  await addNotification ({
    user_id: data.user_id,
    type: "request_rejected",
    title: "참가 요청 거절",
    content: `${userProfile.username}님이 "${data.study.title}" 스터디에 참가 요청을 거절했습니다`,
    reference_type: "study",
    reference_id: data.study_id,
    sender_id: userId,
    is_read: false,
    is_deleted: false
  });
  return { success: true, data };
}

// 참여자 강퇴 or 탈퇴퇴 (삭제)
// export async function removeParticipant(participantId: number) {
//   const supabase = await createClient();

//   const { data: user, error: userError } = await supabase.auth.getUser();
//   const userId = user?.user?.id;
//   if (!userId) {
//     return { success: false, error: { message: "User not found" } };
//   }
//   const { error } = await supabase
//     .from("participants")
//     .delete()
//     .eq("id", participantId)
//     .eq("user_id", userId);

//   if (error) {
//     return { success: false, error: { message: error.message } };
//   }
//   return { success: true, data: null };
// }

// 참여자 탈퇴 or 강퇴
export async function removeParticipant(participantId: number) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    return { success: false, error: { message: "로그인이 필요합니다" } };
  }

  // 1. 참여자 정보 조회 (스터디 정보 포함)
  const { data: participant, error: participantError } = await supabase
    .from("participants")
    .select(`
      *,
      study:study_id (
        id,
        title,
        creator_id
      )
    `)
    .eq("id", participantId)
    .single();

  if (participantError || !participant) {
    return { success: false, error: { message: "참여자를 찾을 수 없습니다" } };
  }

  const isOwner = participant.study.creator_id === userId;  // 호스트 여부
  const isSelf = participant.user_id === userId;            // 본인 여부

  // 2. 권한 체크
  if (!isOwner && !isSelf) {
    return { success: false, error: { message: "권한이 없습니다" } };
  }

  // 3. 호스트는 본인 탈퇴 불가 (스터디 삭제로 처리해야 함)
  if (isOwner && isSelf) {
    return { success: false, error: { message: "호스트는 탈퇴할 수 없습니다. 스터디를 삭제해주세요." } };
  }

  // 4. 삭제 실행
  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId);

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  // 5. 알림 생성
  try {
    if (isSelf) {
      // 본인 탈퇴 → 호스트에게 알림
      await addNotification({
        user_id: participant.study.creator_id,
        type: "participant_left",
        title: "참여자 탈퇴",
        content: `${participant.username}님이 "${participant.study.title}" 스터디에서 탈퇴했습니다`,
        reference_type: "study",
        reference_id: participant.study.id,
        sender_id: userId,
        is_read: false,
        is_deleted: false,
      });
    } else {
      // 강퇴 → 강퇴당한 사람에게 알림
      await addNotification({
        user_id: participant.user_id,
        type: "participant_kicked",
        title: "스터디 강퇴",
        content: `"${participant.study.title}" 스터디에서 강퇴되었습니다`,
        reference_type: "study",
        reference_id: participant.study.id,
        sender_id: userId,
        is_read: false,
        is_deleted: false,
      });
    }
  } catch (e) {
    console.error("알림 생성 실패:", e);
  }

  return { success: true, data: null };
}