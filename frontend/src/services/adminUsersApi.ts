import api from "@/lib/axios";

export interface AdminUserSummary {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  roleName?: string;
  status?: string;
  [key: string]: any;
}

export interface AdminUserDetail extends AdminUserSummary {
  addresses?: any[];
}

export interface AdminUserCreateRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  roleName?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export interface AdminUserUpdateRequest {
  roleName?: string;
  phoneNumber?: string;
  status?: boolean;
  [key: string]: any;
}

export const adminUsersApi = {
  // GET /api/admin/users
  getAll: async (): Promise<AdminUserSummary[]> => {
    const res = await api.get("/api/admin/users");
    const data = res.data?.data ?? res.data ?? [];
    return Array.isArray(data) ? data : [];
  },

  // GET /api/admin/users/{id}
  getDetail: async (id: number): Promise<AdminUserDetail> => {
    const res = await api.get(`/api/admin/users/${id}`);
    return (res.data?.data ?? res.data) as AdminUserDetail;
  },

  // POST /api/admin/users
  create: async (
    payload: AdminUserCreateRequest,
  ): Promise<AdminUserSummary> => {
    const res = await api.post("/api/admin/users", payload);
    return (res.data?.data ?? res.data) as AdminUserSummary;
  },

  // PUT /api/admin/users/{id}
  update: async (
    id: number,
    payload: AdminUserUpdateRequest,
  ): Promise<AdminUserDetail> => {
    const res = await api.put(`/api/admin/users/${id}`, payload);
    return (res.data?.data ?? res.data) as AdminUserDetail;
  },

  // DELETE /api/admin/users/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },
};

