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
  const [unreadCount, setUnreadCount] = useState(0);
  const [mode, setMode] = useState<"human" | "ai">("human");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const subscriptionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initialize chat (fetch room)
  useEffect(() => {
    if (!user || !accessToken) return;

    const initChat = async () => {
      try {
        const res = await chatRoomApi.getMyRooms();
        // Assuming res.data is an array of rooms or a single room object depending on backend
        // Based on useAdminChat, getAdminRooms returns ChatRoom[]
        // Let's assume getMyRooms returns ChatRoom[] too.
        const rooms = Array.isArray(res.data) ? res.data : [res.data];

        if (rooms.length > 0 && rooms[0]) {
          const room = rooms[0];
          setRoomId(room.id);
          // Fetch messages
          const msgRes = await chatApi.getMessages(room.id);
          setMessages(msgRes.data);
        } else {
          // Create room if none exists
          try {
            const newRoomRes = await chatRoomApi.createRoom({
              customerName: user.full_name || user.email || "Customer",
            });
            if (newRoomRes.data) {
              setRoomId(newRoomRes.data.id);
            }
          } catch (createErr) {
            console.error("Failed to create room", createErr);
          }
        }
      } catch (err) {
        console.error("Failed to init chat", err);
      }
    };

    initChat();
  }, [user, accessToken]);

  // Connect WS and Subscribe
  useEffect(() => {
    if (!user || !roomId) return;

    ws.connect(
      () => {
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

        subscriptionRef.current = ws.subscribeRoom(roomId, (msg) => {
          setMessages((prev) => [...prev, msg]);
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
          }
        });
      },
      (err) => {
        console.error("WS Error", err);
      }
    );

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [roomId, user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Chế độ trợ lý AI: không gửi WS, dùng API sản phẩm để gợi ý danh sách phù hợp
    if (mode === "ai") {
      const question = input.trim();
      setInput("");

      const now = new Date().toISOString();
      const customerMsg: ChatMessage = {
        id: Date.now(),
        content: question,
        sender: "CUSTOMER",
        sentAt: now,
        type: "TEXT",
      };
      setMessages((prev) => [...prev, customerMsg]);
      setIsAiThinking(true);

      try {
        const res = await ProductsAPI.getProducts({ search: question }, 1, 5);
        const products = res.data ?? [];

        let content: string;

        if (!products.length) {
          content =
            "Mình chưa tìm thấy sản phẩm nào khớp chính xác với mô tả của bạn.\n\n" +
            "Bạn có thể thử lại với mô tả chi tiết hơn (ví dụ: loại sản phẩm, màu sắc, size, giới tính...).";
        } else {
          const lines = products.map(
            (p, idx) =>
              `${idx + 1}. ${p.name}`
          );
          content =
            "Dựa trên yêu cầu của bạn, mình gợi ý một vài sản phẩm sau:\n\n" +
            lines.join("\n");
        }

        const aiMsg: ChatMessage = {
          id: Date.now() + 1,
          content,
          sender: "ADMIN", // hiển thị phía hỗ trợ
          sentAt: new Date().toISOString(),
          type: "TEXT",
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("AI assistant error:", err);
        const fallback: ChatMessage = {
          id: Date.now() + 2,
          content:
            "Xin lỗi, hiện tại mình không truy cập được dữ liệu sản phẩm để gợi ý.\n\n" +
            "Bạn có thể thử lại sau ít phút, hoặc mô tả lại sản phẩm bạn muốn tìm.",
          sender: "ADMIN",
          sentAt: new Date().toISOString(),
          type: "TEXT",
        };
        setMessages((prev) => [...prev, fallback]);
      } finally {
        setIsAiThinking(false);
      }
      return;
    }

    // Chế độ chat với nhân viên (WS như cũ)
    if (!roomId) return;

    const payload = {
      content: input,
      type: "TEXT",
      sender: "CUSTOMER",
    };

    ws.sendMessage(roomId, payload);
    setInput("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  return {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    handleSend,
    unreadCount,
    messagesEndRef,
    user,
    isLoggedIn: !!user,
    mode,
    setMode,
    isAiThinking,
  };
}
