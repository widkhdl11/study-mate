  "use server";

  import { createClientAdmin } from "@/lib/supabase/client-admin";
import { createClient } from "@/lib/supabase/server";
import { LoginFormValues, loginSchema, PasswordChangeFormValues, passwordChangeSchema, SignupFormValues, signupSchema } from "@/lib/zod/schemas/authSchema";
import { ActionResponse } from "@/types/actionType";
import { CustomUserAuth } from "@/utils/auth";
import { validateWithZod } from "@/utils/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

  /**
   * 로그인
   * 1. FormData 객체 변환
   * 2. Zod 검증
   * 3. Supabase 로그인
   */
  export async function login(
    formData: FormData
  ): Promise<ActionResponse > {
    const supabase = await createClient();

    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const parseResult = validateWithZod(loginSchema, rawData);

    if (!parseResult.success) {
      return parseResult as ActionResponse;
    }
    const { email, password } = parseResult.data as LoginFormValues;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
  // 400 = 사용자 입력 문제 → return
    if (error.status === 400) {
      return {
        success: false,
        error: { message: "이메일 또는 비밀번호가 일치하지 않습니다.", field: "email" },
      };
    }
      throw new Error("로그인에 실패했습니다");
    }

    revalidatePath("/", "layout");
    redirect("/");
  }

  /**
   * 회원가입
   * 1. FormData 객체 변환
   * 2. Zod 검증
   * 3. Supabase 회원가입
   * 4. 프로필 생성
   */
  export async function signup(
    formData: FormData
  ): Promise<ActionResponse > {
    const supabase = await createClient();
    const supabaseAdmin = createClientAdmin();
   
    const rawData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("passwordConfirm") as string,
      birthDate: formData.get("birthDate") as string,
      gender: formData.get("gender") as string,
    };

    const parseResult = validateWithZod(signupSchema, rawData);
    if (!parseResult.success) {
      return parseResult;
    }

    const { username, email, password, birthDate, gender } = parseResult.data as SignupFormValues;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      let message = "회원가입에 실패했습니다.";

      if (authError.message.includes("already registered")) {
        message = "이미 가입된 이메일입니다.";
      } else if (authError.message.includes("Password")) {
        message = "비밀번호가 보안 요구사항을 충족하지 않습니다.";
      }

      return {
        success: false,
        error: { message, field: "email" },
      };
    }

    if (!data.user) {
      throw new Error("회원가입에 실패했습니다.");
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      username: username,
      birth_date: birthDate,
      gender: gender,
    });


    // 프로필 생성 실패 → auth 유저 롤백
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      if (profileError.code === "23505") {
        return {
          success: false,
          error: { message: "이미 가입된 아이디입니다.", field: "username" },
        };
      }
      throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
    }

    // 5. 성공 → 리다이렉트
    revalidatePath("/", "layout");
    redirect("/");
  }

  /**
   * 로그아웃
   * 1. Supabase 로그아웃
   */
  export async function logout(): Promise<ActionResponse > {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("로그아웃에 실패했습니다.");
    }

    revalidatePath("/", "layout");
    redirect("/");
  }

  export async function updatePassword(
    formData: FormData
  ): Promise<ActionResponse<void> > {
    const supabase = await createClient();
    const { user } = await CustomUserAuth(supabase);

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      newPasswordConfirm: formData.get("newPasswordConfirm") as string,
    };
    const parseResult = validateWithZod(passwordChangeSchema, rawData);
    if (!parseResult.success) {
      return parseResult;
    }

    const { currentPassword, newPassword } = parseResult.data as PasswordChangeFormValues;
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      throw new Error("비밀번호 변경에 실패했습니다.");
    }

    return { success: true, data: undefined };
  }