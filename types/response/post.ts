export type PostsResponse = {
  // posts 테이블 컬럼만
  id: number;
  title: string;
  content: string;
  author_id: string;
  likes_count: number;
  views_count: number;
  created_at: string;
  image_url: Array<{
    url: string;
    name: string;
    size: number;
  }> | null;

  // JOIN된 데이터
  study: {
    id: number;
    title: string;
    description: string;
    study_category: string;
    region: string;
    max_participants: number;
    current_participants: number;
    status: string;
  };

  author: {
    id: string;
    user_id: string;
    email: string;
    username: string;
    avatar_url: string | null;
  };
};
