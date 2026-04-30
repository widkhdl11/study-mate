import { getChatParticipantsSSR, getChatSSR } from "@/actions/chatAction";
import dynamic from "next/dynamic";

const ChatRoomUI = dynamic(
    () => import('./ui')
)

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const chatParticipants = await getChatParticipantsSSR(Number(id));
    const chatRoom = await getChatSSR(Number(id));

    return <ChatRoomUI chatParticipants={chatParticipants} chatRoom={chatRoom} />
}