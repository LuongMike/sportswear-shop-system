import api from "@/lib/axios";

export interface ChatRoom {
  id: number;
  customerName: string;
  adminName?: string;
  lastMessageAt?: string;
  hasUnread?: boolean;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: string; // "ADMIN" | "CUSTOMER"
  sentAt: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
}

export const chatRoomApi = {
  createRoom: (data: any) => api.post("/api/chat/rooms", data),
  getMyRooms: () => api.get("/api/chat/rooms/me"),
  getAdminRooms: () => api.get<ChatRoom[]>("/api/chat/rooms/admin/me"),
};

export const chatApi = {
  getMessages: (roomId: number) =>
    api.get<ChatMessage[]>(`/api/chat/rooms/${roomId}/messages`),

  // Upload file (ảnh/video/tài liệu)
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/chat/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
