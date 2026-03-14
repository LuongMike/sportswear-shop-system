// import type { ProductFilters as APIProductFilters } from "@/services/productsApi";

import type { PageType } from "@/types/PageType";

export const generateBreadcrumbs = (
  pageType: PageType,
  category?: string,
  subcategory?: string,
  subsubcategory?: string
) => {
  const items = [{ label: "Trang chủ", href: "/" }];

  if (
    pageType.type === "category" ||
    pageType.type === "subcategory" ||
    pageType.type === "nested"
  ) {
    // Collections base
    items.push({ label: "Collections", href: "/collections" });

    // Category level
    if (category) {
      const categoryLabel =
        category === "nam"
          ? "Nam"
          : category === "nu"
          ? "Nữ"
          : category === "tre-em"
          ? "Trẻ em"
          : category.charAt(0).toUpperCase() + category.slice(1);
      items.push({
        label: categoryLabel,
        href: `/collections/${category}`,
      });
    }

    // Subcategory level
    if (subcategory) {
      const subcategoryLabel = subcategory
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      items.push({
        label: subcategoryLabel,
        href: `/collections/${category}/${subcategory}`,
      });
    }

    // Subsubcategory level
    if (subsubcategory) {
      const subsubcategoryLabel = subsubcategory
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      items.push({
        label: subsubcategoryLabel,
        href: `/collections/${category}/${subcategory}/${subsubcategory}`,
      });
    }
  } else if (pageType.type === "gender") {
    const label =
      pageType.value === "nam"
        ? "Nam"
        : pageType.value === "nu"
        ? "Nữ"
        : "Trẻ em";
    items.push({ label, href: `/collections/${pageType.value}` });
  } else if (pageType.type === "brand") {
    items.push({
      label: pageType.value?.toUpperCase() || "",
      href: `/brands/${pageType.value}`,
    });
  } else if (pageType.type === "badge") {
    if (pageType.value === "hang-moi") {
      items.push({ label: "Hàng Mới", href: "/collections/new-arrivals" });
    } else {
      items.push({ label: pageType.value || "", href: "" });
    }
  } else if (pageType.type === "sport") {
    items.push({
      label: pageType.value || "",
      href: `/sports/${pageType.value}`,
    });
  } else if (pageType.type === "search") {
    items.push({
      label: `Tìm kiếm: "${pageType.value}"`,
      href: `/search?q=${pageType.value}`,
    });
  }

  return items;
};

export const generatePageTitle = (
  pageType: PageType,
  category?: string,
  subcategory?: string,
  subsubcategory?: string
) => {
  if (pageType.type === "gender") {
    return pageType.value === "nam"
      ? "Sản phẩm Nam"
      : pageType.value === "nu"
      ? "Sản phẩm Nữ"
      : "Sản phẩm Trẻ em";
  } else if (pageType.type === "category") {
    return category === "nam"
      ? "Sản phẩm Nam"
      : category === "nu"
      ? "Sản phẩm Nữ"
      : category === "tre-em"
      ? "Sản phẩm Trẻ em"
      : `Sản phẩm ${category}`;
  } else if (pageType.type === "subcategory") {
    const subcategoryLabel =
      subcategory
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "";
    return `${subcategoryLabel} - ${
      category === "nam" ? "Nam" : category === "nu" ? "Nữ" : "Trẻ em"
    }`;
  } else if (pageType.type === "nested") {
    const subsubcategoryLabel =
      subsubcategory
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "";
    return subsubcategoryLabel;
  } else if (pageType.type === "brand") {
    return `Sản phẩm ${pageType.value?.toUpperCase()}`;
  } else if (pageType.type === "badge") {
    if (pageType.value === "hang-moi") return "Hàng Mới Về";
    return `Sản phẩm ${pageType.value}`;
  } else if (pageType.type === "sport") {
    return `Sản phẩm ${pageType.value}`;
  } else if (pageType.type === "search") {
    return `Kết quả tìm kiếm: "${pageType.value}"`;
  }
  return "Tất cả sản phẩm";
};
