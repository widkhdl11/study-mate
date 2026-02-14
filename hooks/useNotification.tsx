import { getNotifications, readNotification } from "@/actions/notificationAction";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { NotificationResponse } from "@/types/notificationType";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUser } from "./useUser";
import { toast } from "sonner";


// is_deleted = false 인것 가져오기
export function useGetNotifications(){
    const queryClient = useQueryClient();
    const supabase = createClient();
    const { data: user } = useUser();
    const query = useQuery({

        queryKey: queryKeys.notifications,
        queryFn: async () => {
            const result = await getNotifications();
            if (result.success) {
                return result.data as unknown as NotificationResponse[];
            } else {
                throw new Error(result.error?.message || "알람 가져오기 중 오류가 발생했습니다");
            }
        },
    });

    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase.channel("notifications")
        .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user?.id}`,
        },
        async (payload) => {
          const newNotification = payload.new as NotificationResponse;

          // 캐시에 추가
          queryClient.setQueryData(
            queryKeys.notifications,
            (old: Notification[] | undefined) => {
              if (!old) return [newNotification];
              return [newNotification, ...old];  // 최신이 맨 위
            }
          );
        });
        channel.subscribe();
        // cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, queryClient, supabase]);


    return query;
}


// 메세지 읽기
export function useReadNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notificationId: number) => {
            return await readNotification(notificationId);
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}