import { useQuery } from "@tanstack/react-query";
import NavigationAPI from "@/services/navigationApi";

export function useNavigation() {
  return useQuery({
    queryKey: ["navigation", "main"],
    queryFn: () => NavigationAPI.getNavigation(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
