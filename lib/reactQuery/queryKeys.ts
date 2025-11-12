export const queryKeys = {
  user: ["user"],
  posts: ["posts"],
  post: (id: number) => ["posts", id],
  studies: ["studies"],
};
