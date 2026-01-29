'use server';

import {createClient} from "@/utils/supabase/server";
import {getUser} from "./userAction";
import { notFound } from "next/navigation";


export async function createChat(formData : FormData) {
    const supabase = await createClient();
    const {data, error} = await supabase.from("chats").insert({study_id: formData.get("study_id")as string}).select();
    return data;
}

export async function getMyChatRooms() {
    const supabase = await createClient();


    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    const userId = user.user.id;
    const {data, error} = await supabase.from("chat_participants")
    .select("*, chats!chat_participants_chat_id_fkey(*)")
    .eq("user_id", userId);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getChatMessages(chatId : number) {
    const supabase = await createClient();
    const user = await getUser();
    if (! user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    const userId = user.id;
    // 호출한 쪽에서 try/catch 필수
    try {
        const chatParticipant = await checkChatParticipant(chatId, userId);
        if (! chatParticipant) {
            throw new Error("채팅방 참여자를 찾을 수 없습니다.");
        }
    } catch (error) {
        return {
            success: false,
            error: {
                message: (error as Error).message
            }
        };
    }

    const {data, error} = await supabase
    .from("chat_messages")
    .select(`*, 
        profile:profiles!chat_messages_sender_id_fkey(username, avatar_url)`)
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

    if (error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        };
    }
  return { success: true, data };
}

export async function getChatParticipants(chatId : number) {
    const supabase = await createClient();
    const {data, error} = await supabase.from("chat_participants").select("*").eq("id", chatId);
    return data;
}


// 해당 채팅방 참여 유저 확인
export async function checkChatParticipant(chatId : number, userId : string) {
    const supabase = await createClient();

    const {data, error} = await supabase.from("chat_participants").select("*").eq("chat_id", chatId).eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }
    if (!data) {
        throw new Error("채팅방 참여자를 찾을 수 없습니다.");
    }
    return data;
}


// 메시지 전송
export async function sendMessage(chatId: number, content: string) {
  const supabase = await createClient();
  
  // 1. 로그인 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: { message: "로그인이 필요합니다" } };
  }

  // 2. 참여자 검증
  const { data: participant } = await supabase
    .from("chat_participants")
    .select("id")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .single();

  if (!participant) {
    return { success: false, error: { message: "채팅방 접근 권한이 없습니다" } };
  }

  // 3. 메시지 저장
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: { message: "메시지 전송에 실패했습니다" } };
  }

  return { success: true, data };
}


// =============ssr================

export async function getChatMessagesSSR(chatId : number) {
    const supabase = await createClient();  

    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    const userId = user.user.id;
    const chatParticipant = await checkChatParticipant(chatId, userId);
    if (! chatParticipant) {
        throw new Error("채팅방 참여자를 찾을 수 없습니다.");
    }
    const {data, error} = await supabase.from("chat_messages")
    .select(`*, profile:profiles!chat_messages_sender_id_fkey(username, avatar_url)`)
    .eq("chat_id", chatId).order("created_at", { ascending: true });
    if (error) {
        console.log("getChatMessagesSSR error", error);
        notFound();
    }
    return data;
}

export async function getChatParticipantsSSR(chatId : number) {
    const supabase = await createClient();
     const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    const userId = user.user.id;
    const chatParticipant = await checkChatParticipant(chatId, userId);
    if (! chatParticipant) {
        throw new Error("채팅방 참여자를 찾을 수 없습니다.");
    }
    const {data, error} = await supabase.from("chat_participants")
    .select(`*, profile:profiles!chat_participants_user_id_fkey(username, avatar_url)`).eq("chat_id", chatId);
    if (error || !data) {
        console.log("getChatParticipantsSSR error", error);
        notFound();
    }
    return data;
}

export async function getChatSSR(chatId : number) {
    const supabase = await createClient();
     const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    const userId = user.user.id;
    const chatParticipant = await checkChatParticipant(chatId, userId);
    if (! chatParticipant) {
        throw new Error("채팅방 참여자를 찾을 수 없습니다.");
    }
    const {data, error} = await supabase.from("chats").select(`* , profile:profiles!chats_creator_id_fkey(username, avatar_url)`).eq("id", chatId).maybeSingle();
    if (error || !data) {
        console.log("getChatSSR error", error);
        notFound();
    }
    return data;
}