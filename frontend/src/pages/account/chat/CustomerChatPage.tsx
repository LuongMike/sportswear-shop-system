import React from "react";
import { useCustomerChat } from "@/features/customer/chat/hooks/useCustomerChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  formatChatTime,
  groupMessages,
  formatDateHeader,
} from "@/utils/chat-utils";

export default function CustomerChatPage() {
  const {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    handleSend,
    messagesEndRef,
    user,
    isLoggedIn,
    mode,
    setMode,
    isAiThinking,
  } = useCustomerChat();

  const groupedMessages = groupMessages(messages);

  return (
    <div className="max-w-xl mx-auto my-8">
      <Card className="flex flex-col h-[70vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Hỗ trợ khách hàng</div>
          <div className="flex gap-2">
            <Button
              variant={mode === "human" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("human")}
            >
              Nhân viên
            </Button>
            <Button
              variant={mode === "ai" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("ai")}
            >
              Trợ lý AI
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4 bg-slate-50/30">
          <div className="space-y-4">
            {groupedMessages.map((item, idx) => {
              if (item.type === "date") {
                return (
                  <div
                    key={`date-${idx}`}
                    className="text-center text-xs text-muted-foreground my-4 font-medium"
                  >
                    {formatDateHeader(item.date)}
                  </div>
                );
              }
              const msg = item.msg;
              const isAdmin = msg.sender === "ADMIN";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isAdmin ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={isAdmin ? "bg-blue-600 text-white" : ""}
                    >
                      {isAdmin ? "AD" : "K"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] text-sm ${isAdmin ? "items-end" : "items-start"} flex flex-col`}
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
                          className="max-w-full rounded-lg"
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
        <div className="p-4 border-t flex gap-2 bg-background">
          <Input
            placeholder={
              mode === "ai" ? "Nhập yêu cầu sản phẩm..." : "Nhập tin nhắn..."
            }
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={isAiThinking}
          />
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
            disabled={isAiThinking}
          >
            Gửi
          </Button>
        </div>
        {isAiThinking && (
          <div className="text-center text-xs text-muted-foreground py-2">
            Trợ lý AI đang xử lý...
          </div>
        )}
      </Card>
    </div>
  );
}
