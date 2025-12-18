"use client";

export const convertUser = (user: any) => {
  return {
    id: user.user_id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinedDate: new Date(user.created_at).toLocaleDateString(),
    initials: user.initials,
    bio: user.bio,
    birthDate: user.birthDate,
    gender: user.gender,
    points: user.points,
    level: user.level,
  };
};
