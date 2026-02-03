import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout Components
import { AdminSidebar } from "@/features/admin/layout/AdminSidebar";
import { AdminSecondarySidebar } from "@/features/admin/layout/AdminSecondarySidebar";
import { AdminHeader } from "@/features/admin/layout/AdminHeader";
import { AdminDashboardContent } from "@/features/admin/dashboard/AdminDashboardContent";

// Chat Components & Hooks
import { useAdminChat } from "@/features/admin/chat/hooks/useAdminChat";
import { ChatWindow } from "@/features/admin/chat/components/ChatWindow";
import { ImagePreviewModal } from "@/features/admin/chat/components/ImagePreviewModal";

export default function AdminDashboard() {
  // State: Tab chính (System vs Chat)
  const [activePrimary, setActivePrimary] = useState<"system" | "chat">(
    "system"
  );

  // State: Mục được chọn
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  // Chat Hook
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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <TooltipProvider>
        {/* =========================================
           CỘT A: PRIMARY SIDEBAR (Icon Navigation)
           ========================================= */}
        <AdminSidebar
          activePrimary={activePrimary}
          setActivePrimary={setActivePrimary}
          unreadCount={rooms.filter((r) => r.hasUnread).length}
        />

        {/* =========================================
           CỘT B: SECONDARY SIDEBAR (Context List)
           ========================================= */}
        <AdminSecondarySidebar
          activePrimary={activePrimary}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          rooms={rooms}
          selectedRoomId={Number(selectedRoomId)}
          onSelectRoom={setSelectedRoomId}
        />

        {/* =========================================
           CỘT C: MAIN AREA (Workspace)
           ========================================= */}
        <main className="flex-1 bg-slate-50/50 dark:bg-slate-950 flex flex-col min-w-0">
          {/* Header Cột C */}
          <AdminHeader
            activePrimary={activePrimary}
            selectedRoomId={Number(selectedRoomId)}
          />

          {/* Nội dung chính */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {/* --- CASE: SYSTEM DASHBOARD --- */}
            {activePrimary === "system" && (
              <AdminDashboardContent selectedMenu={selectedMenu} />
            )}

            {/* --- CASE: CHAT UI --- */}
            {activePrimary === "chat" && (
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
            )}
          </div>
        </main>
      </TooltipProvider>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
