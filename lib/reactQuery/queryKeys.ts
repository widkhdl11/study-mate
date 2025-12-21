// React Query 키 중앙 관리
export const queryKeys = {
  // 인증
  user: ["user"],

  // 스터디
  studies: ["studies"],
  myStudies: ["myStudies"],
  study: (id: number) => ["studies", id],
  studyDetail: (id: number) => ["studies", "detail", id],
  // 게시글
  posts: ["posts"],
  post: (id: number) => ["posts", id],
  myPosts: ["myPosts"],
  // 좋아요
  likes: (postId: number) => ["likes", postId],

  // 참여자
  // participants: (studyId: number) => ["participants", studyId],
  participant: (studyId: number) => ["participant", "status", studyId],

  // 채팅
  chats: ["chats"],
  chat: (id: number) => ["chats", id],
  chatMessages: (chatId: number) => ["chatMessages", chatId],
};
