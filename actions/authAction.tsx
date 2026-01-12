"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema } from "@/lib/zod/schemas/authSchema";
import { ActionResponse } from "@/types/response/action";
import { createClientAdmin } from "@/utils/supabase/client-admin";

/**
 * 로그인 서버 액션
 * @returns ActionResponse - 성공/실패 객체 또는 redirect
 */
export async function login(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();

  // 1. FormData를 객체로 변환
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 2. Zod 검증
  const parseResult = loginSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;

    return {
      success: false,
      error: {
        message: firstError.message,
        field,
      },
    };
  }
  const { error } = await supabase.auth.signInWithPassword(parseResult.data);
  if (error) {
    // Supabase 에러 메시지를 사용자 친화적으로 변환
    let message = error.message;

    if (error.status === 400) {
      message = "이메일 또는 비밀번호가 일치하지 않습니다.";
    } else {
      message = "로그인에 실패했습니다.";
    }

    return {
      success: false,
      error: { message, field: "email" },
    };
  }

  // 4. 성공 시 캐시 갱신 후 리다이렉트
  revalidatePath("/", "layout");  // ← 이거 추가!
  redirect("/");
}

/**
 * 회원가입 서버 액션
 * @returns ActionResponse - 성공/실패 객체 또는 redirect
 */

export async function signup(
  formData: FormData
): Promise<ActionResponse | never> {
  const supabase = await createClient();
  // const supabaseAdmin = createClientAdmin();

  // 1. FormData를 객체로 변환
  const rawData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
  };

  // 2. Zod 검증
  const parseResult = signupSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    const field = firstError.path[0] as string;
    return {
      success: false,
      error: {
        message: firstError.message,
        field,
      },
    };
  }

  const { username, email, password } = parseResult.data;

  // 3. Supabase 회원가입 (email, password만)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    let message = "회원가입에 실패했습니다";

    if (error.message.includes("already registered")) {
      message = "이미 가입된 이메일입니다";
    } else if (error.message.includes("Password")) {
      message = "비밀번호가 보안 요구사항을 충족하지 않습니다";
    }

    throw new Error(JSON.stringify({ message, field: "email" }));
  }

  // 4. profiles 테이블에 user_id 저장
  if (data.user) {
    try {
      // profiles 테이블에 추가 정보 저장
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        username: username,
      });

      if (profileError) {
        throw profileError;
      }
    } catch (err: any) {
      await supabase.auth.signOut(); // 현재 세션 쿠키 초기화
      // const { error: adminError } = await supabaseAdmin.auth.admin.deleteUser(
      //   data.user.id
      // );

      // if (adminError) {
      //   throw new Error(
      //     JSON.stringify({ message: "회원가입에 실패했습니다." })
      //   );
      // }
      // throw new Error(JSON.stringify({ message: err.message }));
    }
  }
  revalidatePath("/", "layout");  // ← 이거 추가!
  redirect("/");
}
export async function logout(): Promise<ActionResponse | never> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: { message: "로그아웃에 실패했습니다" },
    };
  }
  revalidatePath("/", "layout");
  return {
    success: true,
  };
}
