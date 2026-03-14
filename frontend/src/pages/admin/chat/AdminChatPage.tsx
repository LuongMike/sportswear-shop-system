import React from "react";
import { ChatRoomList } from "@/features/admin/chat/components/ChatRoomList";
import { ChatWindow } from "@/features/admin/chat/components/ChatWindow";
import { ImagePreviewModal } from "@/features/admin/chat/components/ImagePreviewModal";
import { useAdminChat } from "@/features/admin/chat/hooks/useAdminChat";

export default function AdminChatPage() {
  const {
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
  } = useAdminChat();

  return (
    <div className="flex h-[80vh] max-h-[700px] bg-white rounded-lg shadow-lg overflow-hidden border">
      {/* Danh sách phòng chat */}
      <div className="w-80 border-r bg-slate-50 p-4 overflow-y-auto">
        <ChatRoomList
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />
      </div>
      {/* Khu vực chat */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          selectedRoomId={selectedRoomId}
          messages={messages}
          text={text}
          setText={setText}
          pendingFile={pendingFile}
          setPendingFile={setPendingFile}
          handleSend={handleSend}
          handleFileChange={handleFileChange}
          setPreviewImage={setPreviewImage}
        />
      </div>
      {/* Preview ảnh */}
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
