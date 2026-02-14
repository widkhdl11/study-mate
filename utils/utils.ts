import { ActionError, ActionResponse } from "@/types/actionType";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FieldErrors, Resolver } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown
): ActionResponse<T> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: {
        message: firstError.message,
        field: firstError.path[0] as string,
      },
    };
  }
  return { success: true, data: result.data };
}

// NEXTJS 리다이렉트 체크
export function isRedirect(error: Error): boolean {
  return error.message === "NEXT_REDIRECT";
}

// Date → "YYYY-MM-DD" (input type="date"용)

export function formatDateToInput(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split('T')[0];
}

// "YYYY-MM-DD" → Date
export function parseInputToDate(value: string): Date | undefined {
  if (!value) return undefined;
  return new Date(value);
}


export function zodResolverFirstError<T extends z.ZodType>(schema: T) {
  const baseResolver = zodResolver(schema as any);

  return async (values: any, context: any, options: any) => {
    const result = await baseResolver(values, context, options);

    if (result.errors && Object.keys(result.errors).length > 0) {
      const firstKey = Object.keys(result.errors)[0];
      return {
        values: result.values,
        errors: { [firstKey]: result.errors[firstKey] },
      };
    }

    return result;
  };
}

  // 날짜 포맷 함수
 export const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };


  export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return "방금 전"
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}분 전`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}시간 전`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}일 전`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks}주 전`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months}개월 전`
  }

  const years = Math.floor(days / 365)
  return `${years}년 전`
}
