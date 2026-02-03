import api from "@/lib/axios";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  banner: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDTO {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  banner?: string;
  isActive?: boolean;
}

export interface UpdateBrandDTO {
  name?: string;
  slug?: string;
  logo?: string;
  description?: string;
  banner?: string;
  isActive?: boolean;
}

export const brandApi = {
  getAll: async () => {
    const response = await api.get<{
      data: { brands: Brand[]; count: number };
    }>("/api/brands");
    return response.data;
  },

  create: async (data: CreateBrandDTO) => {
    const response = await api.post<{ data: Brand }>("/api/brands", data);
    return response.data;
  },

  update: async (id: number, data: UpdateBrandDTO) => {
    const response = await api.put<{ data: Brand }>(`/api/brands/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/brands/${id}`);
    return response.data;
  },
};
