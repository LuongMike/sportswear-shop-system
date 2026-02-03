import { useQuery } from "@tanstack/react-query";
import { ProductsAPI } from "@/services/productsApi";
import type { ProductFilters } from "@/services/productsApi";
import {
  fallbackProductsResponse,
  getFallbackProductsByBrand,
} from "@/data";

export interface UseProductsParams {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useProducts({
  filters = {},
  page = 1,
  limit = 20,
  enabled = true,
}: UseProductsParams = {}) {
  return useQuery({
    queryKey: ["products", filters, page, limit],
    queryFn: async () => {
      try {
        return await ProductsAPI.getProducts(filters, page, limit);
      } catch {
        const data = getFallbackProductsByBrand(filters?.brand) ?? fallbackProductsResponse.data;
        const total = data.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const start = (page - 1) * limit;
        const paginatedData = data.slice(start, start + limit);
        return {
          success: true,
          data: paginatedData,
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        };
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
