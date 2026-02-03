import { LayoutDashboard, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminSidebarProps {
  activePrimary: "system" | "chat";
  setActivePrimary: (value: "system" | "chat") => void;
  unreadCount: number;
}

export function AdminSidebar({
  activePrimary,
  setActivePrimary,
  unreadCount,
}: AdminSidebarProps) {
  return (
    <aside className="w-[70px] bg-slate-950 flex flex-col items-center py-6 gap-6 z-20 flex-none text-slate-50">
      {/* Logo */}
      <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-bold text-primary-foreground text-lg shadow-lg">
        S
      </div>

      <Separator className="bg-slate-800 w-10" />

      {/* Nút Quản Lý */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant={activePrimary === "system" ? "secondary" : "ghost"}
            size="icon"
            className={`h-12 w-12 rounded-xl transition-all ${
              activePrimary === "system"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => setActivePrimary("system")}
          >
            <LayoutDashboard className="w-6 h-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Quản lý hệ thống</TooltipContent>
      </Tooltip>

      {/* Nút Chat (kèm Badge) */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              variant={activePrimary === "chat" ? "secondary" : "ghost"}
              size="icon"
              className={`h-12 w-12 rounded-xl transition-all ${
                activePrimary === "chat"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActivePrimary("chat")}
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
            {/* Badge thông báo đỏ chót */}
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-slate-950"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">Tin nhắn khách hàng</TooltipContent>
      </Tooltip>

      <div className="mt-auto flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </div>
    </aside>
  );
}
