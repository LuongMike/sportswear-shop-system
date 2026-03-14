import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface Color {
  id: number;
  name: string;
  hexCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateColorDTO {
  name: string;
  hexCode: string;
}

export interface UpdateColorDTO {
  name?: string;
  hexCode?: string;
}

export const colorApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Color[]>>("/api/colors");
    return response.data;
  },

  create: async (data: CreateColorDTO) => {
    const response = await api.post<ApiResponse<Color>>("/api/colors", data);
    return response.data;
  },

  update: async (id: number, data: UpdateColorDTO) => {
    const response = await api.put<ApiResponse<Color>>(
      `/api/colors/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/api/colors/${id}`);
    return response.data;
  },
};

export const ColorAPI = colorApi;
