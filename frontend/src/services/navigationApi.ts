import api from "@/lib/axios";
import type { ApiResponse, NavigationStructure } from "@/types/api";

export class NavigationAPI {
  static async getNavigation(): Promise<ApiResponse<NavigationStructure>> {
    const response = await api.get("/api/navigation/main");
    console.log(response);

    return response.data;
  }
}

export default NavigationAPI;
