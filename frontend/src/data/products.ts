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
    mainImageUrl:
      "https://tse3.mm.bing.net/th/id/OIP.85AYSgrdV6R0rsEwcd6gQAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Đen", "Trắng", "Đỏ"],
  },
  {
    id: 2,
    name: "Áo Thun Thể Thao Adidas",
    slug: "ao-thun-the-thao-adidas",
    basePrice: 450000,
    brandName: "Adidas",
    mainImageUrl:
      "https://tse4.mm.bing.net/th/id/OIP.m0N74m7AT1B_kRwY3E2sGgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Đen", "Trắng", "Xanh navy"],
  },
  {
    id: 3,
    name: "Quần Short Puma Essentials",
    slug: "quan-short-puma-essentials",
    basePrice: 350000,
    brandName: "Puma",
    mainImageUrl:
      "https://tse1.mm.bing.net/th/id/OIP.bRCRpqJBVePqLHBOrYrQFwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Đen", "Xám", "Xanh navy"],
  },
  {
    id: 4,
    name: "Giày Sneakers New Balance 574",
    slug: "giay-sneakers-new-balance-574",
    basePrice: 2200000,
    brandName: "New Balance",
    mainImageUrl:
      "https://saigonsneaker.com/wp-content/uploads/2022/09/new-balance-ml574ba2-meestele-tossud-hall-ml574ba2_2-1024x1024.jpg",
    colors: ["Xám", "Be", "Đen"],
  },
  {
    id: 5,
    name: "Áo Khoác Nike Sportswear",
    slug: "ao-khoac-nike-sportswear",
    basePrice: 1200000,
    brandName: "Nike",
    mainImageUrl:
      "https://tse4.mm.bing.net/th/id/OIP.7HP7RskxQqZifWNlkXrn1gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Đen", "Xanh navy", "Xám"],
  },
  {
    id: 6,
    name: "Giày Converse Chuck Taylor",
    slug: "giay-converse-chuck-taylor",
    basePrice: 1500000,
    brandName: "Converse",
    mainImageUrl:
      "https://tse1.mm.bing.net/th/id/OIP.ywlxJbVg6Lm8lU2Gv0aamwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Trắng", "Đen", "Đỏ"],
  },
  {
    id: 7,
    name: "Balo Thể Thao Vans",
    slug: "balo-the-thao-vans",
    basePrice: 650000,
    brandName: "Vans",
    mainImageUrl:
      "https://tse2.mm.bing.net/th/id/OIP.lSKJIyv28Y8LPeV-R_ccmQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
    colors: ["Đen", "Xanh navy"],
  },
  {
    id: 8,
    name: "Giày Bóng Đá Adidas Predator",
    slug: "giay-bong-da-adidas-predator",
    basePrice: 3200000,
    brandName: "Adidas",
    mainImageUrl:
      "https://product.hstatic.net/200000278317/product/g-futsal-giay-da-bong-adidas-predator-25-league-l-tf-id0910-do-trang-1_66f2c88ff5814025bc42506fd4c440c3_master.jpg",
    colors: ["Đen", "Trắng", "Đỏ"],
  },
];

/**
 * Lọc sản phẩm theo brand slug (để dùng cho ProductsByBrand)
 */
export function getFallbackProductsByBrand(
  brandSlug?: string,
): ProductSummary[] {
  if (!brandSlug) return fallbackProducts;

  const brand = fallbackBrands.find((b) => b.slug === brandSlug);
  if (!brand) return fallbackProducts;

  return fallbackProducts.filter(
    (p) => p.brandName?.toLowerCase() === brand.name.toLowerCase(),
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
