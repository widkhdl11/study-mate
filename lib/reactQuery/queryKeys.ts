// React Query 키 중앙 관리
export const queryKeys = {
  // 인증
  user: ["user"],
  myProfile: ["myProfile"],
  // 스터디
  studies: ["studies"],
  myStudies: ["myStudies"],
  study: (id: number) => ["studies", id],
  studyDetail: (id: number) => ["studies", "detail", id],
  // 게시글
  posts: ["posts"],
  post: (id: number) => ["posts", id],
  myPosts: ["myPosts"],
  myCreatedStudies: ["myCreatedStudies"],
  // 좋아요
  like: (postId: number) => ["like", postId],

  // 참여자
  // participants: (studyId: number) => ["participants", studyId],
  participant: (studyId: number) => ["participant", "status", studyId],

  // 채팅
  chat: (id: number) => ["chats", id],
  chatMessages: (chatId: number) => ["chatMessages", chatId],
  myChatRooms: ["myChatRooms"],
  notifications: ["notifications"],
  chatParticipants: (chatId: number) => ["chatParticipants", chatId],


  
  aiRecommendedStudies: ["ai-recommended-studies"] as const,

};

// export const queryKeys = {
//   posts: {
//     all: ["posts"],
//     myPosts: ["posts", "my"],
//     detail: (id: number) => ["posts", id],
//   },
//   studies: {
//     all: ["studies"],
//     myStudies: ["studies", "my"],
//     detail: (id: number) => ["studies", id],
//   },
// } as const;