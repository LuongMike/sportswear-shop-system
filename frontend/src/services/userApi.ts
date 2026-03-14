import api from "@/lib/axios";

export interface UserProfile {
  id?: number;
  email?: string;
  fullName?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  status?: string;
  [key: string]: unknown;
}

/** Khớp hoàn toàn với Entity UserAddress.java */
export interface UserAddress {
  id: number;
  recipientName: string;
  phoneNumber: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export const UserAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/api/user/profile/me");
    return (response.data?.data ?? response.data) as UserProfile;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put("/api/user/profile/me", data);
    return (response.data?.data ?? response.data) as UserProfile;
  },

  getAddresses: async (): Promise<UserAddress[]> => {
    const response = await api.get("/api/user/addresses");
    const list = response.data?.data ?? response.data ?? [];
    return Array.isArray(list) ? list : [];
  },

  createAddress: async (data: Omit<UserAddress, "id" | "isDefault">) => {
    const response = await api.post("/api/user/addresses", data);
    return response.data;
  },

  updateAddress: async (id: number, data: Partial<UserAddress>) => {
    const response = await api.put(`/api/user/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await api.delete(`/api/user/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id: number) => {
    const response = await api.patch(`/api/user/addresses/${id}/default`);
    return response.data;
  },
};
