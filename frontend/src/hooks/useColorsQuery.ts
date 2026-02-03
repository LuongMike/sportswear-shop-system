import { useQuery } from "@tanstack/react-query";
import { ColorAPI } from "@/services/colorApi";
import { fallbackColorsResponse } from "@/data";

export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        return await ColorAPI.getAll();
      } catch {
        return fallbackColorsResponse;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
