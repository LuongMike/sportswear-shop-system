import { useNavigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { User, UserCircle, Package, LogOut } from "lucide-react";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AuthDialog = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đăng xuất thất bại, vui lòng thử lại");
    }
  };

  return (
    <>
      {/* <button
        onClick={handleOnClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <User className="h-5 w-5 text-gray-700" />
      </button> */}

      {user ? (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="header" className="cursor-pointer">
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-3.5 mr-10">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (
                    user?.roleName === "Quản Trị Viên" ||
                    user?.roleName === "Người giao hàng"
                  ) {
                    navigate("/admin");
                  } else {
                    navigate("/account/profile");
                  }
                }}
                className="cursor-pointer"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Thông tin cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/account/orders")}
                className="cursor-pointer"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Đơn hàng của tôi</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Link to="/login">
          <Button variant="header" className="cursor-pointer">
            <User className="h-5 w-5 text-gray-700" />
          </Button>
        </Link>
      )}
    </>
  );
};

export default AuthDialog;
