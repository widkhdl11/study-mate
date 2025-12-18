// 서버 액션 응답 타입
export type ActionResponse<T = void> =
  | {
      success: true;
      data?: T[] | T | undefined;
    }
  | {
      success: false;
      error: {
        message: string;
        field?: string; // 특정 필드 에러인 경우
      };
    };
