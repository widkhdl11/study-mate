'use client'

import {Card} from "@/components/ui/card";
import {TabsContent} from "@/components/ui/tabs";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import { ChatRoom } from "@/types/chatType";
import { formatTimeAgo } from "@/utils/utils";
export default function MyChatTab({chatRooms} : {
    chatRooms : ChatRoom[]
}) {
    return (<> {/* 채팅 탭 */}
        <TabsContent value="chats" className="space-y-4">
            <div className="space-y-3"> {
                chatRooms.map((room) => (
                <Card
                    className="group overflow-hidden hover:shadow-md transition-all h-full flex flex-col p-0 gap-0 min-h-[100px]">
                    <Link key={room.chat.id} href={`/chat/${room.chat.id}`}>
                    <div className="flex items-start gap-4 p-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={
                                    room.profile.avatar_url || "/placeholder.svg"
                                }
                                alt={
                                    room.name
                                }/>
                            <AvatarFallback className="bg-blue-600 text-white"> {
                                room?.name|| "??"
                            } </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-foreground truncate"> {
                                    room.chat.name
                                } </h3>
                                {/* 읽지 않은 메세지 */}
                                {/* {
                                room.unreadCount > 0 && (<Badge className="bg-red-500 text-white"> {
                                    room.unreadCount
                                } </Badge>)
                            }  */}
                            </div>
                            <p className="text-sm text-muted-foreground truncate"> {
                                room.chat.last_message
                            } </p>
                            <p className="text-xs text-muted-foreground mt-1"> {
                                formatTimeAgo(room.chat.last_message_at)
                            } </p>
                        </div>
                    </div>
                    </Link>
                </Card>
                ))
            } </div>
        </TabsContent>
    </>);
}
