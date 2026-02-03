import api from "@/lib/axios";

export interface Sport {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSportDTO {
  name: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSportDTO {
  name?: string;
  slug?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const sportApi = {
  getAll: async () => {
    const response = await api.get<{ data: Sport[] }>("/api/sports");
    return response.data;
  },

  create: async (data: CreateSportDTO) => {
    const response = await api.post<{ data: Sport }>("/api/sports", data);
    return response.data;
  },

  update: async (id: number, data: UpdateSportDTO) => {
    const response = await api.put<{ data: Sport }>(`/api/sports/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/sports/${id}`);
    return response.data;
  },
};
