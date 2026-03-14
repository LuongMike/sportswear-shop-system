import type { BackendProduct, ProductDetailResponse } from "@/types/api";

export const getBreadcrumb = (
  breadcrumbFromState?: { label: string; href: string }[],
  product?: BackendProduct | ProductDetailResponse | null
) => {
  // 1. Ưu tiên dùng breadcrumb từ state (ngữ cảnh người dùng)
  if (breadcrumbFromState) {
    return [
      ...breadcrumbFromState,
      { label: product?.name || "Sản phẩm", href: "" },
    ];
  }

  // 2. Nếu không có state, fallback về breadcrumb mặc định dựa trên category chính
  const items = [{ label: "Trang chủ", href: "/" }];

  // Check if product has category_ids (BackendProduct)
  if (product && "category_ids" in product) {
    // Tìm category chính (is_primary = true) hoặc lấy cái đầu tiên
    const primaryCategory =
      product.category_ids?.find((c) => c.is_primary) ||
      product.category_ids?.[0];

    if (primaryCategory) {
      items.push({
        // label: primaryCategory.name || "Sản phẩm",
        label: "Sản phẩm",
        href: `/collections/${primaryCategory._id}`,
      });
    } else {
      items.push({ label: "Sản phẩm", href: "/collections" });
    }
  } else {
    // Fallback for ProductDetailResponse (no categories yet)
    items.push({ label: "Sản phẩm", href: "/collections" });
  }

  items.push({ label: product?.name || "Chi tiết", href: "" });
  return items;
};
