"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema } from "@/lib/zod/schema/signSchema";

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();
    // FormData를 JS 객체로 변환
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // zod로 검증: 실패하면 에러 페이지 리다이렉트
    const parseResult = loginSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
  return redirect("/");
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient();
    // type-casting here for convenience
    // in practice, you should validate your inputs

    const data = {
      user_id: formData.get("user_id") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("passwordConfirm") as string,
    };

    const parseResult = signupSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      throw new Error(error.message);
    }
    console.log("회원가입 성공");

    revalidatePath("/auth/login", "layout");
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
  return redirect("/auth/login");
}
