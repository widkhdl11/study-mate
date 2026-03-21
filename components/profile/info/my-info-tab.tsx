"use client";

import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ProfileResponse } from "@/types/profileType";

export default function MyInfoTab({ currentUser }: { currentUser: ProfileResponse }) {
  console.log(currentUser);
  return (
    <>
      <TabsContent value="info" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">계정 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">닉네임</p>
                <p className="text-lg font-semibold text-foreground">
                  {currentUser?.username}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">이메일</p>
                <p className="text-lg font-semibold text-foreground">
                  {currentUser?.email}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">생년월일</p>
                <p className="text-lg font-semibold text-foreground">
                  {currentUser?.birth_date}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">성별</p>
                <p className="text-lg font-semibold text-foreground">
                  {currentUser?.gender}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">회원 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">가입일</p>
              <p className="text-lg font-semibold text-foreground">
                {currentUser?.created_at}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">회원 등급</p>
              <p className="text-lg font-semibold text-foreground">
                {currentUser?.points}
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </>
  );
}
