// 서버 액션 응답 타입
export type ActionResponse<T = void> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error: {
        message: string;
        field?: string; // 특정 필드 에러인 경우
      };
    };

// 로그인 폼 데이터
export type LoginFormData = {
  email: string;
  password: string;
};

// 회원가입 폼 데이터
export type SignupFormData = {
  user_id: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
