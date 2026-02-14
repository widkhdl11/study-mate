'use server';

import { ActionResponse } from "@/types/actionType";
import { NotificationInsert, NotificationResponse } from "@/types/notificationType";
import { createClient } from "@/lib/supabase/server";
import { CustomUserAuth } from "@/utils/auth";



// 알람 가져오기(is_deleted = false 인것 가져오기)
export async function getNotifications(): Promise<ActionResponse<NotificationResponse[]>> {
    const supabase = await createClient();
    const { user } = await CustomUserAuth(supabase);
    const { data, error } = await supabase
        .from("notifications")
        .select("*, profile:profiles!notifications_sender_id_fkey(username, avatar_url)")
        .eq("user_id", user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
    if (error) {
        throw new Error("알람 요청 중 오류가 발생했습니다");
    }
    return { success: true, data: data as unknown as NotificationResponse[] };
}
// 알람 추가
export async function addNotification(notification: NotificationInsert): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notifications")
        .insert({
            ...notification,
            sender_id: notification.sender_id ?? null,
            is_read: false,
            is_deleted: false,
        })
        .select()
        .single();
    if (error) {
        throw new Error("알람 요청 중 오류가 발생했습니다");
    }
    return { success: true, data: data as unknown as NotificationResponse };
}

// 모든 알람 가져오기(is_deleted = true 인것 가져오기)

// 알람 읽기(is_read = false 인것 읽기)
export async function readNotification(notificationId: number): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { user } = await CustomUserAuth(supabase);
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        throw new Error("알람 읽기 중 오류가 발생했습니다");
    }
    return { success: true, data: data as unknown as NotificationResponse };
}
// 알람 삭제(is_deleted = true로 변경)
export async function deleteNotification(notificationId: number): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { user } = await CustomUserAuth(supabase);
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_deleted: true })
        .eq("id", notificationId)
        .eq("user_id", user.id)
        .select()
        .single();
    if (error) {
        throw new Error("알람 삭제 중 오류가 발생했습니다");
    }
    return { success: true, data: data as unknown as NotificationResponse };
}
