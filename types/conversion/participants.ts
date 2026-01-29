'use client';


export const roleConversion = (role: string) => {
  switch (role) {
    case "host":
      return "호스트";
    case "common":
      return "멤버";
  }
};

export const statusConversion = (status: string) => {
  switch (status) {
    case "pending":
      return "대기중";
    case "accepted":
      return "참여중";
    case "rejected":
      return "거절";
  }
};