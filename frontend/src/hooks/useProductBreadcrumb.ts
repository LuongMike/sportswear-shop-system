import { useLocation } from "react-router";
import type { BackendProduct } from "@/types/api";

export const useProductBreadcrumb = (product: BackendProduct | null) => {
  const location = useLocation();
  const breadcrumbFromState = location.state?.breadcrumb;

  if (!product) return [];

  // 1. Ưu tiên dùng breadcrumb từ state (ngữ cảnh người dùng)
  if (breadcrumbFromState) {
    return [
      ...breadcrumbFromState,
      { label: product.name || "Sản phẩm", href: "" },
    ];
  }

  // 2. Nếu không có state, fallback về breadcrumb mặc định dựa trên category chính
  const items = [{ label: "Trang chủ", href: "/" }];

  // Tìm category chính (is_primary = true) hoặc lấy cái đầu tiên
  const primaryCategory =
    product.category_ids?.find((c) => c.is_primary) ||
    product.category_ids?.[0];

  if (primaryCategory) {
    items.push({
      label: primaryCategory.name || "Sản phẩm",
      href: `/collections/${primaryCategory.slug}`,
    });
  } else {
    items.push({ label: "Sản phẩm", href: "/collections" });
  }

  items.push({ label: product.name || "Chi tiết", href: "" });
  return items;
};
