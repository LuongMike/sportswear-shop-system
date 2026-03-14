import { ReportsPage } from "@/features/admin/reports/ReportsPage";
import { BrandManager } from "@/features/admin/brands/BrandManager";
import { SportManager } from "@/features/admin/sports/SportManager";
import { ColorManager } from "@/features/admin/colors/ColorManager";
import { SizeManager } from "@/features/admin/sizes/SizeManager";
import { AttributeManager } from "@/features/admin/attributes/AttributeManager";
import { AudienceManager } from "@/features/admin/audiences/AudienceManager";
import { CategoryManager } from "@/features/admin/categories/CategoryManager";
import { ProductManager } from "@/features/admin/products/ProductManager";
import { OrderManager } from "@/features/admin/orders/OrderManager";
import { UserManager } from "@/features/admin/users/UserManager";
import { useAuthStore } from "@/store/useAuthStore";

interface AdminDashboardContentProps {
  selectedMenu: string;
}

export function AdminDashboardContent({
  selectedMenu,
}: AdminDashboardContentProps) {
  const { user } = useAuthStore();
  const roleName = user?.roleName;

  // Người giao hàng chỉ được vào trang Đơn hàng
  if (roleName === "Người giao hàng") {
    return <OrderManager />;
  }

  switch (selectedMenu) {
    case "reports":
      return <ReportsPage />;
    case "orders":
      return <OrderManager />;
    case "products":
      return <ProductManager />;
    case "users":
      return <UserManager />;
    case "categories":
      return <CategoryManager />;
    case "brands":
      return <BrandManager />;
    case "sports":
      return <SportManager />;
    case "audiences":
      return <AudienceManager />;
    case "attributes":
      return <AttributeManager />;
    case "colors":
      return <ColorManager />;
    case "sizes":
      return <SizeManager />;
    default:
      return <ReportsPage />;
  }
}
