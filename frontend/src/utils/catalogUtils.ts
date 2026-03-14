import type { Category, Brand, NavigationStructure } from "@/types/api";

/**
 * Utility functions for navigation and catalog data transformation
 */

/**
 * Transform API categories to frontend navigation structure
 */
export function transformCategoriesToNavigation(categories: Category[]) {
  return categories.map((category) => ({
    title: category.name,
    href:
      category.slug === "brands" ? "/brands" : `/collections/${category.slug}`,
    hasDropdown:
      (category.subcategories && category.subcategories.length > 0) ||
      category.slug === "brands" ||
      category.slug === "bo-suu-tap" ||
      category.slug === "sports",
    isSpecial: category.slug === "black-friday",
  }));
}

/**
 * Transform API categories to dropdown content
 */
export function transformCategoriesToDropdown(subcategories: Category[]) {
  if (!subcategories || subcategories.length === 0) {
    return [];
  }

  // Group subcategories by their main type
  const groups = new Map<string, Category[]>();

  subcategories.forEach((subcategory) => {
    let groupName = "KHÁC";

    // Better grouping logic based on subcategory names
    if (subcategory.name.toLowerCase().includes("giày")) {
      groupName = "GIÀY";
    } else if (
      subcategory.name.toLowerCase().includes("quần") ||
      subcategory.name.toLowerCase().includes("áo")
    ) {
      groupName = "QUẦN ÁO";
    } else if (subcategory.name.toLowerCase().includes("phụ kiện")) {
      groupName = "PHỤ KIỆN";
    } else {
      // For Bộ Sưu Tập, Thể Thao categories, use the name as group
      groupName = subcategory.name.toUpperCase();
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName)!.push(subcategory);
  });

  // Convert groups to sections
  const sections: { title: string; items: any[] }[] = [];

  groups.forEach((items, groupName) => {
    const sectionItems = items
      .map((subcategory) => {
        // For subcategories, check if they have their own subcategories
        const subItems = subcategory.subcategories || [];

        if (subItems.length > 0) {
          // If has sub-subcategories, add them
          return subItems.map((subSub) => ({
            name: subSub.name,
            href: `/collections/${subcategory.slug}/${subSub.slug}`,
            featured: false,
          }));
        } else {
          // If no sub-subcategories, add the subcategory itself
          return {
            name: subcategory.name,
            href: `/collections/${subcategory.slug}`,
            featured: false,
          };
        }
      })
      .flat();

    // Add "Tất Cả" item at the end
    sectionItems.push({
      name: `Tất Cả ${groupName}`,
      href: `/collections`,
      featured: true,
    });

    sections.push({
      title: groupName,
      items: sectionItems,
    });
  });

  return sections;
}

/**
 * Transform brands to navigation structure
 */
export function transformBrandsToDropdown(brands: Brand[]) {
  // Group brands by categories (could be by first letter, popularity, etc.)
  const featuredBrands = brands.filter((brand) => brand.isFeatured).slice(0, 8);
  const premiumBrands = brands.filter((brand) => brand.isPremium).slice(0, 8);
  const allBrands = brands.slice(0, 12);

  const sections = [];

  if (featuredBrands.length > 0) {
    sections.push({
      title: "THƯƠNG HIỆU NỔI BẬT",
      items: featuredBrands.map((brand) => ({
        name: brand.name,
        href: `/brands/${brand.slug}`,
        featured: false,
      })),
    });
  }

  if (premiumBrands.length > 0) {
    sections.push({
      title: "THƯƠNG HIỆU CAO CẤP",
      items: premiumBrands.map((brand) => ({
        name: brand.name,
        href: `/brands/${brand.slug}`,
        featured: false,
      })),
    });
  }

  sections.push({
    title: "TẤT CẢ THƯƠNG HIỆU",
    items: [
      ...allBrands.slice(0, 11).map((brand) => ({
        name: brand.name,
        href: `/brands/${brand.slug}`,
        featured: false,
      })),
      {
        name: "Xem Tất Cả Thương Hiệu",
        href: "/brands",
        featured: true,
      },
    ],
  });

  return sections;
}

/**
 * Get dropdown content based on category title
 */
export function getDropdownContent(categoryTitle: string, navigationData: any) {
  return [];
}

/**
 * Generate breadcrumb from category path
 */
export function generateBreadcrumb(
  category: Category
): { name: string; href: string }[] {
  const breadcrumb = [];
  let current = category;

  while (current) {
    breadcrumb.unshift({
      name: current.name,
      href: `/collections/${current.slug}`,
    });
    current = current.parentCategory as Category;
  }

  return [{ name: "Trang chủ", href: "/" }, ...breadcrumb];
}

/**
 * Format price with Vietnamese currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  salePrice: number
): number {
  if (!salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Generate product URL
 */
export function generateProductUrl(product: {
  slug: string;
  category: { slug: string };
}): string {
  return `/products/${product.slug}`;
}

/**
 * Generate category URL
 */
export function generateCategoryUrl(category: Category): string {
  if (category.parentCategory) {
    return `/collections/${category.parentCategory.slug}/${category.slug}`;
  }
  return `/collections/${category.slug}`;
}

/**
 * Generate brand URL
 */
export function generateBrandUrl(brand: Brand): string {
  return `/brands/${brand.slug}`;
}
