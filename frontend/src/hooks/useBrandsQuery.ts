import { useQuery } from "@tanstack/react-query";
import { brandApi } from "@/services/brandApi";
import { fallbackBrandsResponse } from "@/data";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        return await brandApi.getAll();
      } catch {
        return fallbackBrandsResponse;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
