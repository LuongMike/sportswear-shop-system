import { useState, useEffect, useRef } from "react";
import { chatRoomApi, chatApi } from "@/services/chat.service";
import type { ChatMessage } from "@/services/chat.service";
import ws from "@/services/ws.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useCustomerChat() {
  const { user, accessToken } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

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
        setIsConnecting(false);
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
        setIsConnecting(false);
      }
    );

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [roomId, user]);

  const handleSend = async () => {
    if (!input.trim() || !roomId) return;

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
  };
}
