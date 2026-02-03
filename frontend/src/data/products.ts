import type { ProductSummary } from "@/types/api";
import { fallbackBrands } from "./brands";

/**
 * Sản phẩm mẫu fallback khi API products không thành công
 */
export const fallbackProducts: ProductSummary[] = [
  {
    id: 1,
    name: "Giày Chạy Bộ Nam Nike Air Max",
    slug: "giay-chay-bo-nam-nike-air-max",
    basePrice: 2500000,
    brandName: "Nike",
    mainImageUrl: "https://placehold.co/600x600?text=Nike+Air+Max",
    colors: ["Đen", "Trắng", "Đỏ"],
  },
  {
    id: 2,
    name: "Áo Thun Thể Thao Adidas",
    slug: "ao-thun-the-thao-adidas",
    basePrice: 450000,
    brandName: "Adidas",
    mainImageUrl: "https://placehold.co/600x600?text=Adidas+Shirt",
    colors: ["Đen", "Trắng", "Xanh navy"],
  },
  {
    id: 3,
    name: "Quần Short Puma Essentials",
    slug: "quan-short-puma-essentials",
    basePrice: 350000,
    brandName: "Puma",
    mainImageUrl: "https://placehold.co/600x600?text=Puma+Short",
    colors: ["Đen", "Xám", "Xanh navy"],
  },
  {
    id: 4,
    name: "Giày Sneakers New Balance 574",
    slug: "giay-sneakers-new-balance-574",
    basePrice: 2200000,
    brandName: "New Balance",
    mainImageUrl: "https://placehold.co/600x600?text=NB+574",
    colors: ["Xám", "Be", "Đen"],
  },
  {
    id: 5,
    name: "Áo Khoác Nike Sportswear",
    slug: "ao-khoac-nike-sportswear",
    basePrice: 1200000,
    brandName: "Nike",
    mainImageUrl: "https://placehold.co/600x600?text=Nike+Jacket",
    colors: ["Đen", "Xanh navy", "Xám"],
  },
  {
    id: 6,
    name: "Giày Converse Chuck Taylor",
    slug: "giay-converse-chuck-taylor",
    basePrice: 1500000,
    brandName: "Converse",
    mainImageUrl: "https://placehold.co/600x600?text=Converse+Chuck",
    colors: ["Trắng", "Đen", "Đỏ"],
  },
  {
    id: 7,
    name: "Balo Thể Thao Vans",
    slug: "balo-the-thao-vans",
    basePrice: 650000,
    brandName: "Vans",
    mainImageUrl: "https://placehold.co/600x600?text=Vans+Bag",
    colors: ["Đen", "Xanh navy"],
  },
  {
    id: 8,
    name: "Giày Bóng Đá Adidas Predator",
    slug: "giay-bong-da-adidas-predator",
    basePrice: 3200000,
    brandName: "Adidas",
    mainImageUrl: "https://placehold.co/600x600?text=Predator",
    colors: ["Đen", "Trắng", "Đỏ"],
  },
];

/**
 * Lọc sản phẩm theo brand slug (để dùng cho ProductsByBrand)
 */
export function getFallbackProductsByBrand(brandSlug?: string): ProductSummary[] {
  if (!brandSlug) return fallbackProducts;

  const brand = fallbackBrands.find((b) => b.slug === brandSlug);
  if (!brand) return fallbackProducts;

  return fallbackProducts.filter(
    (p) => p.brandName?.toLowerCase() === brand.name.toLowerCase()
  );
}

export const fallbackProductsResponse = {
  success: true,
  data: fallbackProducts,
  pagination: {
    total: fallbackProducts.length,
    page: 1,
    limit: fallbackProducts.length,
    totalPages: 1,
  },
};
