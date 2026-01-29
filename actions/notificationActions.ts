'use server';

import { ActionResponse } from "@/types/response/action";
import { NotificationInsert, NotificationResponse } from "@/types/response/notification";
import { createClient } from "@/lib/supabase/server";




// 알람 가져오기(is_deleted = false 인것 가져오기)
export async function getNotifications(): Promise<ActionResponse<NotificationResponse[]>> {
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        return { success: false, error: { message: userError.message } };
    }
    const { data, error } = await supabase
        .from("notifications")
        .select("*, profile:profiles!notifications_sender_id_fkey(username, avatar_url)")
        .eq("user_id", user.user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
    if (error) {
        return { success: false, error: { message: error.message } };
    }
    return { success: true, data };
}
// 알람 추가
export async function addNotification(notification: NotificationInsert): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        return { success: false, error: { message: userError.message } };
    }
    const { data, error } = await supabase
        .from("notifications")
        .insert({
            user_id: notification.user_id,
            type: notification.type,
            title: notification.title,
            content: notification.content,
            is_read: false,
            is_deleted: false,
            reference_type: notification.reference_type,
            reference_id: notification.reference_id,
            sender_id: notification.sender_id || null,
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: { message: error.message } };
    }
    return { success: true, data };
}

// 모든 알람 가져오기(is_deleted = true 인것 가져오기)

// 알람 읽기(is_read = false 인것 읽기)
export async function readNotification(notificationId: number): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        return { success: false, error: { message: userError.message } };
    }
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: { message: error.message } };
    }
    return { success: true, data };
}
// 알람 삭제(is_deleted = true로 변경)
export async function deleteNotification(notificationId: number): Promise<ActionResponse<NotificationResponse>> {
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        return { success: false, error: { message: userError.message } };
    }
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_deleted: true })
        .eq("id", notificationId)
        .eq("user_id", user.user.id)
        .select()
        .single();
    if (error) {
        return { success: false, error: { message: error.message } };
    }
    return { success: true, data };
}
