import * as z from "zod";

export const studySchema = z.object({
  title: z
    .string()
    .min(3, "제목은 3자 이상이어야 합니다")
    .max(50, "제목은 50자 이하여야 합니다"),
  mainCategory: z.string().min(1, "카테고리를 선택해주세요"),
  subCategory: z.string().min(1, "카테고리를 선택해주세요"),
  detailCategory: z.string().min(1, "카테고리를 선택해주세요"),
  studyCategory: z.coerce.number<number>().min(1, "카테고리를 선택해주세요"),
  mainRegion: z.string().min(1, "지역을 선택해주세요"),
  detailRegion: z.string().min(1, "지역을 선택해주세요"),
  region: z.coerce.number<number>().min(1, "지역을 선택해주세요"),
  // region: z.coerce.number<number>().min(1, "지역을 선택해주세요"),
  // region: z.string().min(1, "지역을 선택해주세요"),
  maxParticipants: z.coerce
    .number<number>()
    .min(1, "최소 1명 이상이어야 합니다")
    .max(20, "최대 20명까지 가능합니다")
    .int("최대 인원은 정수여야 합니다"),

  description: z
    .string()
    .trim() // 공백 제거
    .min(1, "설명을 입력해주세요"),
});
export type StudyFormValues = z.infer<typeof studySchema>;


