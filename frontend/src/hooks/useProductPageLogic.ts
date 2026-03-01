import { useSearchParams } from "react-router";
import { useMemo, useState, useCallback } from "react";
import type { ProductFilters } from "@/services/productsApi";

export const useProductPageLogic = () => {
  const [searchParams] = useSearchParams();

  // Lấy filters từ URL params
  const urlFilters = useMemo(
    () => ({
      categoryId: searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : undefined,
      brandId: searchParams.get("brandId")
        ? Number(searchParams.get("brandId"))
        : undefined,
      sportId: searchParams.get("sportId")
        ? Number(searchParams.get("sportId"))
        : undefined,
      search: searchParams.get("q") || undefined,
    }),
    [searchParams],
  );

  // UI filters state
  const [filters, setFilters] = useState<ProductFilters>({
    search: urlFilters.search || "",
    minPrice: undefined,
    maxPrice: undefined,
    brand: undefined,
  });

  const [sortBy, setSortBy] = useState("newest");

  // Merge URL filters với UI filters
  const mergedFilters = useMemo<ProductFilters>(() => ({
    ...urlFilters,
    ...filters,
    // Ưu tiên search từ UI nếu có, không thì lấy từ URL
    search: filters.search || urlFilters.search || undefined,
  }), [urlFilters, filters]);

  // Update filters handler
  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    filters: mergedFilters,
    setFilters: updateFilters,
    sortBy,
    setSortBy,
    breadcrumbs: [
      { label: "Trang chủ", href: "/" },
      { label: "Sản phẩm", href: "/collections" },
    ],
    pageTitle: urlFilters.categoryId
      ? "Danh mục sản phẩm"
      : urlFilters.search
      ? `Kết quả tìm kiếm: "${urlFilters.search}"`
      : "Tất cả sản phẩm",
  };
};
