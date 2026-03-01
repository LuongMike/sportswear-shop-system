import { useState, useEffect, useRef } from "react";
import { chatRoomApi, chatApi } from "@/services/chat.service";
import type { ChatRoom, ChatMessage } from "@/services/chat.service";
import ws from "@/services/ws.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useAdminChat() {
  const { user } = useAuthStore();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const subscriptionRef = useRef<any>(null);
  const newRoomSubRef = useRef<any>(null);
  const selectedRoomRef = useRef<number | null>(null);

  const getLastReadKey = (uid: number, roomId: number) =>
    `admin_last_read_${uid}_${roomId}`;

  useEffect(() => {
    selectedRoomRef.current = selectedRoomId;
  }, [selectedRoomId]);

  const loadRooms = async (isInitial = false) => {
    if (!user?._id) return;
    try {
      const res = await chatRoomApi.getAdminRooms();
      setRooms(() => {
        const list = res.data.map((r) => {
          let hasUnread = false;

          if (user._id) {
            const key = getLastReadKey(Number(user._id), r.id);
            const stored = localStorage.getItem(key);

            if (r.lastMessageAt) {
              if (!stored) {
                hasUnread = true;
              } else {
                try {
                  const lastRead = new Date(stored);
                  const lastMsg = new Date(r.lastMessageAt);
                  if (lastMsg > lastRead) {
                    hasUnread = true;
                  }
                } catch {
                  hasUnread = true;
                }
              }
            }
          }

          if (r.id === selectedRoomRef.current) {
            hasUnread = false;
          }

          return { ...r, hasUnread };
        });

        list.sort((a, b) => {
          if (!a.lastMessageAt && !b.lastMessageAt) return 0;
          if (!a.lastMessageAt) return 1;
          if (!b.lastMessageAt) return -1;
          return (
            new Date(b.lastMessageAt!).getTime() -
            new Date(a.lastMessageAt!).getTime()
          );
        });

        return list;
      });
    } catch (err) {
      console.error("loadRooms error:", err);
    }
  };

  // Load rooms & polling
  useEffect(() => {
    if (!user?._id) return;
    loadRooms(true);
    const interval = setInterval(() => loadRooms(false), 5000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // WebSocket: Listen for new rooms
  useEffect(() => {
    if (!user?._id) return;

    ws.connect(
      () => {
        if (!newRoomSubRef.current) {
          newRoomSubRef.current = ws.subscribeNewRoom((room) => {
            setRooms((prev) => {
              const exists = prev.find((r) => r.id === room.id);
              if (exists) return prev;
              return [room, ...prev];
            });
          });
        }
      },
      (err) => console.error("WS Error", err),
    );

    return () => {
      // Cleanup if needed
    };
  }, [user?._id]);

  // Load messages when room selected
  useEffect(() => {
    if (!selectedRoomId || !user?._id) return;

    // Mark as read
    const key = getLastReadKey(Number(user._id), selectedRoomId);
    localStorage.setItem(key, new Date().toISOString());

    // Update local state to remove unread dot
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoomId ? { ...r, hasUnread: false } : r,
      ),
    );

    // Lấy messages từ room đã load thay vì gọi API riêng (backend không có GET endpoint)
    const selectedRoom = rooms.find(r => r.id === selectedRoomId) as any;
    if (selectedRoom?.messages && Array.isArray(selectedRoom.messages)) {
      setMessages(selectedRoom.messages);
    } else {
      setMessages([]);
    }

    // Subscribe to room messages
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = ws.subscribeRoom(selectedRoomId, (msg) => {
      setMessages((prev) => [...prev, msg]);

      // Update last read time when receiving new message while in room
      if (selectedRoomRef.current === selectedRoomId) {
        localStorage.setItem(key, new Date().toISOString());
      }
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [selectedRoomId, user?._id]);

  // Sửa handleSend để gửi tin nhắn qua cả REST API và WebSocket
  // Trong handleSend của useAdminChat.ts
  const handleSend = async () => {
    if (!selectedRoomId || !text.trim()) return;

    try {
      const payload = { content: text, type: "TEXT", sender: "ADMIN" };
      // CHỈ gửi qua REST API. Backend sẽ tự gửi thông báo qua WebSocket cho Khách hàng.
      await chatApi.sendMessage(selectedRoomId, payload);
      setText("");

      // Load lại tin nhắn hoặc để WS subscription tự cập nhật
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    e.target.value = "";
  };

  return {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    messages,
    text,
    setText,
    pendingFile,
    setPendingFile,
    previewImage,
    setPreviewImage,
    handleSend,
    handleFileChange,
  };
}
