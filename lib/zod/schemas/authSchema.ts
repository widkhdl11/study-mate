import * as z from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(6, "비밀번호는 6자 이상이어야 합니다"),
});

// 회원가입 스키마
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "아이디를 입력해주세요")
      .min(3, "아이디는 3자 이상이어야 합니다")
      .max(20, "아이디는 20자 이하여야 합니다")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "아이디는 영문, 숫자, 언더스코어만 사용 가능합니다"
      ),
    email: z.email("유효한 이메일을 입력해주세요"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(6, "비밀번호는 6자 이상이어야 합니다"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

// 타입 추출
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
