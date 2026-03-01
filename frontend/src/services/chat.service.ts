import api from "@/lib/axios";

export interface ChatRoom {
  id: number;
  customerName: string;
  adminName?: string;
  lastMessageAt?: string;
  hasUnread?: boolean;
  type: "ADMIN_SUPPORT" | "AI_SUPPORT"; // Bắt buộc
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: "ADMIN" | "CUSTOMER";
  sentAt: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
}

export const chatRoomApi = {
  createRoom: (data: {
    customerName: string;
    type: "ADMIN_SUPPORT" | "AI_SUPPORT";
  }) => api.post<ChatRoom>("/api/chat/rooms", data),

  getMyRooms: (customerName: string) =>
    api.get<ChatRoom[]>("/api/chat/rooms/me", {
      params: { customerName }, // Bắt buộc truyền params này theo Controller
    }),

  getAdminRooms: () => api.get<ChatRoom[]>("/api/chat/rooms/admin/me"),
};

export const chatApi = {
  getMessages: (roomId: number) =>
    api.get<ChatMessage[]>(`/api/chat/rooms/${roomId}/messages`),

  // Sửa: Trả về đối tượng tin nhắn đơn lẻ thay vì mảng
  sendMessage: (roomId: number, data: SendMessageDTO) =>
    api.post<ChatMessage>(`/api/chat/rooms/${roomId}/messages`, data),
};
