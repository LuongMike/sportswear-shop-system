import type { Brand } from "@/services/brandApi";
import { brandsCategories } from "./navigation";

/**
 * Lấy danh sách thương hiệu từ navigation data
 * Dùng làm fallback khi API brands không thành công
 */
function getBrandsFromNavigation(): Brand[] {
  const seen = new Set<string>();
  const brands: Brand[] = [];
  let id = 1;

  for (const section of brandsCategories) {
    for (const item of section.items) {
      if (item.name === "Xem Tất Cả Thương Hiệu" || item.href === "/brands")
        continue;

      const slug = item.href.replace("/brands/", "");
      if (seen.has(slug)) continue;
      seen.add(slug);

      brands.push({
        id: id++,
        name: item.name,
        slug,
        logo: null,
        description: null,
        banner: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return brands;
}

export const fallbackBrands: Brand[] = getBrandsFromNavigation();

export const fallbackBrandsResponse = {
  data: {
    brands: fallbackBrands,
    count: fallbackBrands.length,
  },
};
