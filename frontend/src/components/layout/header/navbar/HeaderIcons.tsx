import AuthDialog from "@/components/auth/AuthDialog";
import { Search, ShoppingBag } from "lucide-react";
import CartSheet from "../CartSheet";

const HeaderIcons = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Search */}
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-200 w-60 ">
        <Search className="h-5 w-5 text-gray-700" />
      </button>

      {/* Account */}
      <AuthDialog />

      {/* Shopping Bag */}
      <CartSheet />
    </div>
  );
};

export default HeaderIcons;
