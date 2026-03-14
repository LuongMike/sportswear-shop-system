import { useQuery } from "@tanstack/react-query";
import { brandApi } from "@/services/brandApi";
import { fallbackBrandsResponse } from "@/data";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const result = await brandApi.getAll();
        console.log("Brands result:", result);
        // brandApi.getAll() đã trả về { brands: Brand[] }
        return { data: result };
      } catch (error) {
        console.error("Error fetching brands:", error);
        return fallbackBrandsResponse;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
