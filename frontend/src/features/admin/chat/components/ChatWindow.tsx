import React, { useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { ChatMessage } from "@/services/chat.service";
import {
  groupMessages,
  formatDateHeader,
  formatChatTime,
} from "@/utils/chat-utils";

interface ChatWindowProps {
  selectedRoomId: number | null;
  messages: ChatMessage[];
  text: string;
  setText: (text: string) => void;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  handleSend: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPreviewImage: (url: string | null) => void;
}

export function ChatWindow({
  selectedRoomId,
  messages,
  text,
  setText,
  pendingFile,
  setPendingFile,
  handleSend,
  handleFileChange,
  setPreviewImage,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages = groupMessages(messages);

  if (!selectedRoomId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
        <MessageSquare className="w-16 h-16 opacity-20" />
        <p>Chọn một đoạn hội thoại để bắt đầu hỗ trợ</p>
      </div>
    );
  }

  return (
    <Card className="flex-1 flex flex-col shadow-sm border-0 sm:border overflow-hidden">
      {/* Khu vực tin nhắn */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/30">
        <div className="space-y-4">
          {groupedMessages.map((item, index) => {
            if (item.type === "date") {
              return (
                <div
                  key={`date-${index}`}
                  className="text-center text-xs text-muted-foreground my-4 font-medium"
                >
                  {formatDateHeader(item.date)}
                </div>
              );
            }

            const msg = item.msg as ChatMessage;
            const isAdmin = msg.sender === "ADMIN";

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isAdmin ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={isAdmin ? "bg-blue-600 text-white" : ""}
                  >
                    {isAdmin ? "AD" : "K"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] text-sm ${
                    isAdmin ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  <div
                    className={`p-3 rounded-2xl ${
                      isAdmin
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    {msg.type === "TEXT" && msg.content}
                    {msg.type === "IMAGE" && (
                      <img
                        src={msg.fileUrl}
                        alt="attachment"
                        className="max-w-full rounded-lg cursor-pointer"
                        onClick={() => setPreviewImage(msg.fileUrl || null)}
                      />
                    )}
                    {msg.type === "FILE" && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {msg.content}
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {formatChatTime(msg.sentAt)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input nhập liệu */}
      <div className="p-4 border-t flex flex-col gap-2 bg-background">
        {pendingFile && (
          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded text-sm">
            <span className="truncate max-w-[200px]">{pendingFile.name}</span>
            <button
              onClick={() => setPendingFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex gap-1">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <span>
                  <Paperclip className="w-5 h-5" />
                </span>
              </Button>
            </label>
            <label htmlFor="file-upload">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <span>
                  <ImageIcon className="w-5 h-5" />
                </span>
              </Button>
            </label>
          </div>
          <Input
            placeholder="Nhập tin nhắn phản hồi..."
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
