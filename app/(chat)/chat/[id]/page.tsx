import { getChatMessagesSSR, getChatParticipantsSSR, getChatSSR } from "@/actions/chat.Action";
import { ChatRoomUI } from "./ui"

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // 서버에서 채팅방 데이터 조회
  // 해당 채팅방 참여자 조회
  const chatParticipants = await getChatParticipantsSSR(Number(id));
  // 해당 채팅방 이름 조회
  const chatRoom = await getChatSSR(Number(id));

  return <ChatRoomUI chatParticipants={chatParticipants} chatRoom={chatRoom} />
}
