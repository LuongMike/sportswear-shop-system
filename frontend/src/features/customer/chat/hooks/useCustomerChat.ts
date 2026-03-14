// useCustomerChat.ts
import { useState, useEffect, useRef } from "react";
import { chatRoomApi, chatApi, chatApiAi } from "@/services/chat.service";
import type { ChatMessage } from "@/services/chat.service";
import ws from "@/services/ws.service";
import { useAuthStore } from "@/store/useAuthStore";
import { ProductsAPI } from "@/services/productsApi";

export function useCustomerChat() {
  const { user, accessToken } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"human" | "ai">("human");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kiểm tra đăng nhập
  const isLoggedIn = !!(user && accessToken);

  // 1. Khởi tạo Room
  useEffect(() => {
    if (!user || !accessToken) return;

    const initChat = async () => {
      try {
        // QUAN TRỌNG: Dùng fullName (viết hoa N) theo log console
        const currentName = user.fullName || user.email || "Guest";
        const res = await chatRoomApi.getMyRooms(currentName);
        const rooms = Array.isArray(res.data) ? res.data : [];

        if (rooms.length > 0) {
          const room = rooms[0] as any;
          setRoomId(room.id);

          // Sử dụng messages từ room nếu có, không cần gọi API riêng
          if (room.messages && Array.isArray(room.messages)) {
            console.log("📨 Messages từ backend:", room.messages);
            // Filter ra những messages hợp lệ
            const validMessages = room.messages.filter((m: any) => {
              // Bỏ qua messages không có content và không có fileUrl
              if (!m.content && !m.fileUrl) return false;
              return true;
            });
            setMessages(validMessages);
          } else {
            setMessages([]);
          }
        } else {
          // Tạo room mới nếu chưa có
          const newRoom = await chatRoomApi.createRoom({
            customerName: currentName,
            type: "ADMIN_SUPPORT",
          });
          setRoomId(newRoom.data.id);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo chat:", err);
      }
    };
    initChat();
  }, [user, accessToken]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    try {
      // Nếu đang ở chế độ AI
      if (mode === "ai") {
        setIsAiThinking(true);
        console.log(userMessage);

        const res = await chatApiAi.send({
          message: userMessage,
        });

        console.log(res);

        const aiReply = res.data?.response || "AI không trả lời.";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: userMessage,
            sender: "CUSTOMER",
            sentAt: new Date().toISOString(),
            type: "TEXT",
          },
          {
            id: Date.now() + 1,
            content: aiReply,
            sender: "ADMIN",
            sentAt: new Date().toISOString(),
            type: "TEXT",
          },
        ]);
      }

      // Nếu chat với nhân viên
      else {
        if (!roomId) return;

        const res = await chatApi.sendMessage(roomId, {
          content: userMessage,
          sender: "CUSTOMER",
          type: "TEXT",
        });

        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsAiThinking(false);
    }
  };
  // 2. Kết nối WebSocket
  // useEffect(() => {
  //   if (!roomId || mode !== "human") return;

  //   ws.connect(() => {
  //     ws.subscribeRoom(roomId, (msg) => {
  //       setMessages((prev) => {
  //         if (prev.find((m) => m.id === msg.id)) return prev;
  //         return [...prev, msg];
  //       });
  //     });
  //   });
  // }, [roomId, mode]);

  return {
    isOpen,
    toggleChat: () => setIsOpen(!isOpen),
    messages,
    input,
    setInput,
    handleSend,
    mode,
    setMode,
    isAiThinking,
    isLoggedIn,
    user,
    messagesEndRef,
    unreadCount: 0, // TODO: implement unread count logic
  };
}
