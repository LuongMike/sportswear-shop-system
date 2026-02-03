import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface Size {
  id: number;
  name: string;
  chartType: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSizeDTO {
  name: string;
  chartType: string;
  sortOrder?: number;
}

export interface UpdateSizeDTO {
  name?: string;
  chartType?: string;
  sortOrder?: number;
}

export interface PaginatedResponse<T> {
  sizes: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const sizeApi = {
  getAll: async (params?: {
    chartType?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<
      ApiResponse<Size[] | PaginatedResponse<Size>>
    >("/api/sizes", { params });
    return response.data;
  },

  getChartTypes: async () => {
    const response = await api.get<ApiResponse<string[]>>(
      "/api/sizes/chart/type"
    );
    return response.data;
  },

  create: async (data: CreateSizeDTO) => {
    const response = await api.post<ApiResponse<Size>>("/api/sizes", data);
    return response.data;
  },

  update: async (id: number, data: UpdateSizeDTO) => {
    const response = await api.put<ApiResponse<Size>>(`/api/sizes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/api/sizes/${id}`);
    return response.data;
  },
};
