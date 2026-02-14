'use client';

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Props = {
  status: string;
  isApplying: boolean;
  onApply: () => void | Promise<void>;
};
  // 상태별 액션 버튼 렌더링
export function StudyActionButton({ status, isApplying, onApply }: Props) {
    switch (status) {
      case "모집중":
        return (
          <Button
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            onClick={onApply}
            disabled={isApplying}
          >
            {isApplying ? "신청 중..." : "참여 신청"}
          </Button>
        );
      case "수락 대기중":
        return (
          <Button
            disabled
            className="w-full py-6 text-lg bg-yellow-600 hover:bg-yellow-700"
          >
            수락 대기중
          </Button>
        );
      case "참여중":
        return (
          <div className="flex gap-3">
            <Badge className="flex-1  text-center bg-success text-white text-base justify-center">
              참여중
            </Badge>
            <Button variant="outline" className="flex-1 bg-transparent">
              채팅방 입장
            </Button>
          </div>
        );
      case "스터디 종료":
        return (
          <Button disabled className="w-full py-6 text-lg bg-muted">
            모집 마감
          </Button>
        );
      default:
        return null;
    }
  };