import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function CustomUserAuth(supabase: SupabaseClient, redirectTo = "/auth/login") {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error("인증 확인에 실패했습니다");
  }

  if (!user) {
    redirect(redirectTo);
  }

  return { user };
}