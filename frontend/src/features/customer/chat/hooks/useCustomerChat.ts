// useCustomerChat.ts
import { useState, useEffect, useRef } from "react";
import { chatRoomApi, chatApi } from "@/services/chat.service";
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
    if (!input.trim() || !roomId) return;
    const content = input.trim();
    setInput("");

    if (mode === "ai") {
      // Chế độ AI: Tự tạo tin nhắn local để phản hồi tức thì
      const userMsg: ChatMessage = {
        id: Date.now(),
        content,
        sender: "CUSTOMER",
        sentAt: new Date().toISOString(),
        type: "TEXT",
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsAiThinking(true);

      try {
        const res = await ProductsAPI.getProducts({ search: content }, 1, 3);
        const aiText = res.data?.length
          ? `Gợi ý cho bạn: ${res.data.map((p) => p.name).join(", ")}`
          : "Mình không tìm thấy sản phẩm phù hợp.";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            content: aiText,
            sender: "ADMIN",
            sentAt: new Date().toISOString(),
            type: "TEXT",
          },
        ]);
      } finally {
        setIsAiThinking(false);
      }
    } else {
      // Chế độ Nhân viên: Gửi qua API
      // Thêm tin nhắn vào local state ngay lập tức (optimistic update)
      const userMsg: ChatMessage = {
        id: Date.now(),
        content,
        sender: "CUSTOMER",
        sentAt: new Date().toISOString(),
        type: "TEXT",
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        await chatApi.sendMessage(roomId, {
          content,
          sender: "CUSTOMER",
          type: "TEXT",
        });
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
      }
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
