import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  activePrimary: "system" | "chat";
  selectedRoomId: number | null;
}

export function AdminHeader({
  activePrimary,
  selectedRoomId,
}: AdminHeaderProps) {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-none">
      <div className="flex items-center gap-2">
        {activePrimary === "chat" && selectedRoomId ? (
          <>
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50"
            >
              Online
            </Badge>
            <span className="font-semibold text-sm">
              Đang chat với khách hàng #{selectedRoomId}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            Tổng quan hệ thống
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-900 text-white">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
