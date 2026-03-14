import { useQuery } from "@tanstack/react-query";
import { ProductsAPI, type ProductFilters } from "@/services/productsApi";

interface UseProductsOptions {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useProducts({ filters = {}, page = 1, limit = 20, enabled = true }: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", filters, page, limit],
    queryFn: () => ProductsAPI.getProducts(filters, page, limit),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
