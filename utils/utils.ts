import { ActionError, ActionResponse } from "@/types/response/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassValue, clsx } from "clsx";
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