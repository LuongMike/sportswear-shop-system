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
      (err) => console.error("WS Error", err)
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
        r.id === selectedRoomId ? { ...r, hasUnread: false } : r
      )
    );

    const fetchMessages = async () => {
      try {
        const res = await chatApi.getMessages(selectedRoomId);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

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

  const handleSend = () => {
    if (!selectedRoomId) return;

    if (text.trim().length > 0) {
      const payload = {
        content: text,
        type: "TEXT",
        sender: "ADMIN",
      };
      ws.sendMessage(selectedRoomId, payload);
      setText("");
    }

    if (pendingFile) {
      chatApi
        .uploadFile(pendingFile)
        .then((res) => {
          const fileUrl = res.data; // BE returns string url
          const type = pendingFile.type.startsWith("image/") ? "IMAGE" : "FILE";
          const payload = {
            content: pendingFile.name,
            type,
            fileUrl,
            sender: "ADMIN",
          };
          ws.sendMessage(selectedRoomId, payload);
          setPendingFile(null);
        })
        .catch((err) => console.error("Upload error:", err));
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
