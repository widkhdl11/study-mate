import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MyChatTab({ chatRooms }: { chatRooms: any[] }) {
  return (
    <>
      {/* 채팅 탭 */}
      <TabsContent value="chats" className="space-y-4">
        <div className="space-y-3">
          {chatRooms.map((room) => (
            <Card
              key={room.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage
                    src={room.avatar || "/placeholder.svg"}
                    alt={room.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {room.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {room.name}
                    </h3>
                    {room.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {room.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {room.lastMessageTime}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </>
  );
}
