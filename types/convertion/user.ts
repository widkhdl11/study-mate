"use client";

export const convertUser = (user: any) => {
  console.log("user : ", user);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    joinedDate: new Date(user.created_at).toLocaleDateString(),
    initials: user.initials,
    bio: user.bio,
    birthDate: user.birthDate,
    gender: user.gender,
    points: user.points,
    level: user.level,
  };
};
