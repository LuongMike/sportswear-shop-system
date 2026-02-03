import {
  LayoutDashboard,
  //   Settings,
  Users,
  Package,
  ShoppingBag,
  Tag,
  Dumbbell,
  Palette,
  Ruler,
  ListTree,
  Layers,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoomList } from "@/features/admin/chat/components/ChatRoomList";
import { Separator } from "@/components/ui/separator";

// --- DỮ LIỆU MENU ---
const SYSTEM_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "orders",
    label: "Đơn hàng",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  { id: "products", label: "Sản phẩm", icon: <Package className="w-5 h-5" /> },
  { id: "users", label: "Khách hàng", icon: <Users className="w-5 h-5" /> },
];

const CATALOG_MENU = [
  {
    id: "categories",
    label: "Danh mục",
    icon: <ListTree className="w-5 h-5" />,
  },
  { id: "brands", label: "Thương hiệu", icon: <Tag className="w-5 h-5" /> },
  {
    id: "sports",
    label: "Môn thể thao",
    icon: <Dumbbell className="w-5 h-5" />,
  },
  {
    id: "audiences",
    label: "Đối tượng",
    icon: <UserCircle className="w-5 h-5" />,
  },
  {
    id: "attributes",
    label: "Thuộc tính",
    icon: <Layers className="w-5 h-5" />,
  },
  { id: "colors", label: "Màu sắc", icon: <Palette className="w-5 h-5" /> },
  { id: "sizes", label: "Kích cỡ", icon: <Ruler className="w-5 h-5" /> },
];

interface AdminSecondarySidebarProps {
  activePrimary: "system" | "chat";
  selectedMenu: string;
  setSelectedMenu: (id: string) => void;
  rooms: any[];
  selectedRoomId: number | null;
  onSelectRoom: (id: number) => void;
}

export function AdminSecondarySidebar({
  activePrimary,
  selectedMenu,
  setSelectedMenu,
  rooms,
  selectedRoomId,
  onSelectRoom,
}: AdminSecondarySidebarProps) {
  return (
    <aside className="w-80 bg-background border-r flex flex-col flex-none transition-all duration-300">
      {/* Header Cột B */}
      <div className="h-16 border-b flex items-center px-6">
        <h2 className="font-semibold text-lg tracking-tight">
          {activePrimary === "system" ? "Menu Quản Trị" : "Hộp Thoại"}
        </h2>
      </div>

      {/* Nội dung Cột B */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* --- VIEW: SYSTEM MENU --- */}
          {activePrimary === "system" && (
            <>
              <div className="space-y-1">
                {SYSTEM_MENU.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedMenu === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 text-base ${
                      selectedMenu === item.id
                        ? "bg-slate-100 dark:bg-slate-800 font-medium"
                        : "text-slate-500"
                    }`}
                    onClick={() => setSelectedMenu(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>

              <Separator className="my-4" />
              <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Danh mục (Catalog)
              </div>

              <div className="space-y-1">
                {CATALOG_MENU.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedMenu === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 text-base ${
                      selectedMenu === item.id
                        ? "bg-slate-100 dark:bg-slate-800 font-medium"
                        : "text-slate-500"
                    }`}
                    onClick={() => setSelectedMenu(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* --- VIEW: CHAT LIST --- */}
          {activePrimary === "chat" && (
            <ChatRoomList
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={onSelectRoom}
            />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
