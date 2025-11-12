"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/zod/schemas/authSchema";
import { useLogin } from "@/hooks/useAuth";

export default function LoginUI() {
  const formRef = useRef<HTMLFormElement>(null);
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    if (!formRef.current) {
      return;
    }

    form.clearErrors();

    const formData = new FormData(formRef.current);

    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        if (!response || response.success) {
          return;
        } else {
          const fieldName = response.error.field;
          if (fieldName) {
            form.setError(fieldName as keyof LoginFormValues, {
              type: "server",
              message: response.error.message,
            });
          }
        }
      },
    });
  }

  const isLoading = loginMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Study Mate
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            함께 성장하는 스터디 문화
          </p>
        </div>

        {/* 로그인 폼 카드 */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            로그인
          </h2>

          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* 이메일 필드 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        type="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 필드 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="비밀번호를 입력해주세요"
                        type="password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
        </Card>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            아직 회원이 아니신가요?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
