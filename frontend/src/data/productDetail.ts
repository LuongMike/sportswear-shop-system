import type { ProductDetailResponse } from "@/types/api";
import { fallbackProducts } from "./products";

/**
 * Tạo ProductDetailResponse từ ProductSummary
 * Dùng làm fallback khi API product detail không thành công
 */
function createDetailFromSummary(
  p: (typeof fallbackProducts)[0]
): ProductDetailResponse {
  const colors = (p.colors || ["Đen", "Trắng"]).map((name, i) => ({
    id: i + 1,
    name,
    hexCode: "#000000",
  }));
  const sizes = ["S", "M", "L", "XL"];

  const variants = colors.flatMap((c, ci) =>
    sizes.map((s, si) => ({
      id: ci * sizes.length + si + 1,
      sku: `${p.slug}-${c.id}-${s}`,
      price: String(p.basePrice),
      stockQuantity: 10,
      colorId: c.id,
      sizeName: s,
      imageUrls: [p.mainImageUrl || ""].filter(Boolean),
    }))
  );

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brandName: p.brandName || "",
    brand: p.brandName
      ? { id: 1, name: p.brandName, slug: p.brandName.toLowerCase().replace(/\s+/g, "-") }
      : null,
    basePrice: String(p.basePrice),
    description: `Sản phẩm ${p.name} - Đang dùng dữ liệu mẫu.`,
    specifications: null,
    note: null,
    colors,
    sizes,
    attributes: [],
    variants,
    categories: [],
    audiences: [],
    sports: [],
  };
}

const fallbackDetailsBySlug = new Map<string, ProductDetailResponse>();

for (const p of fallbackProducts) {
  fallbackDetailsBySlug.set(p.slug, createDetailFromSummary(p));
}

/**
 * Lấy product detail fallback theo slug
 * Trả về undefined nếu không có
 */
export function getFallbackProductDetail(
  slug: string
): ProductDetailResponse | undefined {
  return fallbackDetailsBySlug.get(slug);
}
