import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ChatRoom } from "@/services/chat.service";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId: number | null;
  onSelectRoom: (id: number) => void;
}

export function ChatRoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: ChatRoomListProps) {
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm khách..." className="pl-9 bg-slate-50" />
      </div>

      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors border border-transparent 
              ${
                selectedRoomId === room.id
                  ? "bg-blue-50 border-blue-100 dark:bg-slate-800 dark:border-slate-700"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${room.customerName}`}
              />
              <AvatarFallback>{room.customerName?.[0] || "C"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`font-medium truncate ${
                    room.hasUnread ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {room.customerName || "Khách hàng"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {room.lastMessageAt
                    ? new Date(room.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              <p
                className={`text-sm truncate ${
                  room.hasUnread
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Room #{room.id}
              </p>
            </div>

            {room.hasUnread && (
              <div className="mt-2">
                <Badge
                  variant="default"
                  className="h-2 w-2 p-0 rounded-full bg-blue-600"
                />
              </div>
            )}
          </button>
        ))}
        {rooms.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            Chưa có phòng chat nào
          </div>
        )}
      </div>
    </>
  );
}
