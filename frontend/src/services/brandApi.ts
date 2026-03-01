import api from "@/lib/axios";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  banner: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  getAll: async (): Promise<{ brands: Brand[] }> => {
    const response = await api.get("/api/products/brands");
    console.log("Raw response brands:", response.data);
    
    // Xử lý các dạng response khác nhau từ backend
    const rawData = response?.data;
    
    // Nếu response.data là array trực tiếp
    if (Array.isArray(rawData)) {
      return { brands: rawData };
    }
    
    // Nếu response.data.data là array
    if (Array.isArray(rawData?.data)) {
      return { brands: rawData.data };
    }
    
    // Nếu response.data đã có property brands
    if (Array.isArray(rawData?.brands)) {
      return { brands: rawData.brands };
    }
    
    // Fallback
    return { brands: [] };
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
