
import z from "zod";



export const postSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  studyId: z.coerce.number<number>().min(1, "스터디를 선택해주세요"),
  content: z
    .string()
    .trim() // 공백 제거
    .min(1, "내용을 입력해주세요"),
  images: z.array(z.instanceof(File)).optional(),
  // images: z.any().optional().default([]),  

});

export const updatePostSchema = z.object({
  id: z.coerce.number<number>().min(1, "게시글을 선택해주세요"),
  title: z.string().min(1, "제목을 입력해주세요"),
  studyId: z.coerce.number<number>().min(1, "스터디를 선택해주세요"),
  content: z
    .string()
    .trim() // 공백 제거
    .min(1, "내용을 입력해주세요"),
  images: z.array(z.instanceof(File)).optional(), 
});

export type PostFormValues = z.infer<typeof postSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
