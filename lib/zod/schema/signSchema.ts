import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({
    message: "유효한 이메일을 입력해주세요",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 6자 이상이어야 합니다",
  }),
});

export const signupSchema = z
  .object({
    user_id: z
      .string()
      .min(3, "아이디는 3자 이상이어야 합니다")
      .max(20, "아이디는 20자 이하여야 합니다"),
    email: z.string().email("유효한 이메일을 입력해주세요"),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });
