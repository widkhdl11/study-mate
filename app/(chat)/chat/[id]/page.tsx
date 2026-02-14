"use server"

import { getChatParticipantsSSR, getChatSSR } from "@/actions/chatAction";
import { ChatRoomUI } from "./ui";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const chatParticipants = await getChatParticipantsSSR(Number(id));
    const chatRoom = await getChatSSR(Number(id));
    return <ChatRoomUI chatParticipants={chatParticipants} chatRoom={chatRoom} />
}